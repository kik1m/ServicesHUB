const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  // The Supabase JS client doesn't expose a direct way to create storage policies.
  // But we can run raw SQL via the REST API using the service role key.

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`;
  
  const policies = [
    `CREATE POLICY "Allow authenticated avatar uploads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars')`,
    `CREATE POLICY "Allow authenticated avatar updates" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars')`,
    `CREATE POLICY "Allow authenticated avatar deletes" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'avatars')`,
    `CREATE POLICY "Allow public avatar reads" ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars')`,
  ];

  // Use Supabase's management API via the admin client's underlying fetch
  for (const sql of policies) {
    try {
      const { data, error } = await supabaseAdmin
        .from('_exec_sql')
        .select()
        .eq('query', sql)
        .single()
        .catch(() => ({ data: null, error: 'not available' }));
      console.log('SQL:', sql.substring(0, 55));
      console.log('Result:', data, error);
    } catch(e) {
      console.log('Error:', e.message);
    }
  }

  // Alternative: try the auth admin to see if we can use admin.query
  console.log('\n--- Attempting via raw query ---');
  const { data: testData, error: testError } = await supabaseAdmin
    .rpc('version')
    .catch(e => ({ data: null, error: e.message }));
  console.log('RPC test:', testData, testError);
}

main();
