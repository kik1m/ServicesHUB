require('dotenv').config();
const { supabaseAdmin } = require('./supabaseClient');

/**
 * 🧹 SEO Database Sanitizer
 * Removes duplicate SEO entries and cleans fallback metadata where AI data exists.
 */
async function cleanSeoDatabase() {
    console.log('🧹 Starting SEO Database Cleanup...');
    console.log('='.repeat(50));

    // 1. Fetch all tool SEO metadata
    const { data: allSeo, error } = await supabaseAdmin
        .from('seo_metadata')
        .select('id, entity_id, entity_type, title, created_at')
        .eq('entity_type', 'tool');

    if (error) {
        console.error('❌ Failed to fetch SEO metadata:', error.message);
        process.exit(1);
    }

    console.log(`📋 Total SEO records found: ${allSeo.length}`);

    const toolGroups = {};
    allSeo.forEach(record => {
        if (!toolGroups[record.entity_id]) toolGroups[record.entity_id] = [];
        toolGroups[record.entity_id].push(record);
    });

    const toDelete = [];
    let fallbackCleaned = 0;
    let duplicatesRemoved = 0;

    Object.keys(toolGroups).forEach(entityId => {
        const records = toolGroups[entityId];
        
        if (records.length > 1) {
            // Check if one is AI-generated and others are fallbacks
            const aiGenerated = records.filter(r => !r.title.includes('Review, Features & Pricing'));
            const fallbacks = records.filter(r => r.title.includes('Review, Features & Pricing'));

            if (aiGenerated.length > 0 && fallbacks.length > 0) {
                // Keep the AI ones, delete the fallbacks
                fallbacks.forEach(f => toDelete.push(f.id));
                fallbackCleaned += fallbacks.length;
            } else if (records.length > 1) {
                // All are the same type? Keep the newest one
                const sorted = records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                const extras = sorted.slice(1);
                extras.forEach(e => toDelete.push(e.id));
                duplicatesRemoved += extras.length;
            }
        }
    });

    if (toDelete.length === 0) {
        console.log('✨ No duplicates or junk fallbacks found. Database is clean!');
        return;
    }

    console.log(`🎯 Found ${toDelete.length} records to delete (${fallbackCleaned} fallbacks, ${duplicatesRemoved} duplicates).`);

    // Perform deletion in chunks
    const chunkSize = 50;
    for (let i = 0; i < toDelete.length; i += chunkSize) {
        const chunk = toDelete.slice(i, i + chunkSize);
        const { error: delError } = await supabaseAdmin
            .from('seo_metadata')
            .delete()
            .in('id', chunk);

        if (delError) {
            console.error(`❌ Failed to delete chunk:`, delError.message);
        } else {
            console.log(`✅ Deleted chunk ${i / chunkSize + 1}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 CLEANUP REPORT');
    console.log('='.repeat(50));
    console.log(`🧹 Records Removed: ${toDelete.length}`);
    console.log('='.repeat(50));
    console.log('🎉 Database is now clean! Next step: Add Unique Constraint in SQL editor.');
}

cleanSeoDatabase();
