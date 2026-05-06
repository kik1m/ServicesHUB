require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');
const { generateAISeo } = require('./seoGenerator');

/**
 * 👑 ULTIMATE SEO AUDIT & REPAIR ENGINE
 * Ensures 100% of tools have AI-optimized metadata.
 */
async function runUltimateSeoFix() {
    console.log('\n👑 Starting Ultimate SEO Audit & Repair...');
    console.log('='.repeat(60));

    // 1. Fetch all tools
    const { data: tools, error: toolsErr } = await supabaseAdmin
        .from('tools')
        .select('id, name, short_description, description, slug, is_approved');

    if (toolsErr) {
        console.error('❌ Failed to fetch tools:', toolsErr.message);
        return;
    }

    console.log(`📋 Total tools in database: ${tools.length}`);

    // 2. Fetch existing SEO metadata
    const { data: existingSeo } = await supabaseAdmin
        .from('seo_metadata')
        .select('entity_id, title, ai_model')
        .eq('entity_type', 'tool');

    const seoMap = new Map((existingSeo || []).map(s => [s.entity_id, s]));

    // 3. Identification Phase
    const toolsNeedingFix = tools.filter(tool => {
        const seo = seoMap.get(tool.id);
        if (!seo) return true; // Missing
        
        // Pattern detection for fallbacks
        const isFallback = seo.title.includes('Review, Features & Pricing') || 
                          seo.title.includes('Review, Pricing & Features | Official Info');
        
        return isFallback;
    });

    console.log(`🎯 Tools needing AI-Optimization: ${toolsNeedingFix.length}`);
    console.log(`✅ Tools already optimized: ${tools.length - toolsNeedingFix.length}`);
    console.log('='.repeat(60));

    if (toolsNeedingFix.length === 0) {
        console.log('🎉 Everything is already 100% AI-Optimized!');
        return;
    }

    // 4. Execution Phase
    let fixed = 0;
    let skipped = 0;

    for (let i = 0; i < toolsNeedingFix.length; i++) {
        const tool = toolsNeedingFix[i];
        console.log(`\n[${i + 1}/${toolsNeedingFix.length}] 🛠️ Repairing: ${tool.name}`);

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
                console.log(`  ✅ Success: "${seoData.title}"`);
                fixed++;
            }
        } catch (err) {
            if (err.isQuotaError || err.message === 'QUOTA_EXHAUSTED') {
                console.log(`\n🚫 STOPPED: AI Quota Exhausted. (Completed ${fixed} fixes).`);
                console.log(`⏳ Please run this script again tomorrow to finish the remaining ${toolsNeedingFix.length - i} tools.`);
                break;
            }
            console.error(`  ❌ Failed for ${tool.name}:`, err.message);
            skipped++;
        }

        // 15s Safety Delay to respect Free Tier limits
        if (i < toolsNeedingFix.length - 1) {
            console.log(`  ⏳ Waiting 15s for next tool...`);
            await new Promise(r => setTimeout(r, 15000));
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 REPAIR REPORT');
    console.log('='.repeat(60));
    console.log(`✅ Fixed:   ${fixed}`);
    console.log(`⏭️ Skipped: ${skipped}`);
    console.log(`🏆 Total Health: ${((tools.length - (toolsNeedingFix.length - fixed)) / tools.length * 100).toFixed(1)}%`);
    console.log('='.repeat(60));
}

runUltimateSeoFix();
