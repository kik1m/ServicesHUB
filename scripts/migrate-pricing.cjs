const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim();
});

const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runMigration() {
    console.log('🚀 Running Database Migration (Elite Pricing Update)...');
    
    // We'll use a series of 'safe' checks or just provide the SQL instructions if RPC is missing.
    // However, I'll try to check if columns exist first.
    
    const { data: tool, error: checkErr } = await supabase.from('tools').select('*').limit(1).single();
    
    if (checkErr) {
        console.error('❌ Error accessing tools table:', checkErr.message);
        return;
    }

    const columns = Object.keys(tool);
    let neededSql = "";

    if (!columns.includes('pricing_details_full')) {
        neededSql += "ALTER TABLE tools ADD COLUMN pricing_details_full TEXT;\n";
    }
    if (!columns.includes('pricing_url')) {
        neededSql += "ALTER TABLE tools ADD COLUMN pricing_url TEXT;\n";
    }

    if (neededSql) {
        console.log('⚠️ Missing columns detected. Please run the following SQL in your Supabase SQL Editor:');
        console.log('\n' + neededSql);
        console.log('--------------------------------------------------');
    } else {
        console.log('✅ All required pricing columns exist.');
    }
}

runMigration();
