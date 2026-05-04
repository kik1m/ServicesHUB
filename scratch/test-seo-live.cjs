require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
const crypto = require('crypto');

// 1. Initialize
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function runLiveTest() {
    console.log("🔍 Fetching a real tool from your DB...");
    const { data: tool, error } = await supabase.from('tools').select('*').limit(1).single();
    
    if (error || !tool) {
        console.error("❌ No tools found in DB to test.");
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

    // 3. Call AI SEO Generator
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });
    
    const prompt = `
    You are an elite SEO Strategist. Generate high-conversion SEO metadata for this tool:
    Name: ${tool.name}
    Description: ${tool.short_description || tool.description}
    
    Output JSON: { "title": "...", "description": "...", "keywords": [] }
    `;

    console.log("🧠 AI is thinking...");
    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const seoResult = JSON.parse(result.response.text());

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
        ai_model: 'gemini-1.5-flash'
    }, { onConflict: 'entity_id,entity_type' });

    if (saveError) console.error("❌ Save Error:", saveError);
    else console.log("🎉 SUCCESS! The tool now has LIVE AI SEO in the DB.");
}

runLiveTest();
