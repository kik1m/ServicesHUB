import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials in env.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
    console.log("Testing getRecentComparisons query...");
    const { data, error } = await supabase
        .from('tool_comparisons')
        .select(`
            id,
            created_at,
            tool1:tools!tool1_id(id, name, slug, image_url),
            tool2:tools!tool2_id(id, name, slug, image_url),
            ai_report_json
        `)
        .order('created_at', { ascending: false })
        .limit(4);

    if (error) {
        console.error("ACTUAL ERROR OBJECT:");
        console.dir(error, { depth: null });
    } else {
        console.log("Query SUCCESS. Data length:", data?.length);
    }
}

testQuery();
