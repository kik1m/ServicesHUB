import { generateAISeo } from '../api/utils/seoGenerator.js';
import { SEO_CONFIG } from '../src/constants/seoManifest.js';

/**
 * 🚀 Static Page SEO Generator
 * Goal: Generate AI-optimized SEO for all main platform pages.
 * Focus: HUBly brand dominance.
 */
async function generateAllPagesSeo() {
    console.log('🚀 Starting AI SEO Generation for Static Pages...');
    
    const pages = [
        { id: SEO_CONFIG.global.pageIds.home, name: 'HUBly - The Elite AI & SaaS Ecosystem' },
        { id: SEO_CONFIG.global.pageIds.about, name: 'About HUBly - Our Mission and Vision' },
        { id: SEO_CONFIG.global.pageIds.tools, name: 'Explore HUBly Solutions Platform' },
        { id: SEO_CONFIG.global.pageIds.blog, name: 'HUBly Insights & Tech Magazine' },
        { id: SEO_CONFIG.global.pageIds.premium, name: 'HUBly Premium - Exclusive Elite Access' },
        { id: SEO_CONFIG.global.pageIds.categories, name: 'HUBly Ecosystem Categories' },
        { id: SEO_CONFIG.global.pageIds.compare, name: 'HUBly AI - Your Intelligent Assistant' },
        { id: SEO_CONFIG.global.pageIds.promote, name: 'Grow with HUBly Platform' },
        { id: SEO_CONFIG.global.pageIds.contact, name: 'Contact HUBly Support' },
        { id: SEO_CONFIG.global.pageIds.faq, name: 'HUBly Help & FAQ' },
        { id: SEO_CONFIG.global.pageIds.privacy, name: 'HUBly Privacy Policy' },
        { id: SEO_CONFIG.global.pageIds.terms, name: 'HUBly Terms of Service' }
    ];

    const pageKeyMap = {
        [SEO_CONFIG.global.pageIds.home]: 'home',
        [SEO_CONFIG.global.pageIds.about]: 'about',
        [SEO_CONFIG.global.pageIds.tools]: 'tools',
        [SEO_CONFIG.global.pageIds.blog]: 'blog',
        [SEO_CONFIG.global.pageIds.premium]: 'premium',
        [SEO_CONFIG.global.pageIds.categories]: 'categories',
        [SEO_CONFIG.global.pageIds.compare]: 'compare',
        [SEO_CONFIG.global.pageIds.promote]: 'promote',
        [SEO_CONFIG.global.pageIds.contact]: 'contact',
        [SEO_CONFIG.global.pageIds.faq]: 'faq',
        [SEO_CONFIG.global.pageIds.privacy]: 'privacy',
        [SEO_CONFIG.global.pageIds.terms]: 'terms',
        [SEO_CONFIG.global.pageIds.search]: 'search'
    };

    for (const page of pages) {
        try {
            const key = pageKeyMap[page.id];
            console.log(`\n[GENERATE] Processing Page: ${key}...`);
            const result = await generateAISeo(page.id, { name: page.name, description: '' }, 'page');
            console.log(`✅ Success: ${page.id}`);
            console.log(`   Title: ${result.title}`);
        } catch (err) {
            console.error(`❌ Failed: ${page.id}`, err.message);
        }
    }

    console.log('\n✨ All static pages processed successfully!');
}

generateAllPagesSeo();
