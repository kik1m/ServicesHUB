import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { generateAISeo } from './utils/seoGenerator.js';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase Environment Variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We will initialize the Gemini client inside the handler if needed

export default async function handler(req, res) {
    // Only allow GET requests for querying comparisons
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { slug1, slug2 } = req.query;
    console.log(`[AI-API] Request received for: ${slug1} vs ${slug2}`);

    if (!slug1 || !slug2) {
        return res.status(400).json({ error: 'Both slug1 and slug2 are required.' });
    }

    if (slug1 === slug2) {
        return res.status(400).json({ error: 'Cannot compare a tool with itself. Please select two different tools.' });
    }

    const { userId } = req.query; // Expecting userId from frontend call

    try {
        let isPremium = false;
        let profileData = null;

        // --- 🛡️ ELITE USER QUOTA PROTECTION ---
        if (userId) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
            if (profile) {
                profileData = profile;
                isPremium = !!profile.is_premium;
                if (!isPremium) {
                    const now = new Date();
                    const lastComp = profile.last_ai_comparison_at ? new Date(profile.last_ai_comparison_at) : null;
                    const count = profile.ai_comparison_count || 0;
                    
                    // Reset count if 24h passed
                    const isNewDay = !lastComp || (now - lastComp > 86400000);
                    const currentCount = isNewDay ? 0 : count;

                    if (currentCount >= 3) {
                        return res.status(429).json({ 
                            error: 'Limit Reached', 
                            message: 'Daily AI Comparison limit reached (3). Upgrade to Premium for unlimited access!' 
                        });
                    }
                }
            }
        }
        const { data: tools, error: toolsError } = await supabase
            .from('tools')
            .select('id, name, slug, short_description, description, features, pricing_type, pricing_details, rating, reviews_count')
            .in('slug', [slug1, slug2]);

        if (toolsError) throw toolsError;
        if (!tools || tools.length !== 2) {
            const foundSlugs = tools?.map(t => t.slug) || [];
            const missing = [slug1, slug2].filter(s => !foundSlugs.includes(s));
            return res.status(404).json({ error: `Tool(s) not found in the database: ${missing.join(', ')}` });
        }

        const toolA = tools.find(t => t.slug === slug1);
        const toolB = tools.find(t => t.slug === slug2);

        const idA = toolA.id;
        const idB = toolB.id;

        // 2. Check DB cache FIRST
        const { data: cachedComparison } = await supabase
            .from('tool_comparisons')
            .select('tool1_id, tool2_id, ai_report_json')
            .or(`and(tool1_id.eq.${idA},tool2_id.eq.${idB}),and(tool1_id.eq.${idB},tool2_id.eq.${idA})`)
            .maybeSingle();

        if (cachedComparison && cachedComparison.ai_report_json) {
            let report = cachedComparison.ai_report_json;
            console.log(`⚡ Serving cached comparison for ${slug1} vs ${slug2}`);

            if (cachedComparison.tool1_id === idB) {
                console.log(`🔄 Swapping JSON data to match requested order`);

                const newWhyBuy = {
                    tool1: report.why_buy?.tool2 || [],
                    tool2: report.why_buy?.tool1 || []
                };

                const newMatrix = (report.comparison_matrix || []).map(row => {
                    let newWinner = row.winner;
                    if (row.winner === 1) newWinner = 2;
                    else if (row.winner === 2) newWinner = 1;

                    return {
                        ...row,
                        tool1_value: row.tool2_value,
                        tool2_value: row.tool1_value,
                        winner: newWinner
                    };
                });

                const newScores = report.scores ? {
                    tool1: report.scores.tool2,
                    tool2: report.scores.tool1
                } : undefined;

                report = {
                    ...report,
                    why_buy: newWhyBuy,
                    comparison_matrix: newMatrix,
                    ...(newScores && { scores: newScores })
                };
            }

            return res.status(200).json({ data: report, source: 'cache' });
        }

        // 3. No cache found
        const prompt = `
        You are an elite, highly critical AI SaaS consultant and strategic analyst.
        Analyze these tools deeply, focusing on their architecture, market positioning, and functional edge:
        
        --- TOOL 1: ${toolA.name} ---
        Description: ${toolA.description}
        Features: ${toolA.features?.join(', ')}
        Pricing: ${toolA.pricing_type} - ${toolA.pricing_details}

        --- TOOL 2: ${toolB.name} ---
        Description: ${toolB.description}
        Features: ${toolB.features?.join(', ')}
        Pricing: ${toolB.pricing_type} - ${toolB.pricing_details}

        YOUR GOAL: Create a dynamic, honest, and high-fidelity comparison matrix.
        
        STRICT RULES (CRITICAL):
        1. "scores": Values MUST be realistic integers between 65 and 98. They MUST NOT be identical. 
        2. "verdict": The "winner" MUST match the name of the tool with the HIGHER score. The score gap should reflect the margin of victory described in your reasoning.
        3. "comparison_matrix": 
           - For EACH feature row, you MUST objectively decide which tool wins THAT SPECIFIC FEATURE (winner: 1 or 2).
           - Do NOT give all feature wins to the overall winner. Distribute wins based on real strengths (e.g., Tool A might win on "User Interface" while Tool B wins on "API Complexity").
           - If a feature is truly identical, use "winner: 0", but try to find a differentiator.
        4. "insight": Provide a technical or strategic insight for each row that explains WHY that tool won or what the trade-off is.
        5. "why_buy": Provide 3 distinct, high-value reasons for each tool.
        
        REQUIRED JSON SCHEMA:
        {
            "strategic_overview": "A high-level 2-sentence summary of the battle.",
            "verdict": {
                "winner": "Exact tool name",
                "reasoning": "A professional, critical comparison of why one beats the other."
            },
            "scores": { "tool1": 82, "tool2": 89 },
            "why_buy": { "tool1": ["reason1", "reason2", "reason3"], "tool2": ["reason1", "reason2", "reason3"] },
            "comparison_matrix": [
                { 
                    "feature": "Name of the dimension", 
                    "tool1_value": "Short description of Tool 1 performance", 
                    "tool2_value": "Short description of Tool 2 performance", 
                    "winner": 1, 
                    "insight": "Strategic trade-off or technical differentiator" 
                }
            ],
            "pricing_analysis": "A critical look at the TCO (Total Cost of Ownership) for both tools."
        }
        `;

        // 3. AI GENERATION LAYER (Multi-Key & Multi-Model Resilience)
        const rawKeys = process.env.GEMINI_API_KEY || '';
        const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k.startsWith('AIza'));
        
        if (apiKeys.length === 0) return res.status(503).json({ error: 'AI generation is not available (No Keys).' });

        console.log(`🧠 Generating new AI analysis for ${slug1} vs ${slug2} using ${apiKeys.length} keys...`);

        const targetModels = ['gemini-flash-latest', 'gemini-2.5-flash'];
        let lastError = null;
        let aiReport = null;

        for (let k = 0; k < apiKeys.length; k++) {
            const currentKey = apiKeys[k];
            let keySuccess = false;

            for (const currentModel of targetModels) {
                try {
                    const ai = new GoogleGenAI({ apiKey: currentKey });
                    const result = await ai.models.generateContent({
                        model: currentModel,
                        contents: prompt,
                        generationConfig: { 
                            responseMimeType: "application/json",
                            temperature: 0.2
                        }
                    });

                    // --- 🛡️ HARDENED EXTRACTION LAYER ---
                    let responseText = "";
                    try {
                        responseText = typeof result.text === 'function' ? result.text() : 
                                       (result.response?.text ? result.response.text() : (result.text || ""));
                    } catch (e) {
                        responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    }

                    if (!responseText) throw new Error('EMPTY_AI_RESPONSE');

                    const startIdx = responseText.indexOf('{');
                    const endIdx = responseText.lastIndexOf('}');
                    if (startIdx === -1 || endIdx === -1) throw new Error('NO_JSON_FOUND');

                    aiReport = JSON.parse(responseText.substring(startIdx, endIdx + 1));
                    console.log(`  ✅ Success: Key ${k + 1} delivered analysis using ${currentModel}.`);
                    keySuccess = true;
                    break; // Exit model loop

                } catch (err) {
                    lastError = err;
                    const errStr = JSON.stringify(err);
                    const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');
                    
                    if (isQuota) {
                        console.warn(`  ⚠️ Key ${k + 1} (${currentModel}) Quota Exhausted.`);
                        // If 2.5 fails, inner loop will try 1.5 with SAME key
                        continue; 
                    }
                    
                    // If not quota, might be a fatal error for this key
                    break;
                }
            }

            if (keySuccess) break; // Exit key loop

            // Small wait before trying next key to be safe
            if (k < apiKeys.length - 1) {
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        if (!aiReport) throw lastError || new Error('AI_GENERATION_FAILED');

        // --- 🚀 ELITE AI SEO ENGINE (Decoupled & Self-Managed) ---
        try {
            const comparisonId = `${slug1}-vs-${slug2}`;
            await generateAISeo(comparisonId, {
                tool1: toolA,
                tool2: toolB,
                verdict: aiReport.verdict.winner,
                strategic_overview: aiReport.strategic_overview
            }, 'comparison');
        } catch (seoErr) {
            console.warn(`⚠️ SEO Engine background task failed:`, seoErr.message);
        }
        // --------------------------------------------------------

        // --- 💾 CACHE FOR FUTURE USERS ---
        try {
            const sortedIds = [idA, idB].sort();
            await supabase.from('tool_comparisons').insert({
                tool1_id: sortedIds[0],
                tool2_id: sortedIds[1],
                ai_report_json: aiReport
            });
        } catch (dbErr) {
            console.warn(`⚠️ Failed to cache comparison:`, dbErr.message);
        }

        // Update Usage for non-premium users
        if (userId && !isPremium) {
            const now = new Date();
            const lastComp = profileData?.last_ai_comparison_at ? new Date(profileData.last_ai_comparison_at) : null;
            const isNewDay = !lastComp || (now - lastComp > 86400000);
            
            let newCount = isNewDay ? 1 : (profileData?.ai_comparison_count || 0) + 1;
            
            await supabase.from('profiles').update({ 
                ai_comparison_count: newCount, 
                last_ai_comparison_at: now.toISOString() 
            }).eq('id', userId);
        }

        return res.status(200).json({ data: aiReport, source: 'ai' });

    } catch (error) {
        console.error('❌ Comparison Error:', error);
        return res.status(error.status || 500).json({ error: error.message || 'Failed' });
    }
}
