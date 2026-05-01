import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

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

    try {
        // 1. Fetch both tools from the database
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

        // 2. Check DB cache FIRST — works regardless of API key availability
        // We check BOTH permutations to find manually saved comparisons regardless of order
        // Rule #24: Prefer existing strategic analysis over live generation
        const { data: cachedComparison } = await supabase
            .from('tool_comparisons')
            .select('tool1_id, tool2_id, ai_report_json')
            .or(`and(tool1_id.eq."${idA}",tool2_id.eq."${idB}"),and(tool1_id.eq."${idB}",tool2_id.eq."${idA}")`)
            .maybeSingle();

        if (cachedComparison && cachedComparison.ai_report_json) {
            let report = cachedComparison.ai_report_json;

            // Elite Standardization: If the cache was stored, we serve it.
            // We only regenerate if explicitly forced or if the data is corrupted.
            console.log(`⚡ Serving cached comparison for ${slug1} vs ${slug2}`);
                
            // Smart Swapper: If cache was stored in reverse order, flip to match request
            if (cachedComparison.tool1_id === idB) {
                console.log(`🔄 Swapping JSON data to match requested order (${slug1} vs ${slug2})`);
                    
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

                    // Swap scores too
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

        // 3. No cache found — check API key before attempting AI generation
        if (!process.env.GEMINI_API_KEY) {
            console.error("[AI-API] No cache found and GEMINI_API_KEY is missing. Cannot generate new comparison.");
            return res.status(503).json({ 
                error: 'AI generation is not available for this pair yet. Please check back later or contact support.' 
            });
        }

        // 3. If no cache exists, Generate the Live Comparison using Gemini
        console.log(`🧠 Generating new AI comparison for ${slug1} vs ${slug2}...`);

        // Initialize Gemini securely inside the function to prevent 500 errors on server boot
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        You are an elite, highly critical AI SaaS consultant and strategist.
        I am providing you with the exact database records for two competing AI tools:
        
        --- TOOL 1: ${toolA.name} ---
        Description: ${toolA.description}
        Features: ${toolA.features?.join(', ')}
        Pricing: ${toolA.pricing_type} - ${toolA.pricing_details}

        --- TOOL 2: ${toolB.name} ---
        Description: ${toolB.description}
        Features: ${toolB.features?.join(', ')}
        Pricing: ${toolB.pricing_type} - ${toolB.pricing_details}

        YOUR GOAL: Analyze these tools deeply. Do not just list features. Tell the user WHY they should pick one over the other. Create a dynamic comparison matrix of the top 5 comparative dimensions (e.g., Performance, Workflow Integration, Value for Money, etc.) based on these specific tools.
        
        REQUIRED JSON SCHEMA:
        {
            "strategic_overview": "String (A deep, analytical 3-sentence summary of the competition)",
            "verdict": {
                "winner": "String ('${toolA.name}', '${toolB.name}', or 'Tie')",
                "reasoning": "String (A brutal, honest 1-sentence justification)"
            },
            "scores": {
                "tool1": 0, // Integer 0-100: Overall strategic score for ${toolA.name} considering features, pricing, value, and market fit
                "tool2": 0  // Integer 0-100: Overall strategic score for ${toolB.name} considering features, pricing, value, and market fit
            },
            "why_buy": {
                "tool1": ["String", "String", "String"], // 3 strategic reasons to buy Tool 1
                "tool2": ["String", "String", "String"]  // 3 strategic reasons to buy Tool 2
            },
            "comparison_matrix": [
                {
                    "feature": "String (e.g., 'API Robustness')",
                    "tool1_value": "String (e.g., 'Industry Standard')",
                    "tool2_value": "String (e.g., 'Proprietary / Limited')",
                    "winner": 1, // 1 for Tool1, 2 for Tool2, 0 for Tie
                    "insight": "String (Short strategic insight for this feature)"
                }
            ], // Exactly 5 rows
            "pricing_analysis": "String (A deep dive into which one scales better for users)"
        }
        
        RULES:
        1. Output ONLY raw JSON.
        2. Be decisive and strategic.
        3. Scores must be integers between 0-100. The winner's score must always be higher than the loser's.
        `;

        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const jsonString = geminiResponse.text;
        const aiReport = JSON.parse(jsonString);

        // Sort IDs to ensure consistent unique checking in cache (id1 < id2) for future AI generations
        const sortedIds = [idA, idB].sort();
        const id1 = sortedIds[0];
        const id2 = sortedIds[1];

        // 4. Save the generated report to the cache database
        const { error: insertError } = await supabase
            .from('tool_comparisons')
            .insert({
                tool1_id: id1,
                tool2_id: id2,
                ai_report_json: aiReport
            });

        if (insertError) {
            console.error("⚠️ Failed to cache comparison:", insertError);
            // We don't throw here so we can still return the result to the user
        }

        console.log(`✅ Successfully generated and cached comparison for ${slug1} vs ${slug2}`);
        return res.status(200).json({ data: aiReport, source: 'ai' });

    } catch (error) {
        console.error('❌ Comparison Generation Error:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate comparison' });
    }
}
