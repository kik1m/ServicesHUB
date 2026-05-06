import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getTools() {
    const { data, error } = await supabase
        .from('tools')
        .select('id, name')
        .eq('is_approved', true)
        .limit(3);
    
    if (error) {
        console.error(error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }

    const { data: catData } = await supabase.from('blog_categories').select('id, name').limit(1);
    console.log('Categories:', JSON.stringify(catData, null, 2));
}

getTools();
