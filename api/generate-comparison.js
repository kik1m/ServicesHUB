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
        if (!process.env.GEMINI_API_KEY) {
            console.error("[AI-API] No cache found and GEMINI_API_KEY is missing.");
            return res.status(503).json({ error: 'AI generation is not available.' });
        }

        // 3. Generate the Live Comparison
        console.log(`🧠 Generating new AI analysis for ${slug1} vs ${slug2}...`);
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const prompt = `
        You are an elite, highly critical AI SaaS consultant and strategist.
        Analyze these tools deeply:
        
        --- TOOL 1: ${toolA.name} ---
        ${toolA.description}

        --- TOOL 2: ${toolB.name} ---
        ${toolB.description}

        YOUR GOAL: Analyze these tools deeply. Create a dynamic comparison matrix.
        
        REQUIRED JSON SCHEMA:
        {
            "strategic_overview": "String",
            "verdict": {
                "winner": "String",
                "reasoning": "String"
            },
            "scores": { "tool1": 0, "tool2": 0 },
            "why_buy": { "tool1": [], "tool2": [] },
            "comparison_matrix": [
                { "feature": "String", "tool1_value": "String", "tool2_value": "String", "winner": 0, "insight": "String" }
            ],
            "pricing_analysis": "String"
        }
        `;

        const geminiResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });

        const aiReport = JSON.parse(geminiResponse.text);

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

        // Save original analysis
        const sortedIds = [idA, idB].sort();
        await supabase.from('tool_comparisons').insert({
            tool1_id: sortedIds[0],
            tool2_id: sortedIds[1],
            ai_report_json: aiReport
        });

        return res.status(200).json({ data: aiReport, source: 'ai' });

    } catch (error) {
        console.error('❌ Comparison Error:', error);
        return res.status(500).json({ error: error.message || 'Failed' });
    }
}
