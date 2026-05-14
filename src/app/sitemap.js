import { createClient } from '@supabase/supabase-js';
import { SEO_CONFIG } from '../constants/seoManifest.js';

// Use Service Role Key for background fetching (Sitemap generation)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const revalidate = 3600; // Update sitemap every hour

export default async function sitemap() {
    const baseUrl = 'https://www.hubly-tools.com';

    // 1. Static Pages
    const EXCLUDED_PAGES = ['auth', 'login', 'signup', 'dashboard', 'profile', 'settings', 'notifications', 'admin', 'success', 'notfound'];
    
    const staticPages = Object.entries(SEO_CONFIG.pages)
        .filter(([key, data]) => !data.noindex && !EXCLUDED_PAGES.includes(key))
        .map(([path]) => ({
            url: path === 'home' ? `${baseUrl}` : `${baseUrl}/${path}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: path === 'home' ? 1.0 : 0.8
        }));

    // 2. Dynamic Pages (Parallel Fetch)
    const [tools, categories, blogs] = await Promise.all([
        supabase.from('tools').select('slug, updated_at').eq('is_approved', true),
        supabase.from('categories').select('slug'),
        supabase.from('blog_posts').select('slug, created_at')
    ]);

    const toolPages = (tools.data || []).map(t => ({
        url: `${baseUrl}/tool/${t.slug}`,
        lastModified: t.updated_at ? new Date(t.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.8
    }));

    const categoryPages = (categories.data || []).map(c => ({
        url: `${baseUrl}/category/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6
    }));

    const blogPages = (blogs.data || []).map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        lastModified: b.created_at ? new Date(b.created_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7
    }));

    return [
        ...staticPages,
        ...toolPages,
        ...categoryPages,
        ...blogPages
    ];
}
