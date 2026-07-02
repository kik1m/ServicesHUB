import { chatRateLimiter, suggestionsRateLimiter } from '../../../../../lib/rateLimiter';
import { authenticateAndCheckQuota } from '../_lib/auth';
import { buildSystemPrompt, buildToneAndLangPrompts } from '../_lib/promptBuilder';
import { buildToolsArray } from '../_lib/toolsRegistry';
import { compressContext } from '../_lib/contextCompressor';
import { createStream } from '../_lib/streamEngine';
import { classifyIntentAndGetTemplate } from '../_lib/intentClassifier';
import { supabaseAdmin } from '../../../../../lib/supabaseAdmin';
import platformManifest from '../../../../../data/platform_manifest.json';
import databaseDictionary from '../../../../../data/database_dictionary.json';
import { MODELS } from '../../../../../config/models.config';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes max duration for Vercel

const corsHeaders = {
    'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_SITE_URL || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
};

export async function OPTIONS() {
    return new Response(null, { status: 204, headers: corsHeaders });
}

// Use standard env for keys
const getApiKeys = () => process.env.GEMINI_API_KEY?.split(',') || [];

export async function POST(req) {
    try {
        const body = await req.json();
        const { messages, modelType: rawModelType, selectedModel, action, workspaceContext, aiSettings, user_id, tool1Context, tool2Context, experienceLevel, mode, activeWorkflowState } = body;
        const modelType = rawModelType || selectedModel; // frontend sends selectedModel, some tests send modelType

        // 🛡️ P1: Rate Limiting
        const ip = req.headers.get('x-forwarded-for') || 'anonymous';
        const limiter = action === 'generate_suggestions' ? suggestionsRateLimiter : chatRateLimiter;
        const { success } = await limiter.limit(ip);
        if (!success) {
            return new Response(JSON.stringify({ error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please slow down.' }), { status: 429 });
        }

        // 🔑 Phase 3: Auth & Quota (Modularized)
        const { verifiedUserId, isPremium, subscriptionTier, userRole, userContextPrompt, messagesToday, error: authError, message: authMessage } = await authenticateAndCheckQuota(req, action);
        
        // 🔍 DIAGNOSTIC LOG — Remove after debugging


        
        if (authError) {
            return new Response(JSON.stringify({ error: authError, message: authMessage }), { status: 403, headers: { 'Content-Type': 'application/json' } });
        }

        // 🛡️ P3: Model Tier Enforcement (Admins bypass all tier restrictions)
        let resolvedModelType = modelType;
        if (action !== 'generate_suggestions' && modelType && userRole !== 'admin') {
            const selectedModel = Object.values(MODELS).find(m => m.id === modelType) || MODELS.GEMINI_FLASH;
            resolvedModelType = selectedModel.id; // Force valid model name to prevent OpenRouter bypassing
            const tierValue = { 'free': 0, 'pro': 1, 'elite': 2 };
            const userTierVal = tierValue[subscriptionTier] || 0;
            const requiredTierVal = tierValue[selectedModel.minTier] || 0;

            if (userTierVal < requiredTierVal) {
                return new Response(JSON.stringify({ 
                    error: 'UPGRADE_REQUIRED', 
                    message: `The ${selectedModel.displayName} model requires the ${selectedModel.minTier.toUpperCase()} plan. Please upgrade to access this model.` 
                }), { status: 403, headers: { 'Content-Type': 'application/json' } });
            }
        }

        const keys = getApiKeys();
        if (keys.length === 0) {
            return new Response(JSON.stringify({ error: 'MISSING_API_KEY', message: 'Gemini API keys are not configured.' }), { status: 500 });
        }

        const openRouterKey = process.env.OPENROUTER_API_KEY;
        const isComparisonMode = !!(tool1Context && tool2Context);

        // 🛡️ P2: System Prompt Sanitizer
        const sanitizeInput = (text) => text.replace(/<system>.*?<\/system>/gis, '').replace(/\[INST\]|\[\/INST\]|<<SYS>>|<\/SYS>>/gi, '').trim();

        let formattedMessages = (messages || [])
            .filter(m => m.content?.trim())
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.role === 'user' ? sanitizeInput(msg.content) : msg.content }]
            }));

        // 🛡️ P2: Strict Context Window Slice
        formattedMessages = formattedMessages.slice(-20);
        while (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
            formattedMessages.shift();
        }

        // 🧠 Phase 3: Persistent Context Compression (Modularized)
        let dbContextSummary = null;
        if (body.sessionId) {
            try {
                const { data: sumData } = await supabaseAdmin.from('ai_sessions')
                    .select('context_summary')
                    .eq('id', body.sessionId)
                    .single();
                if (sumData && sumData.context_summary) {
                    dbContextSummary = sumData.context_summary;
                }
            } catch (err) {
                // Ignore if not found
            }
        }
        
        formattedMessages = await compressContext(formattedMessages, getApiKeys, body.sessionId, dbContextSummary);

        const currentDate = new Date().toISOString().split('T')[0];

        // 🗃️ Phase 2.5: Fetch live tools & categories index for the system prompt
        // This is critical — without real tool data the AI thinks the DB is empty.
        let toolsIndex = 'No tools found in database.';
        let categoriesIndex = 'AI Agents, Productivity, Design, Analytics, Development';
        try {
            const [toolsRes, catsRes] = await Promise.all([
                supabaseAdmin.from('tools').select('name, slug').limit(150),
                supabaseAdmin.from('categories').select('name').limit(20)
            ]);
            if (toolsRes.data && toolsRes.data.length > 0) {
                toolsIndex = toolsRes.data.map(t => `- ${t.name} [slug: ${t.slug}]`).join('\n');
            }
            if (catsRes.data && catsRes.data.length > 0) {
                categoriesIndex = catsRes.data.map(c => c.name).join(', ');
            }
        } catch (fetchErr) {
            console.warn('[AI Engine] Could not fetch tools/categories index:', fetchErr.message);
        }

        // 🧠 Phase 2: Dynamic Templates based on Intent Classification
        const combinedUserMsgs = (messages || [])
            .filter(m => m.role === 'user')
            .map(m => m.content || '')
            .join(' ');
        const { intent, template: domainTemplate } = classifyIntentAndGetTemplate(combinedUserMsgs, workspaceContext);
        console.log(`[AI Engine] Intent detected: ${intent}`);

        // 🛡️ P2: Schema Validation for AI Settings
        let validatedAiSettings = { tone: 'default', language: 'auto' };
        if (aiSettings && typeof aiSettings === 'object') {
            const allowedTones = ['default', 'concise', 'detailed', 'creative'];
            const allowedLangs = ['auto', 'en', 'ar'];
            if (allowedTones.includes(aiSettings.tone)) validatedAiSettings.tone = aiSettings.tone;
            if (allowedLangs.includes(aiSettings.language)) validatedAiSettings.language = aiSettings.language;
        }

        // 🎭 Phase 3: Build Prompts (Modularized)
        const { tonePrompt, langPrompt } = buildToneAndLangPrompts(validatedAiSettings);
        const { systemInstruction } = buildSystemPrompt({
            currentDate,
            userContextPrompt,
            workspaceContext,
            aiSettings: validatedAiSettings,
            langPrompt,
            tonePrompt,
            categoriesIndex,
            toolsIndex,
            isComparisonMode,
            tool1Context,
            tool2Context,
            experienceLevel,
            domainTemplate,
            mode,
            activeWorkflowState
        });

        // 🚀 Fast Path: Dynamic Suggestions Generation
        if (action === 'generate_suggestions') {
            const { GoogleGenAI } = await import('@google/genai');
            const ai = new GoogleGenAI({ apiKey: keys[Math.floor(Math.random() * keys.length)] });
            const prompt = `You are HUBly AI. Generate exactly 3 highly relevant, diverse, and short questions (max 10 words each) the user might want to ask you to start the conversation.\n${userContextPrompt}\nOutput ONLY a valid JSON array of 3 strings.`;
            
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: { responseMimeType: "application/json" }
                });
                
                const suggestions = JSON.parse(response.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());
                return new Response(JSON.stringify({ suggestions }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } catch (e) {
                return new Response(JSON.stringify({ suggestions: ["What's the best tool for me?", "Help me build a project", "Compare top tools"] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }

        // 🛠️ Phase 3: Tools Registry (Modularized)
        const toolsArray = buildToolsArray(verifiedUserId, userRole);
        // 🔍 DIAGNOSTIC LOG — Remove after debugging
        const toolNames = toolsArray[0]?.functionDeclarations?.map(t => t.name) || [];
        console.log(`[AI Engine] Tools built for request: [${toolNames.join(', ')}] (${toolNames.length} total)`);


        // 🌊 Phase 3: Stream Engine (Modularized)
        const stream = await createStream(
            resolvedModelType,
            formattedMessages,
            toolsArray,
            systemInstruction,
            keys,
            openRouterKey,
            verifiedUserId,
            userRole,
            body.sessionId,
            tool1Context,
            tool2Context,
            messages, // Pass the raw original messages so we can extract the last user message text
            mode
        );

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no'
            }
        });

    } catch (error) {
        console.error('[AI Engine] Chat Endpoint Fatal Error:', error);
        return new Response(JSON.stringify({ error: 'INTERNAL_ERROR', message: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
} // Force recompile trigger
