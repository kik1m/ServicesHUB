import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 👑 AI SEO ENGINE (V8 - Ultimate Elite Final)
 * Features: High-Intent Keyword Injection, Context Expansion, Schema Specialization
 */
export const generateAISeo = async (entityId, data, type = 'tool') => {
    const fallbackTitle = `${data.name || 'AI Tool'} - Features, Pricing & Review | HUBly`;
    const fallbackDesc = (data.description || data.short_description || '').slice(0, 155);
    const fallbackResponse = {
        title: fallbackTitle,
        description: fallbackDesc,
        keywords: [],
        search_intent: 'transactional'
    };

    // 0. INPUT PROTECTION (Last Line of Defense)
    if (!entityId || typeof entityId !== 'string') {
        console.error('[SEO ENGINE] Rejected: Invalid Entity ID');
        return fallbackResponse;
    }

    // 1. ELITE HASH MONITORING (Full Data Coverage)
    const rawDataString = JSON.stringify({
        name: data.name || '',
        desc: data.description || data.short_description || '',
        features: data.features || [],
        pricing: data.pricing_type || '',
        type
    });
    const currentHash = crypto.createHash('md5').update(rawDataString).digest('hex');

    try {
        // 2. SMART CACHE LAYER
        const { data: cached } = await supabase
            .from('seo_metadata')
            .select('*')
            .eq('entity_id', entityId)
            .eq('entity_type', type)
            .maybeSingle();

        if (cached && cached.data_hash === currentHash) {
            console.log(`[SEO ENGINE] Cache Hit (Normalized): ${entityId}`);
            return {
                title: cached.title,
                description: cached.description,
                keywords: Array.isArray(cached.keywords) ? cached.keywords : [],
                search_intent: cached.search_intent || 'transactional'
            };
        }

        // 3. AI GENERATION LAYER (Multi-Key Resilience)
        const { getKeys } = await import('./keyManager.js');
        const apiKeys = getKeys();
        if (apiKeys.length === 0) throw new Error('GEMINI_API_KEY_MISSING');

        let context = '';
        if (type === 'tool') {
            context = `Entity: AI Tool\nName: ${data.name}\nDescription: ${data.description}\nFeatures: ${data.features?.join(', ')}\nPricing: ${data.pricing_type}`;
        } else if (type === 'comparison') {
            context = `Entity: Tool Comparison\nComparison: ${data.tool1.name} vs ${data.tool2.name}\nTool 1 Features: ${data.tool1.features?.join(', ')}\nTool 2 Features: ${data.tool2.features?.join(', ')}\nVerdict Insight: ${data.strategic_overview}`;
        } else if (type === 'category') {
            context = `Entity: Tool Category\nCategory Name: ${data.name}\nDescription: ${data.description}`;
        } else if (type === 'blog') {
            context = `Entity: Blog Post\nTitle: ${data.title}\nExcerpt: ${data.excerpt || data.short_description}`;
        } else if (type === 'page') {
            context = `Entity: Core Page\nPage Name: ${data.name}\nCurrent Description: ${data.description}`;
        }

        const prompt = `
        You are an elite SEO Strategist. Generate high-conversion SEO metadata for a premium AI Directory.
        Focus on CLARITY, USEFULNESS, and USER INTENT. Avoid clickbait.
        
        CONTEXT:
        ${context}

        REQUIREMENTS:
        - Title (55-60 chars): Natural, helpful, includes brand/category names.
        - Description (150-160 chars): Clear value proposition + Natural CTA.
        - Keywords: 5 high-intent long-tail keywords.

        OUTPUT JSON:
        {
            "title": "...",
            "description": "...",
            "keywords": [],
            "search_intent": "transactional"
        }
        `;

        // 3.1 AI GENERATION WITH ROTATION
        let responseText;
        let lastError = null;
        const targetModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];

        const startIndex = Math.floor(Math.random() * apiKeys.length);

        for (let i = 0; i < apiKeys.length; i++) {
            const k = (startIndex + i) % apiKeys.length;
            const currentKey = apiKeys[k];
            let keySuccess = false;

            for (const currentModel of targetModels) {
                try {
                    const ai = new GoogleGenAI({ apiKey: currentKey });
                    const response = await ai.models.generateContent({
                        model: currentModel,
                        contents: prompt,
                        config: { responseMimeType: "application/json" }
                    });
                    
                    responseText = typeof response.text === 'function' ? response.text() : (response.text || "");
                    if (responseText) {
                        keySuccess = true;
                        break; // Success! Break model loop
                    }
                } catch (err) {
                    lastError = err;
                    const errStr = JSON.stringify(err);
                    const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
                    const isBusy = errStr.includes('503') || errStr.includes('UNAVAILABLE');

                    if (isQuota) {
                        console.warn(`[SEO ENGINE] Key ${k+1} exhausted. Switching Key...`);
                        break; // Circuit breaker: go to next key
                    }
                    if (isBusy) {
                        console.warn(`[SEO ENGINE] Model ${currentModel} busy. Trying next model...`);
                        continue; // Try next model
                    }
                    
                    // Unknown error
                    break;
                }
            }
            if (keySuccess) break; // Break key loop
            if (i < apiKeys.length - 1) await new Promise(r => setTimeout(r, 800)); // Delay
        }

        if (!responseText) throw lastError || new Error('AI_GENERATION_FAILED');

        // 3.2 ROBUST JSON VALIDATION
        let seoResult;
        try {
            seoResult = JSON.parse(responseText);
        } catch (e) {
            console.error('[SEO ENGINE] AI returned invalid JSON:', responseText);
            throw new Error('INVALID_AI_JSON');
        }

        // 4. SMART KEYWORD INJECTION & SCORE CHECK
        const baseKeywords = type === 'tool' ? [`${data.name} review`, `${data.name} pricing`, `${data.name} features`] :
            type === 'category' ? [`best ${data.name} ai tools`, `top ${data.name} software`, `ai ${data.name} tools list`] : [];
        const finalKeywords = [...new Set([...baseKeywords, ...(seoResult.keywords || [])])].slice(0, 6);

        // Quality Check (Rule #7): If title is too weak, use fallback or better pattern
        let finalTitle = seoResult.title || fallbackTitle;
        if (finalTitle.length < 40 && (data.name || data.title)) {
            const name = data.name || data.title;
            finalTitle = type === 'category'
                ? `Best ${name} AI Tools (${new Date().getFullYear()}) | HUBly`
                : `${name}: Everything You Need to Know | HUBly`;
        }

        const normalizedSeo = {
            title: finalTitle.slice(0, 65).trim(),
            description: (seoResult.description || fallbackDesc).slice(0, 165).trim(),
            keywords: finalKeywords,
            search_intent: seoResult.search_intent || 'transactional'
        };

        // 5. SPECIALIZED SCHEMA MARKUP
        let schema;
        if (type === 'tool') {
            schema = {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "applicationCategory": "BusinessApplication",
                "name": data.name || normalizedSeo.title,
                "description": normalizedSeo.description
            };
        } else if (type === 'category') {
            schema = {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": normalizedSeo.title,
                "description": normalizedSeo.description
            };
        } else {
            schema = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": normalizedSeo.title,
                "description": normalizedSeo.description
            };
        }

        // 6. PERSISTENCE
        await supabase.from('seo_metadata').upsert({
            entity_id: entityId,
            entity_type: type,
            ...normalizedSeo,
            data_hash: currentHash,
            schema_markup: schema,
            ai_model: 'gemini-2.5-flash'
        }, { onConflict: 'entity_id,entity_type' });

        return normalizedSeo;

    } catch (error) {
        console.error(`[SEO ENGINE ERROR]:`, error.message);
        return {
            title: fallbackTitle,
            description: fallbackDesc,
            keywords: [],
            search_intent: 'transactional'
        };
    }
};
