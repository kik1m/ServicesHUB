import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase Environment Variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { query, userId } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required.' });

    try {
        let isPremium = false;
        let profileData = null;

        // 1. Check User Limits (Same logic)
        if (userId) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (profile) {
                profileData = profile;
                isPremium = !!profile.is_premium;
                if (!isPremium) {
                    const now = new Date();
                    const lastSearch = profile.last_ai_search_at ? new Date(profile.last_ai_search_at) : null;
                    const count = profile.ai_search_count || 0;
                    if (lastSearch && (now - lastSearch < 86400000) && count >= 3) {
                        return res.status(429).json({ error: 'Limit Reached', message: 'Daily limit reached.' });
                    }
                }
            }
        }

        // 2. FETCH ALL TOOLS DATA (Full Data for UI consistency)
        const { data: allTools, error: toolsError } = await supabase
            .from('tools')
            .select('*, categories(name)')
            .eq('is_approved', true);

        if (toolsError) throw toolsError;

        // Format tools for Gemini to read (keep context light)
        const toolsContext = allTools.map(t => ({
            name: t.name,
            slug: t.slug,
            description: t.short_description,
            category: t.categories?.name
        }));

        // 3. SEMANTIC ANALYSIS VIA GEMINI
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const prompt = `
        You are the Elite AI Curator for ServicesHUB. 
        USER REQUEST: "${query}"

        TOOLS DATABASE:
        ${JSON.stringify(toolsContext)}

        TASK:
        1. Select top 10 tools that EXACTLY solve the user's intent. 
        2. BE PRECISE: If they ask for "talking", favor Text-to-Speech/Voice tools over Video tools.
        3. MESSAGE: A VERY SHORT (max 15 words) English summary. Use **bold** for the main category.

        OUTPUT FORMAT (STRICT JSON ONLY):
        {
            "selected_slugs": ["slug1", "slug2", ...],
            "message": "string"
        }
        `;

        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const analysis = JSON.parse(geminiResponse.text);
        const { selected_slugs, message } = analysis;

        // 4. FETCH THE FULL DATA FOR SELECTED TOOLS
        // We filter the already fetched tools to keep it fast
        const finalTools = allTools.filter(t => selected_slugs.includes(t.slug));

        // 5. Update Usage
        if (userId && !isPremium) {
            const now = new Date();
            let newCount = (profileData?.ai_search_count || 0) + 1;
            if (profileData?.last_ai_search_at && (now - new Date(profileData.last_ai_search_at) > 86400000)) newCount = 1;
            await supabase.from('profiles').update({ ai_search_count: newCount, last_ai_search_at: now.toISOString() }).eq('id', userId);
        }

        return res.status(200).json({
            tools: finalTools,
            message
        });

    } catch (error) {
        console.error('[AI-Search-API] Error:', error);
        
        // Elite Error Shield: Never show raw technical errors to the user
        let friendlyMessage = 'Our AI assistant is currently busy processing other requests. Please try again in a moment.';
        
        if (error.message?.includes('quota') || error.message?.includes('429')) {
            friendlyMessage = 'We have reached our temporary AI search limit. Please try again in a few seconds or upgrade to Premium for instant access!';
        }

        return res.status(200).json({ 
            tools: [], 
            message: friendlyMessage,
            isError: true 
        });
    }
}
