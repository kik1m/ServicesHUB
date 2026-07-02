const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const path = require('path');

// --- ≡اؤبي╕ CONFIGURATION ---
// Load environment variables (.env.local or .env)
const env = {};
const envPaths = [
    path.join(__dirname, '../.env.local'),
    path.join(__dirname, '../.env')
];

let envLoaded = false;
for (const envPath of envPaths) {
    try {
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf8');
            envContent.split('\n').forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#')) return;
                const [key, ...value] = trimmedLine.split('=');
                if (key && value) env[key.trim()] = value.join('=').trim();
            });
            envLoaded = true;
            break;
        }
    } catch (e) {
        // Skip silently
    }
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL || env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_KEYS = (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').split(',').map(k => k.trim()).filter(Boolean);

if (!SUPABASE_URL || !SUPABASE_KEY || !GEMINI_KEYS.length) {
    console.error('ظإî Missing required environment variables (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or GEMINI_API_KEY)');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ≡ادب AI FORMATTING ENGINE ---
async function formatWithAI(rawContent) {
    console.log('≡اجû Sending content to Gemini for Elite Formatting...');
    
    const prompt = `
    You are the Elite Content Editor for ServicesHUB/HUBly.
    
    TASK:
    Format and structure the following raw blog post content into clean, professional, and highly readable HTML.
    
    RULES & STRUCTURE:
    1. SEMANTIC HEADINGS:
       - Use <h2> for major section headings.
       - Use <h3> for tool headings and subsections.
       - Do not over-use headings. Keep a clean hierarchy.
    2. SHORTER PARAGRAPHS:
       - Break down any long, dense blocks of text into smaller paragraphs (2-4 sentences max).
       - Long paragraphs are hard to read. Ensure comfortable spacing.
    3. BULLETED LISTS FOR FEATURES/PROS:
       - Identify lists of features, capabilities, pros, cons, or key takeaways, and format them using <ul> and <li>.
       - Use inline bold text for list items to make them scannable. Example: <li><strong>Core Feature:</strong> Description of the feature.</li>
    4. HIGHLIGHTS & CALLOUTS:
       - Use <blockquote> to highlight important quotes, expert tips, or key takeaways.
    5. SHORTCODES (CRITICAL):
       - Do NOT change, move, translate, or remove shortcodes. Keep them EXACTLY as they are:
         * [tool id="UUID"]
         * [compare slug1="SLUG" slug2="SLUG"]
         * [image url="URL" caption="CAPTION"]
       - Ensure shortcodes are placed on their own line, NOT wrapped inside <p> or other HTML tags.
    6. CLEAN HTML ONLY:
       - Return ONLY the formatted HTML content.
       - Do not wrap in markdown code blocks (\`\`\`html) or include any conversational prefaces or explanations.
    
    RAW CONTENT TO FORMAT:
    ${rawContent}
    `;

    const apiKey = GEMINI_KEYS[Math.floor(Math.random() * GEMINI_KEYS.length)];
    const ai = new GoogleGenAI({ apiKey });

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        
        let text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Cleanup if AI wrapped in markdown code blocks
        if (text.startsWith('```html')) {
            text = text.replace(/^```html\n/, '').replace(/\n```$/, '');
        } else if (text.startsWith('```')) {
            text = text.replace(/^```\n/, '').replace(/\n```$/, '');
        }
        
        return text.trim();
    } catch (error) {
        console.error('ظإî AI Formatting Error:', error);
        throw error;
    }
}

// --- ≡اأ MAIN EXECUTION ---
async function main() {
    const args = process.argv.slice(2);
    const targetSlug = args[0];

    try {
        let query = supabase.from('blog_posts').select('*');
        
        if (targetSlug) {
            console.log(`≡ا¤ Searching for post with slug/id: ${targetSlug}`);
            const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetSlug);
            if (isUUID) {
                query = query.eq('id', targetSlug);
            } else {
                query = query.eq('slug', targetSlug);
            }
        } else {
            console.log('≡ا¤ No slug provided. Fetching the latest published post...');
            query = query.order('created_at', { ascending: false }).limit(1);
        }

        const { data: post, error: fetchError } = await query.maybeSingle();

        if (fetchError || !post) {
            console.error('ظإî Post not found:', fetchError?.message || 'Empty result');
            return;
        }

        console.log(`≡اôإ Found Post: "${post.title}"`);
        
        const formattedContent = await formatWithAI(post.content);
        
        console.log('≡اôج Updating database...');
        const { error: updateError } = await supabase
            .from('blog_posts')
            .update({ content: formattedContent })
            .eq('id', post.id);

        if (updateError) {
            console.error('ظإî Update Error:', updateError.message);
        } else {
            console.log('ظ£à Success! The post has been formatted and updated.');
            console.log(`≡ا¤ù Preview locally at: http://localhost:3000/blog/${post.slug || post.id}`);
        }

    } catch (error) {
        console.error('ظإî Unexpected Error:', error);
    }
}

main();
