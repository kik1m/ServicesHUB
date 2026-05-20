require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env.local'), quiet: true });
const { supabaseAdmin } = require('./supabaseClient');
const { generateAISeo } = require('./seoGenerator');

async function fixSingleToolSeo(identifier) {
    console.log(`\n🔍 Searching for tool matching: ${identifier}`);
    
    // Clean identifier (could be a full URL or a slug)
    let slug = identifier;
    let searchUrl = identifier;
    
    if (identifier.includes('http')) {
        try {
            const urlObj = new URL(identifier);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            if (pathParts.length > 0 && pathParts[0] === 'tool') {
                // Handle hubly-tools.com/tool/synthesia
                slug = pathParts[1];
            } else if (pathParts.length > 0) {
                // Handle synthesia.io/video-generator (fallback to last path segment)
                slug = pathParts.pop();
            } else {
                // Handle https://www.synthesia.io/ -> synthesia
                slug = urlObj.hostname.replace('www.', '').split('.')[0];
            }
        } catch (e) {
            slug = identifier;
        }
    }

    const { data: tool, error } = await supabaseAdmin
        .from('tools')
        .select('*')
        .or(`slug.eq."${slug}",url.eq."${searchUrl}",url.eq."${searchUrl.replace(/\/$/, '')}"`)
        .single();

    if (error || !tool) {
        console.error(`❌ Could not find tool with slug or URL: ${identifier}`);
        console.error(`💡 TIP: The tool must be imported into the database first before updating its SEO.`);
        console.error(`💡 Try running the '📥 Full Import' task for this URL first.`);
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
