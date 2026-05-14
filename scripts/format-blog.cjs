const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// --- 🛠️ CONFIGURATION ---
// Reading from .env manually to avoid extra dependencies
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim();
});

const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_KEYS = (env.GEMINI_API_KEY || '').split(',').map(k => k.trim());

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEYS.length) {
    console.error('❌ Missing environment variables in .env');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 🧠 AI FORMATTING ENGINE ---
async function formatWithAI(rawContent) {
    console.log('🤖 Sending content to Gemini for Elite Formatting...');
    
    const prompt = `
    You are the Elite Content Editor for ServicesHUB.
    
    TASK:
    Format the following raw blog post content into clean, professional HTML.
    
    RULES:
    1. Use semantic HTML: <p> for paragraphs, <h2> for section headers, <strong> for emphasis.
    2. Use <ul> and <li> for lists.
    3. IMPORTANT: DO NOT change or remove shortcodes. Keep them EXACTLY as they are:
       - [tool id="UUID"]
       - [compare slug1="SLUG" slug2="SLUG"]
    4. Ensure there is a clean <p> or <h2> transition before and after every shortcode.
    5. Fix any overlapping text or jumbled sentences.
    6. Return ONLY the formatted HTML content. Do not include markdown code blocks or explanations.
    
    RAW CONTENT:
    ${rawContent}
    `;

    const apiKey = GEMINI_KEYS[Math.floor(Math.random() * GEMINI_KEYS.length)];
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Cleanup if AI wrapped in markdown code blocks
        if (text.startsWith('```html')) {
            text = text.replace(/^```html\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        
        return text.trim();
    } catch (error) {
        console.error('❌ AI Formatting Error:', error);
        throw error;
    }
}

// --- 🚀 MAIN EXECUTION ---
async function main() {
    const args = process.argv.slice(2);
    const targetSlug = args[0];

    try {
        let query = supabase.from('blog_posts').select('*');
        
        if (targetSlug) {
            console.log(`🔍 Searching for post with slug/id: ${targetSlug}`);
            query = query.or(`slug.eq.${targetSlug},id.eq.${targetSlug}`);
        } else {
            console.log('🔍 No slug provided. Fetching the latest published post...');
            query = query.order('created_at', { ascending: false }).limit(1);
        }

        const { data: post, error: fetchError } = await query.maybeSingle();

        if (fetchError || !post) {
            console.error('❌ Post not found:', fetchError?.message || 'Empty result');
            return;
        }

        console.log(`📝 Found Post: "${post.title}"`);
        
        const formattedContent = await formatWithAI(post.content);
        
        console.log('📤 Updating database...');
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ content: formattedContent })
            .eq('id', post.id);

        if (updateError) {
            console.error('❌ Update Error:', updateError.message);
        } else {
            console.log('✅ Success! The post has been formatted and updated.');
            console.log(`🔗 Preview locally at: http://localhost:3000/blog/${post.slug || post.id}`);
        }

    } catch (error) {
        console.error('❌ Unexpected Error:', error);
    }
}

main();
