const { supabaseAdmin } = require('./supabaseClient');

async function cleanDuplicates() {
    console.log("🔍 Checking for Suno duplicates...");
    const { data: tools, error } = await supabaseAdmin
        .from('tools')
        .select('id, name, slug')
        .ilike('slug', '%suno%');

    if (error) {
        console.error("❌ Error:", error);
        return;
    }

    console.log("Found:", tools);

    if (tools.length > 1) {
        // Find if they have same slug
        const slugMap = {};
        const idsToDelete = [];

        tools.forEach(tool => {
            if (slugMap[tool.slug]) {
                idsToDelete.push(tool.id);
            } else {
                slugMap[tool.slug] = tool.id;
            }
        });

        if (idsToDelete.length > 0) {
            console.log("🗑️ Deleting duplicates:", idsToDelete);
            const { error: delErr } = await supabaseAdmin.from('tools').delete().in('id', idsToDelete);
            if (delErr) console.error("❌ Delete failed:", delErr);
            else console.log("✅ Duplicates cleaned. Page should work now.");
        } else {
            console.log("ℹ️ Tools have different slugs, but maybe one is causing issues. Let's check exact slug suno-v4");
            const { data: exactSlug } = await supabaseAdmin.from('tools').select('id').eq('slug', 'suno-v4');
            if (exactSlug.length > 1) {
                const toDel = exactSlug.slice(1).map(t => t.id);
                await supabaseAdmin.from('tools').delete().in('id', toDel);
                console.log("✅ Cleaned exact slug duplicates.");
            }
        }
    } else {
        console.log("✅ No duplicates found.");
    }
}

cleanDuplicates();
