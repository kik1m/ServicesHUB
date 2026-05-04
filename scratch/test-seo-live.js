import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

// 1. Initialize
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const ai = new GoogleGenAI({ apiKey: geminiKey });

async function runLiveTest() {
    console.log("🔍 Fetching a real tool from your DB...");
    const { data: tool, error } = await supabase.from('tools').select('*').limit(1).single();
    
    if (error || !tool) {
        console.error("❌ No tools found or Env issues.", error);
        return;
    }

    console.log(`🎯 Testing SEO Engine on: [${tool.name}]`);

    // 2. Generate Hash
    const rawDataString = JSON.stringify({ 
        name: tool.name, 
        desc: tool.description || tool.short_description || '',
        features: tool.features || [],
        pricing: tool.pricing_type || '',
        type: 'tool'
    });
    const currentHash = crypto.createHash('md5').update(rawDataString).digest('hex');

    // 3. Call AI SEO Generator (Matching your project's specific SDK pattern)
    const prompt = `
    You are an elite SEO Strategist. Generate high-conversion SEO metadata for this tool:
    Name: ${tool.name}
    Description: ${tool.short_description || tool.description}
    
    Output STRICT JSON: { "title": "...", "description": "...", "keywords": [] }
    `;

    console.log("🧠 AI is thinking (via gemini-2.5-flash)...");
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const seoResult = JSON.parse(response.text);

        console.log("✅ AI Result Generated!");
        console.log(JSON.stringify(seoResult, null, 2));

        // 4. Upsert to DB
        console.log("💾 Saving to seo_metadata table...");
        const { error: saveError } = await supabase.from('seo_metadata').upsert({
            entity_id: tool.id,
            entity_type: 'tool',
            title: seoResult.title,
            description: seoResult.description,
            keywords: seoResult.keywords,
            data_hash: currentHash,
            schema_markup: { "@type": "SoftwareApplication", "name": tool.name },
            ai_model: 'gemini-2.5-flash'
        }, { onConflict: 'entity_id,entity_type' });

        if (saveError) console.error("❌ Save Error:", saveError);
        else console.log("🎉 SUCCESS! Real SEO saved for " + tool.name);

    } catch (apiError) {
        console.error("❌ AI API Error:", apiError.message);
    }
}

runLiveTest();
