import { createClient } from '@supabase/supabase-js';
import { generateAISeo } from '../src/app/api/utils/seoGenerator.js';
import { SEO_CONFIG } from '../src/constants/seoManifest.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Helper to generate a valid UUID v4 format from a string
function generateDeterministicUUID(str) {
    const hash = crypto.createHash('md5').update(str).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

// 1. Initialize
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runGlobalActivation() {
    console.log("🚀 STARTING GLOBAL SEO ACTIVATION (V13 Engine)...");

    // --- PHASE 1: PAGES & DOCS ---
    console.log("\n--- PHASE 1: Optimizing Core Static Pages & Docs ---");
    const pageKeys = Object.keys(SEO_CONFIG.pages);
    for (const pageKey of pageKeys) {
        const manifestData = SEO_CONFIG.pages[pageKey];
        if (manifestData.noindex) continue;
        const entityId = SEO_CONFIG.global.pageIds[pageKey] || generateDeterministicUUID(`page_${pageKey}`);
        const data = { name: manifestData.title || pageKey, description: manifestData.description || '', type: 'page' };
        console.log(`🧠 AI Optimizing Page: [${pageKey}]`);
        await generateAISeo(entityId, data, 'page');
        await new Promise(r => setTimeout(r, 1000));
    }
    const docKeys = Object.keys(SEO_CONFIG.docs || {});
    for (const docKey of docKeys) {
        const entityId = generateDeterministicUUID(`docs_${docKey}`);
        const data = { name: SEO_CONFIG.docs[docKey].title || `HUBly Doc: ${docKey}`, description: '', type: 'page' };
        console.log(`🧠 AI Optimizing Doc: [${docKey}]`);
        await generateAISeo(entityId, data, 'page');
        await new Promise(r => setTimeout(r, 1000));
    }

    // --- PHASE 2: CATEGORIES ---
    console.log("\n--- PHASE 2: Optimizing Categories ---");
    const { data: categories } = await supabase.from('categories').select('*');
    for (const cat of categories || []) {
        console.log(`🧠 AI Optimizing Category: [${cat.name}]`);
        await generateAISeo(cat.id, cat, 'category');
        await new Promise(r => setTimeout(r, 1000));
    }

    // --- PHASE 3: TOOLS ---
    console.log("\n--- PHASE 3: Optimizing Tools ---");
    const { data: tools } = await supabase.from('tools').select('*'); 
    for (const tool of tools || []) {
        console.log(`🧠 AI Optimizing Tool: [${tool.name}]`);
        await generateAISeo(tool.id, tool, 'tool');
        await new Promise(r => setTimeout(r, 1000));
    }

    // --- PHASE 4: COMPARISONS ---
    console.log("\n--- PHASE 4: Optimizing Comparisons ---");
    const { data: comps } = await supabase
        .from('tool_comparisons')
        .select(`
            id,
            ai_report_json,
            tool1:tools!tool1_id(name),
            tool2:tools!tool2_id(name)
        `);
        
    for (const comp of comps || []) {
        const tool1Name = comp.tool1?.name || 'Tool 1';
        const tool2Name = comp.tool2?.name || 'Tool 2';
        const verdict = comp.ai_report_json?.verdict?.summary || '';
        
        console.log(`🧠 AI Optimizing Comparison: [${tool1Name} vs ${tool2Name}]`);
        await generateAISeo(comp.id, { name: `${tool1Name} vs ${tool2Name}`, description: verdict }, 'comparison');
        await new Promise(r => setTimeout(r, 1000));
    }

    // --- PHASE 5: BLOGS ---
    console.log("\n--- PHASE 5: Optimizing Blogs ---");
    const { data: blogs } = await supabase.from('blog_posts').select('*');
    for (const blog of blogs || []) {
        console.log(`🧠 AI Optimizing Blog: [${blog.title}]`);
        await generateAISeo(blog.id, { name: blog.title, description: blog.excerpt }, 'blog');
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("\n✨ GLOBAL ACTIVATION COMPLETE! Your platform is now 100% AI-SEO Hardened.");
}

runGlobalActivation();
