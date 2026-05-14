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
        { id: SEO_CONFIG.global.pageIds.home, name: 'HUBly - Ultimate AI & SaaS Discovery Hub' },
        { id: SEO_CONFIG.global.pageIds.about, name: 'About HUBly - Our Mission and Story' },
        { id: SEO_CONFIG.global.pageIds.tools, name: 'Discover Premium AI Tools | HUBly' },
        { id: SEO_CONFIG.global.pageIds.blog, name: 'HUBly Magazine - AI & SaaS Insights' },
        { id: SEO_CONFIG.global.pageIds.premium, name: 'HUBly Premium - Unlock Elite Power' },
        { id: SEO_CONFIG.global.pageIds.categories, name: 'AI Tool Categories | HUBly' },
        { id: SEO_CONFIG.global.pageIds.compare, name: 'AI Tool Comparison - Side-by-Side Analysis | HUBly' },
        { id: SEO_CONFIG.global.pageIds.promote, name: 'Promote Your AI Tool on HUBly' },
        { id: SEO_CONFIG.global.pageIds.contact, name: 'Contact HUBly Support' },
        { id: SEO_CONFIG.global.pageIds.faq, name: 'HUBly Help & FAQ' },
        { id: SEO_CONFIG.global.pageIds.privacy, name: 'HUBly Privacy Policy' },
        { id: SEO_CONFIG.global.pageIds.terms, name: 'HUBly Terms of Service' },
        { id: SEO_CONFIG.global.pageIds.search, name: 'Search AI Tools | HUBly Explorer' }
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
