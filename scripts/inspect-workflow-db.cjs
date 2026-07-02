const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '../.env.local');
let envContent = '';
try {
    envContent = fs.readFileSync(envPath, 'utf8');
} catch (e) {
    try {
        envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
    } catch (err) {
        console.error('❌ Could not find .env.local or .env file');
        process.exit(1);
    }
}

const env = {};
envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    const key = parts[0]?.trim();
    const val = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    if (key && val) env[key] = val;
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase URL or Service Role Key in environment variables');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyTables() {
    console.log('🔄 Checking Supabase connection and tables...');
    
    const checkTable = async (tableName) => {
        const { data, error } = await supabase.from(tableName).select('*').limit(1);
        if (error) {
            if (error.message.includes('does not exist') || error.message.includes('not found')) {
                console.log(`❌ Table "${tableName}" does not exist in the database yet.`);
                return false;
            } else {
                console.log(`⚠️ Error accessing table "${tableName}":`, error.message);
                return false;
            }
        } else {
            console.log(`✅ Table "${tableName}" exists and is accessible.`);
            return true;
        }
    };

    const projectsOk = await checkTable('ai_workflow_projects');
    const statesOk = await checkTable('ai_workflow_states');
    const messagesOk = await checkTable('ai_workflow_messages');

    if (projectsOk && statesOk && messagesOk) {
        console.log('\n🎉 All workflow tables are successfully configured in Supabase!');
    } else {
        console.log('\n⚠️ Some tables are missing. Please run the SQL schema in: db/workflow_schema.sql');
    }
}

verifyTables();
