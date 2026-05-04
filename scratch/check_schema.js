import { supabase } from './src/lib/supabaseClient.js';

async function checkSchema() {
    console.log("Checking blog_posts schema...");
    const { data, error } = await supabase.from('blog_posts').select('*').limit(1);
    if (error) {
        console.error("Error fetching blog_posts:", error);
        return;
    }
    if (data && data.length > 0) {
        console.log("Columns found:", Object.keys(data[0]));
        console.log("Sample Data:", data[0]);
    } else {
        console.log("No blog posts found.");
    }
}

checkSchema();
