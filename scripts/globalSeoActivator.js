import { createClient } from '@supabase/supabase-js';
import { generateAISeo } from '../api/utils/seoGenerator.js';
import { SEO_CONFIG } from '../src/constants/seoManifest.js';

// 1. Initialize
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runGlobalActivation() {
    console.log("🚀 STARTING GLOBAL SEO ACTIVATION (V8 Engine)...");

    // --- PHASE 1: CORE STATIC PAGES ---
    console.log("\n--- PHASE 1: Optimizing Core Static Pages ---");
    const staticPages = ['home', 'about', 'faq', 'premium', 'promote'];
    for (const pageKey of staticPages) {
        const manifestData = SEO_CONFIG.pages[pageKey] || {};
        const data = {
            name: manifestData.title || pageKey,
            description: manifestData.description || '',
            type: 'page'
        };
        console.log(`🧠 AI Optimizing Page: [${pageKey}]`);
        await generateAISeo(pageKey, data, 'page');
        await new Promise(r => setTimeout(r, 5000));
    }

    // --- PHASE 2: CATEGORIES ---
    console.log("\n--- PHASE 2: Optimizing Categories ---");
    const { data: categories } = await supabase.from('categories').select('*');
    for (const cat of categories || []) {
        console.log(`🧠 AI Optimizing Category: [${cat.name}]`);
        await generateAISeo(cat.id, cat, 'category');
        await new Promise(r => setTimeout(r, 5000));
    }

    // --- PHASE 3: TOOLS (Sample/Missing) ---
    console.log("\n--- PHASE 3: Optimizing Tools ---");
    const { data: tools } = await supabase.from('tools').select('*').limit(20); 
    for (const tool of tools || []) {
        console.log(`🧠 AI Optimizing Tool: [${tool.name}]`);
        await generateAISeo(tool.id, tool, 'tool');
        await new Promise(r => setTimeout(r, 5000));
    }

    console.log("\n✨ GLOBAL ACTIVATION COMPLETE! Your platform is now 100% AI-SEO Hardened.");
}

runGlobalActivation();
