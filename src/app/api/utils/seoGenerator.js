import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// Initialize Supabase lazily or after dotenv
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) throw new Error('Supabase credentials missing');
    return createClient(supabaseUrl, supabaseKey);
};

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
        v: 'v13_dynamic' // Force cache miss for the dynamic SEO logic
    });
    const currentHash = crypto.createHash('md5').update(rawDataString).digest('hex');

    try {
        // 2. SMART CACHE LAYER
        const { data: cached } = await getSupabase()
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
            context = `Entity: 3rd-Party Tool Profile\nName: ${data.name}\nDescription: ${data.description}\nFeatures: ${data.features?.join(', ')}\nPricing: ${data.pricing_type}\nNOTE: This is a review/profile page for the tool "${data.name}" hosted on the HUBly platform.`;
        } else if (type === 'comparison') {
            context = `Entity: Tool Comparison\nComparison: ${data.name}\nVerdict Insight: ${data.description}\nNOTE: This page compares these two tools to help users decide which is better.`;
        } else if (type === 'category') {
            context = `Entity: Tool Category Hub\nCategory Name: ${data.name}\nDescription: ${data.description}\nNOTE: This page lists and curates the best 3rd-party tools in the "${data.name}" category for users to discover.`;
        } else if (type === 'blog') {
            context = `Entity: Blog Post/Article\nTitle: ${data.title}\nExcerpt: ${data.excerpt || data.short_description}\nNOTE: This is an informative article or guide published on the HUBly magazine.`;
        } else if (type === 'page') {
            context = `Entity: Platform Core Page\nPage Name: ${data.name}\nCurrent Description: ${data.description}\nNOTE: This is a primary page of the HUBly platform itself.`;
        }

        const prompt = `
        You are an elite SEO Strategist. Your goal is to generate the most compelling, dynamic, and high-conversion SEO metadata for a specific page on "HUBly".
        HUBly is an advanced ecosystem and platform where users discover, compare, and read about AI & SaaS tools.

        CRITICAL RULES:
        1. DYNAMIC TITLES: Read the context carefully and extract the absolute best, most clickable title tailored to the page's actual content. Do NOT use repetitive rigid formulas.
        2. PLATFORM CONTEXT: Remember that HUBly is the HOST platform. If the entity is a tool, HUBly is NOT the creator of the tool, it is just reviewing/listing it. Do not generate titles like "HUBly AI Writing Platform" for a category, instead use titles that attract users searching for tools.
        3. BRANDING: Append " | HUBly" or " - HUBly" naturally at the end of the title. 
        4. Focus on CLARITY, USEFULNESS, and SEARCH INTENT.
        
        CONTEXT:
        ${context}

        REQUIREMENTS:
You are the elite SEO Engine for HUBly, an AI directory/ecosystem.
HUBly is NOT the creator of these tools; HUBly is the directory where users discover and compare them.

[TASK]
Generate dynamic, high-converting SEO metadata for the following entity based on its type.

[CRITICAL RULES & FORMATTING FOR TITLE]
1. If type is 'tool':
   Strict Format: "[Tool Name]: [Primary Benefit/Feature] | HUBly"
   Example: "Vapi AI: Build Smart Voice Agents & Automate Calls | HUBly"
   Example: "Midjourney: Generate Photorealistic AI Art | HUBly"
2. If type is 'category':
   Strict Format: "Top AI [Category Name] Tools & Software - Discover & Compare | HUBly"
   Example: "Top AI Design Tools & Software - Discover & Compare | HUBly"
3. If type is 'page' or 'doc':
   Strict Format: "[Page Subject/Action] | HUBly"
   Example: "Discover Premium AI Tools & Software Directory | HUBly"
   Example: "HUBly Platform Guidelines - Listing & Review Rules | HUBly"
4. If type is 'comparison':
   Strict Format: "[Tool A] vs [Tool B]: Which is the Best AI [Niche] Tool? | HUBly"
5. If type is 'blog':
   Strict Format: "[Catchy Blog Title] | HUBly Magazine"
6. NEVER say "HUBly [Tool Name]" as if HUBly created it (e.g., NO "HUBly Ideogram AI").

[ENTITY DATA]
Type: ${type}
Name: ${data.name}
Description/Context: ${data.description || data.short_description || ''}
Features: ${(data.features || []).join(', ')}

[OUTPUT REQUIREMENT]
Return ONLY a valid JSON object matching this structure exactly (no markdown wrapping, no \`\`\`json):
{
    "title": "...",
    "description": "...",
    "keywords": ["...", "...", "...", "...", "..."],
    "search_intent": "navigational | informational | transactional"
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
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                        config: { responseMimeType: "application/json" }
                    });
                    
                    // Unified text extraction
                    const candidates = response.candidates || [];
                    responseText = candidates[0]?.content?.parts?.[0]?.text || "";
                    
                    if (responseText) {
                        keySuccess = true;
                        break; 
                    }
                } catch (err) {
                    lastError = err;
                    const errStr = JSON.stringify(err);
                    const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED');
                    const isBusy = errStr.includes('503') || errStr.includes('UNAVAILABLE');

                    if (isQuota) {
                        console.warn(`[SEO ENGINE] Key ${k+1} exhausted. Switching Key...`);
                        break; 
                    }
                    if (isBusy) {
                        console.warn(`[SEO ENGINE] Model ${currentModel} busy. Trying next model...`);
                        continue; 
                    }
                    break;
                }
            }
            if (keySuccess) break; 
            if (i < apiKeys.length - 1) await new Promise(r => setTimeout(r, 800)); 
        }

        // --- 🌐 OPENROUTER FALLBACK ENGINE ---
        if (!responseText && process.env.OPENROUTER_API_KEY) {
            console.warn(`[SEO ENGINE] All Gemini keys exhausted. Falling back to OpenRouter (google/gemini-2.5-flash)`);
            try {
                const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'google/gemini-2.5-flash',
                        messages: [{ role: 'user', content: prompt }]
                    })
                });
                if (orResponse.ok) {
                    const orData = await orResponse.json();
                    responseText = orData.choices[0]?.message?.content || "";
                    console.log(`  ✅ SEO Generation successful with OpenRouter fallback`);
                } else {
                    console.error('[SEO ENGINE] OpenRouter fallback HTTP error', await orResponse.text());
                }
            } catch (e) {
                console.error('[SEO ENGINE] OpenRouter fallback failed', e);
            }
        }

        if (!responseText) throw lastError || new Error('AI_GENERATION_FAILED');

        // 3.2 ROBUST JSON VALIDATION
        let seoResult;
        try {
            let cleanText = responseText.trim();
            if (cleanText.startsWith('```json')) cleanText = cleanText.slice(7);
            if (cleanText.startsWith('```')) cleanText = cleanText.slice(3);
            if (cleanText.endsWith('```')) cleanText = cleanText.slice(0, -3);
            seoResult = JSON.parse(cleanText.trim());
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
        if (finalTitle.length < 35 && (data.name || data.title)) {
            const name = data.name || data.title;
            finalTitle = type === 'category'
                ? `Best ${name} AI Tools (${new Date().getFullYear()}) | HUBly`
                : type === 'page'
                ? `${name} | HUBly - AI Discovery Hub`
                : `${name}: Features & Review | HUBly`;
        }

        const normalizedSeo = {
            title: finalTitle.trim(),
            description: (seoResult.description || fallbackDesc).trim(),
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
                "description": normalizedSeo.description,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": data.rating > 0 ? data.rating : 4.8,
                    "reviewCount": data.reviews_count > 0 ? data.reviews_count : 15,
                    "bestRating": 5,
                    "worstRating": 1
                }
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

        const supabase = getSupabase();
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
