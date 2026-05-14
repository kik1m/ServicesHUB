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
            .select('id, name, slug, short_description, description, features, pricing_type, pricing_details, pricing_details_full, rating, reviews_count')
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

            // --- 🛡️ ELITE CONSISTENCY GUARD (Cache Level) ---
            if (report.scores && report.verdict?.winner) {
                const s1 = Number(report.scores.tool1);
                const s2 = Number(report.scores.tool2);
                const winnerName = report.verdict.winner.toLowerCase();
                const name1 = toolA.name.toLowerCase();
                const name2 = toolB.name.toLowerCase();

                if (winnerName.includes(name1) && s1 < s2) {
                    const temp = report.scores.tool1;
                    report.scores.tool1 = report.scores.tool2;
                    report.scores.tool2 = temp;
                } else if (winnerName.includes(name2) && s2 < s1) {
                    const temp = report.scores.tool1;
                    report.scores.tool1 = report.scores.tool2;
                    report.scores.tool2 = temp;
                }
            }
            // ------------------------------------------------

            return res.status(200).json({ data: report, source: 'cache' });
        }

        // 3. No cache found
        const prompt = `
        You are an elite AI SaaS consultant. Analyze these tools deeply:
        
        TOOL 1: ${toolA.name}
        Description: ${toolA.description}
        Features: ${toolA.features?.join(', ')}
        Detailed Pricing: ${toolA.pricing_details_full || toolA.pricing_details}

        TOOL 2: ${toolB.name}
        Description: ${toolB.description}
        Features: ${toolB.features?.join(', ')}
        Detailed Pricing: ${toolB.pricing_details_full || toolB.pricing_details}

        STRICT JSON STRUCTURE REQUIRED:
        {
            "strategic_overview": "A concise strategic summary for Tool 1 [SPLIT] A concise strategic summary for Tool 2.",
            "verdict": {
                "winner": "Exact tool name",
                "reasoning": "Provide 3-4 distinct points separated by [SPLIT]. Use bold text for key terms."
            },
            "scores": { 
                "tool1": Integer(65-98), 
                "tool2": Integer(65-98) 
            },
            "why_buy": { 
                "tool1": ["Benefit 1", "Benefit 2", "Benefit 3"], 
                "tool2": ["Benefit 1", "Benefit 2", "Benefit 3"] 
            },
            "comparison_matrix": [
                { 
                    "feature": "Dimension Name", 
                    "tool1_value": "Short Performance desc", 
                    "tool2_value": "Short Performance desc", 
                    "winner": 1 or 2 or 0, 
                    "insight": "Strategic trade-off" 
                }
            ],
            "pricing_analysis": "Provide 3-4 distinct points separated by [SPLIT]. Analyze TCO based on the Detailed Pricing."
        }

        CRITICAL: 
        - Separate every point in reasoning and pricing_analysis with the exact token: [SPLIT]
        - Do NOT use bullet points (•) in the JSON, the UI will add them.
        - scores MUST be realistic and different.
        `;

        // 3. AI GENERATION LAYER (Multi-Key & Multi-Model Resilience)
        const rawKeys = process.env.GEMINI_API_KEY || '';
        const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k.startsWith('AIza'));
        
        if (apiKeys.length === 0) return res.status(503).json({ error: 'AI generation is not available (No Keys).' });

        console.log(`🧠 Generating new AI analysis for ${slug1} vs ${slug2} using ${apiKeys.length} keys...`);

        const targetModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
        let lastError = null;
        let aiReport = null;

        // --- 🚀 ULTRA-ELITE LOAD BALANCER ---
        const startIndex = Math.floor(Math.random() * apiKeys.length);

        for (let i = 0; i < apiKeys.length; i++) {
            const k = (startIndex + i) % apiKeys.length;
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

                    // --- 🛡️ ELITE CONSISTENCY GUARD ---
                    // Ensure scores match the winner logic to prevent AI "inversion" hallucinations
                    if (aiReport.scores && aiReport.verdict?.winner) {
                        const s1 = Number(aiReport.scores.tool1);
                        const s2 = Number(aiReport.scores.tool2);
                        const winnerName = aiReport.verdict.winner.toLowerCase();
                        const name1 = toolA.name.toLowerCase();
                        const name2 = toolB.name.toLowerCase();

                        // If Tool 1 is mentioned as winner but has lower score, SWAP scores
                        if (winnerName.includes(name1) && s1 < s2) {
                            console.log("🔄 Auto-correcting inverted scores for Tool 1 winner");
                            const temp = aiReport.scores.tool1;
                            aiReport.scores.tool1 = aiReport.scores.tool2;
                            aiReport.scores.tool2 = temp;
                        } 
                        // If Tool 2 is mentioned as winner but has lower score, SWAP scores
                        else if (winnerName.includes(name2) && s2 < s1) {
                            console.log("🔄 Auto-correcting inverted scores for Tool 2 winner");
                            const temp = aiReport.scores.tool1;
                            aiReport.scores.tool1 = aiReport.scores.tool2;
                            aiReport.scores.tool2 = temp;
                        }
                    }
                    // ----------------------------------

                    console.log(`  ✅ Success: Key ${k + 1} delivered analysis using ${currentModel}.`);
                    keySuccess = true;
                    break; // Exit model loop

                } catch (err) {
                    lastError = err;
                    const errStr = JSON.stringify(err);
                    const isQuota = errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota');
                    const isBusy = errStr.includes('503') || errStr.includes('UNAVAILABLE') || errStr.includes('500');
                    
                    if (isQuota) {
                        console.warn(`  ⚠️ Key ${k + 1} Quota Exhausted. Switching Key immediately...`);
                        break; // Circuit Breaker: Key is dead. Break model loop, go to NEXT KEY.
                    }
                    if (isBusy) {
                        console.warn(`  ⚠️ Model ${currentModel} Busy. Trying next model on same key...`);
                        continue; // Model busy. Try next model on SAME KEY.
                    }
                    
                    // If not quota or busy, might be a fatal error for this key
                    break;
                }
            }

            if (keySuccess) break; // Exit key loop

            // Small wait before trying next key to be safe
            if (i < apiKeys.length - 1) {
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
