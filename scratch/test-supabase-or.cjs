const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
    const idA = '00000000-0000-0000-0000-000000000001';
    const idB = '00000000-0000-0000-0000-000000000002';
    const { data, error } = await supabase
        .from('tool_comparisons')
        .select('tool1_id, tool2_id, ai_report_json')
        .or(`and(tool1_id.eq."${idA}",tool2_id.eq."${idB}"),and(tool1_id.eq."${idB}",tool2_id.eq."${idA}")`)
        .maybeSingle();
    console.log('With quotes:', error);

    const { data: d2, error: e2 } = await supabase
        .from('tool_comparisons')
        .select('tool1_id, tool2_id, ai_report_json')
        .or(`and(tool1_id.eq.${idA},tool2_id.eq.${idB}),and(tool1_id.eq.${idB},tool2_id.eq.${idA})`)
        .maybeSingle();
    console.log('Without quotes:', e2);
}
test();
