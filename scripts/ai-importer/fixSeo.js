require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const { generateAISeo } = require('./seoGenerator');

/**
 * 🔧 SEO Fix Script - Regenerates AI SEO for all tools with fallback/default metadata
 * Run: node scripts/ai-importer/fixSeo.js
 */
async function fixAllToolsSeo() {
    console.log('🔧 Starting SEO Fix Script...');
    console.log('='.repeat(50));

    // 1. Fetch all approved tools
    const { data: tools, error: toolsErr } = await supabaseAdmin
        .from('tools')
        .select('id, name, short_description, description, slug')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    if (toolsErr) {
        console.error('❌ Failed to fetch tools:', toolsErr.message);
        process.exit(1);
    }

    console.log(`📋 Total approved tools found: ${tools.length}`);

    // 2. Fetch existing SEO metadata for all tools
    const { data: existingSeo } = await supabaseAdmin
        .from('seo_metadata')
        .select('entity_id, title')
        .eq('entity_type', 'tool');

    const seoMap = new Map((existingSeo || []).map(s => [s.entity_id, s.title]));

    // 3. Filter tools that need SEO fix:
    //    - No SEO record at all, OR
    //    - SEO title matches the fallback pattern "NAME - Review, Features & Pricing"
    const toolsToFix = tools.filter(tool => {
        const existingTitle = seoMap.get(tool.id);
        if (!existingTitle) return true; // No SEO at all
        const fallbackPattern = `${tool.name} - Review, Features & Pricing`;
        return existingTitle.trim() === fallbackPattern.trim();
    });

    console.log(`🎯 Tools needing SEO fix: ${toolsToFix.length}`);
    console.log(`✅ Tools already with AI SEO: ${tools.length - toolsToFix.length}`);
    console.log('='.repeat(50));

    if (toolsToFix.length === 0) {
        console.log('🎉 All tools already have proper AI-generated SEO! Nothing to do.');
        return;
    }

    // 4. Process each tool
    const stats = { fixed: 0, failed: 0, skipped: 0 };

    for (let i = 0; i < toolsToFix.length; i++) {
        const tool = toolsToFix[i];
        console.log(`\n[${i + 1}/${toolsToFix.length}] Processing: ${tool.name}`);

        try {
            const seoData = await generateAISeo({
                name: tool.name,
                description: tool.short_description || tool.description || tool.name
            }, 'tool');

            if (!seoData || seoData.title.includes('Review, Features & Pricing')) {
                console.log(`  ⚠️ AI returned fallback again for ${tool.name} - SKIPPING`);
                stats.skipped++;
                continue;
            }

            // Upsert the new AI-generated SEO
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

            console.log(`  ✅ Fixed: "${seoData.title}"`);
            stats.fixed++;

        } catch (err) {
            // Stop immediately if quota is exhausted - no point continuing
            if (err.isQuotaError || err.message === 'QUOTA_EXHAUSTED') {
                console.log(`\n  🚫 QUOTA EXHAUSTED — Gemini free tier daily limit reached.`);
                console.log(`  ⏳ Please wait until tomorrow and run the script again to fix the remaining tools.`);
                stats.skipped += (toolsToFix.length - i);
                break;
            }
            console.error(`  ❌ Failed for ${tool.name}:`, err.message);
            stats.failed++;
        }

        // 15-second delay between tools to respect Gemini rate limits
        if (i < toolsToFix.length - 1) {
            console.log(`  ⏳ Waiting 15s before next tool...`);
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }

    // 5. Final Report
    console.log('\n' + '='.repeat(50));
    console.log('📊 SEO FIX REPORT');
    console.log('='.repeat(50));
    console.log(`✅ Fixed:   ${stats.fixed}`);
    console.log(`⏭️ Skipped: ${stats.skipped}`);
    console.log(`❌ Failed:  ${stats.failed}`);
    console.log('='.repeat(50));
    console.log('🎉 SEO Fix Script Complete!');
}

fixAllToolsSeo();
