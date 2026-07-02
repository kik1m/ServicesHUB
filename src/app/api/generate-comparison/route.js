import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { generateAISeo } from '../utils/seoGenerator';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { searchParams } = new URL(request.url);
    const slug1 = searchParams.get('slug1');
    const slug2 = searchParams.get('slug2');
    const userId = searchParams.get('userId');
    const intentQuery = searchParams.get('intentQuery');

    console.log(`[AI-API] Request received for: ${slug1} vs ${slug2} | Intent: ${intentQuery || 'None'}`);

    if (!slug1 || !slug2) {
        return NextResponse.json({ error: 'Both slug1 and slug2 are required.' }, { status: 400 });
    }

    if (slug1 === slug2) {
        return NextResponse.json({ error: 'Cannot compare a tool with itself.' }, { status: 400 });
    }

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
                    
                    const isNewDay = !lastComp || (now - lastComp > 86400000);
                    const currentCount = isNewDay ? 0 : count;

                    if (currentCount >= 3) {
                        return NextResponse.json({ 
                            error: 'Limit Reached', 
                            message: 'Daily AI Comparison limit reached (3). Upgrade to Premium for unlimited access!' 
                        }, { status: 429 });
                    }
                }
            }
        }

        // 1. Fetch tools from DB
        const { data: tools, error: toolsError } = await supabase
            .from('tools')
            .select('id, name, slug, short_description, description, features, pricing_type, pricing_details, pricing_details_full, rating, reviews_count')
            .in('slug', [slug1, slug2]);

        if (toolsError) throw toolsError;
        if (!tools || tools.length !== 2) {
            return NextResponse.json({ error: 'Tool(s) not found in the database.' }, { status: 404 });
        }

        const toolA = tools.find(t => t.slug === slug1);
        const toolB = tools.find(t => t.slug === slug2);

        const idA = toolA.id;
        const idB = toolB.id;

        // 2. Check DB cache FIRST (Only if no custom intent is provided)
        if (!intentQuery) {
            const { data: cachedComparison } = await supabase
                .from('tool_comparisons')
                .select('tool1_id, tool2_id, ai_report_json')
                .or(`and(tool1_id.eq.${idA},tool2_id.eq.${idB}),and(tool1_id.eq.${idB},tool2_id.eq.${idA})`)
                .maybeSingle();

            if (cachedComparison && cachedComparison.ai_report_json) {
            let report = cachedComparison.ai_report_json;
            console.log(`⚡ Serving cached comparison for ${slug1} vs ${slug2}`);

            if (cachedComparison.tool1_id === idB) {
                // Swap logic for consistent output
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

            return NextResponse.json({ data: report, source: 'cache' });
        }
        } // End of intentQuery cache check

        // 3. No cache found or Custom Intent - Generate with AI
        const promptContext = intentQuery 
            ? `The user has a VERY SPECIFIC context/task: "${intentQuery}". You MUST tailor your ENTIRE analysis—verdict, scores, why_buy, and matrix insights—explicitly to determine which tool is best for this exact scenario. Do not give a generic comparison.` 
            : `Analyze these tools deeply in a general, objective manner.`;

        const prompt = `
        You are an elite AI SaaS consultant. ${promptContext}
        
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
        `;

        const rawKeys = process.env.GEMINI_API_KEY || '';
        const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k.startsWith('AIza'));
        
        if (apiKeys.length === 0) return NextResponse.json({ error: 'AI service unavailable.' }, { status: 503 });

        const targetModels = ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-2.0-flash'];
        let lastError = null;
        let aiReport = null;

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
                        config: { 
                            responseMimeType: "application/json",
                            temperature: 0.2
                        }
                    });

                    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
                    if (!responseText) throw new Error('EMPTY_AI_RESPONSE');

                    aiReport = JSON.parse(responseText);
                    keySuccess = true;
                    break; 

                } catch (err) {
                    lastError = err;
                    console.warn(`  ⚠️ Attempt failed with key ${k+1} / model ${currentModel}:`, err.message);
                    continue; 
                }
            }
            if (keySuccess) break; 
        }

        // --- 🌐 OPENROUTER FALLBACK ENGINE ---
        if (!aiReport && process.env.OPENROUTER_API_KEY) {
            console.warn(`[AI-API] All Gemini keys exhausted. Falling back to OpenRouter (google/gemini-2.5-flash)`);
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
                    let responseText = orData.choices[0]?.message?.content || "";
                    const startIdx = responseText.indexOf('{');
                    const endIdx = responseText.lastIndexOf('}');
                    if (startIdx !== -1 && endIdx !== -1) {
                        aiReport = JSON.parse(responseText.substring(startIdx, endIdx + 1));
                        console.log(`  ✅ Comparison Analysis successful with OpenRouter fallback`);
                    }
                } else {
                    console.error('[AI-API] OpenRouter fallback HTTP error', await orResponse.text());
                }
            } catch (e) {
                console.error('[AI-API] OpenRouter fallback failed', e);
            }
        }

        if (!aiReport) throw lastError || new Error('AI_GENERATION_FAILED');

        // Background SEO Generation (Only for generic comparisons)
        if (!intentQuery) {
            try {
                generateAISeo(`${slug1}-vs-${slug2}`, {
                    tool1: toolA,
                    tool2: toolB,
                    verdict: aiReport.verdict.winner,
                    strategic_overview: aiReport.strategic_overview
                }, 'comparison');
            } catch (seoErr) {
                console.warn(`⚠️ SEO Error:`, seoErr.message);
            }
        }

        // Cache and Usage Update logic...
        const sortedIds = [idA, idB].sort();
        
        if (!intentQuery) {
            // Standard cache
            await supabase.from('tool_comparisons').upsert({
                tool1_id: sortedIds[0],
                tool2_id: sortedIds[1],
                ai_report_json: aiReport
            }, { onConflict: 'tool1_id,tool2_id' });
        } else {
            // Save to custom_comparisons
            try {
                const { data: customRecord } = await supabase.from('custom_comparisons').insert({
                    tool1_id: idA,
                    tool2_id: idB,
                    user_query: intentQuery,
                    ai_report_json: aiReport
                }).select('id').single();
                
                if (customRecord) {
                    aiReport.custom_id = customRecord.id;
                }
            } catch (err) {
                console.warn("Failed to save custom comparison (table might not exist yet):", err.message);
            }
        }

        if (userId && !isPremium) {
            const now = new Date();
            let newCount = (profileData?.ai_comparison_count || 0) + 1;
            await supabase.from('profiles').update({ 
                ai_comparison_count: newCount, 
                last_ai_comparison_at: now.toISOString() 
            }).eq('id', userId);
        }

        return NextResponse.json({ data: aiReport, source: 'ai' });

    } catch (error) {
        console.error('❌ Comparison Error:', error);
        return NextResponse.json({ error: error.message || 'Comparison failed' }, { status: 500 });
    }
}
