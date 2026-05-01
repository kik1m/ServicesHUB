import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://hubly-tools.com';

export default async function handler(req, res) {
    try {
        // 1. Fetch all required data in parallel
        const [toolsRes, catsRes, postsRes, profilesRes] = await Promise.all([
            supabase.from('tools').select('slug, updated_at').eq('is_approved', true),
            supabase.from('categories').select('slug'),
            supabase.from('blog_posts').select('id, created_at'),
            supabase.from('profiles').select('id').eq('membership', 'premium') // Only index premium or active profiles for quality
        ]);

        const tools = toolsRes.data || [];
        const categories = catsRes.data || [];
        const posts = postsRes.data || [];
        const profiles = profilesRes.data || [];

        // 2. Build the XML string
        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Pages -->
    <url>
        <loc>${BASE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${BASE_URL}/search</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>${BASE_URL}/categories</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/tools</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/compare</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${BASE_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${BASE_URL}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${BASE_URL}/faq</loc>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${BASE_URL}/premium</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/promote</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/privacy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
    </url>
    <url>
        <loc>${BASE_URL}/terms</loc>
        <changefreq>monthly</changefreq>
        <priority>0.4</priority>
    </url>
    <url>
        <loc>${BASE_URL}/login</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${BASE_URL}/signup</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>

    <!-- Dynamic Categories -->
    ${categories.map(cat => `
    <url>
        <loc>${BASE_URL}/category/${cat.slug}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>`).join('')}

    <!-- Dynamic Tools -->
    ${tools.map(tool => `
    <url>
        <loc>${BASE_URL}/tool/${tool.slug}</loc>
        <lastmod>${new Date(tool.updated_at || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`).join('')}

    <!-- Dynamic Blog Posts -->
    ${posts.map(post => `
    <url>
        <loc>${BASE_URL}/blog/${post.id}</loc>
        <lastmod>${new Date(post.created_at || Date.now()).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`).join('')}

    <!-- Dynamic Publisher Profiles -->
    ${profiles.map(profile => `
    <url>
        <loc>${BASE_URL}/profile/${profile.id}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>`).join('')}
</urlset>`;

        // 3. Send the response
        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send(xml);

    } catch (error) {
        console.error('Sitemap Generation Error:', error);
        res.status(500).send('Error generating sitemap');
    }
}
