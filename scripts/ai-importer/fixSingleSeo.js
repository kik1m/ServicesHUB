require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const { generateAISeo } = require('./seoGenerator');

async function fixSingleToolSeo(identifier) {
    console.log(`\n🔍 Searching for tool matching: ${identifier}`);
    
    // Clean identifier (could be a full URL or a slug)
    let slug = identifier;
    if (identifier.includes('http')) {
        const urlObj = new URL(identifier);
        slug = urlObj.pathname.split('/').filter(Boolean).pop();
    }

    const { data: tool, error } = await supabaseAdmin
        .from('tools')
        .select('*')
        .or(`slug.eq.${slug},website_url.eq.${identifier}`)
        .single();

    if (error || !tool) {
        console.error(`❌ Could not find tool with slug or URL: ${identifier}`);
        process.exit(1);
    }

    console.log(`✅ Found tool: ${tool.name} (ID: ${tool.id})`);
    console.log(`🧠 Generating Elite AI SEO...`);

    try {
        const seoData = await generateAISeo({
            name: tool.name,
            description: tool.short_description || tool.description || tool.name
        }, 'tool');

        if (seoData) {
            const { error: upsertErr } = await supabaseAdmin
                .from('seo_metadata')
                .upsert({
                    entity_id: tool.id,
                    entity_type: 'tool',
                    title: seoData.title,
                    description: seoData.description,
                    keywords: seoData.keywords,
                    search_intent: seoData.search_intent,
                    schema_markup: {
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": tool.name,
                        "description": tool.short_description || tool.description
                    },
                    ai_model: 'gemini-2.5-flash'
                }, { onConflict: 'entity_id,entity_type' });

            if (upsertErr) throw upsertErr;
            console.log(`🎉 Success! SEO for "${tool.name}" has been updated.`);
        }
    } catch (err) {
        console.error(`❌ Failed to generate SEO for ${tool.name}:`, err.message);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error('❌ Please provide a Tool URL or Slug.');
    process.exit(1);
}

fixSingleToolSeo(args[0]);
