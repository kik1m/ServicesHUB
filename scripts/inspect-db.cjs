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

async function inspectTable() {
    // Select one row and look at the keys
    const { data, error } = await supabase.from('tools').select('*').limit(1).single();
    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('📋 Columns in "tools" table:', Object.keys(data).join(', '));
    }
}

inspectTable();
