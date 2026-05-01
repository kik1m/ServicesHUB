require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function findDuplicates() {
    console.log("🔍 Searching for Suno duplicates...");
    const { data: tools, error } = await supabase
        .from('tools')
        .select('id, name, slug, url, created_at')
        .ilike('name', '%Suno%');

    if (error) {
        console.error("❌ Error fetching tools:", error);
        return;
    }

    console.log("Found tools:", tools);

    const slugs = {};
    const toDelete = [];

    tools.forEach(tool => {
        if (slugs[tool.slug]) {
            // Duplicate found. Keep the newest one? Or the one with the most data?
            // For now, let's just identify them.
            toDelete.push(tool.id);
            console.log(`🗑️ Found duplicate slug: [${tool.slug}] ID: ${tool.id}`);
        } else {
            slugs[tool.slug] = tool.id;
        }
    });

    if (toDelete.length > 0) {
        console.log(`🚀 Deleting ${toDelete.length} duplicates...`);
        // const { error: delError } = await supabase.from('tools').delete().in('id', toDelete);
        // if (delError) console.error("❌ Delete error:", delError);
        // else console.log("✅ Duplicates removed.");
    } else {
        console.log("✅ No duplicates found with exact same slug.");
    }
}

findDuplicates();
