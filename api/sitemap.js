import { createClient } from '@supabase/supabase-js';
import { SEO_MANIFEST } from '../src/constants/seoManifest.js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const baseUrl = 'https://www.hubly-tools.com';

    // 1. Fetch Static Pages from Manifest
    const staticPages = Object.keys(SEO_MANIFEST).map(path => ({
      url: `${baseUrl}${path === '/' ? '' : path}`,
      changefreq: 'weekly',
      priority: path === '/' ? '1.0' : '0.8'
    }));

    // 2. Fetch Dynamic Entities
    const [tools, categories, blogs] = await Promise.all([
      supabase.from('tools').select('slug, updated_at'),
      supabase.from('categories').select('slug'),
      supabase.from('blog_posts').select('slug, updated_at')
    ]);

    const dynamicPages = [
      ...(tools.data || []).map(t => ({
        url: `${baseUrl}/tool/${t.slug}`,
        changefreq: 'weekly',
        priority: '0.7',
        lastmod: t.updated_at
      })),
      ...(categories.data || []).map(c => ({
        url: `${baseUrl}/category/${c.slug}`,
        changefreq: 'monthly',
        priority: '0.6'
      })),
      ...(blogs.data || []).map(b => ({
        url: `${baseUrl}/blog/${b.slug}`,
        changefreq: 'monthly',
        priority: '0.6',
        lastmod: b.updated_at
      }))
    ];

    const allPages = [...staticPages, ...dynamicPages];

    // 3. Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages.map(page => `
        <url>
          <loc>${page.url}</loc>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
          ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
        </url>
      `).join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();
  } catch (err) {
    console.error('Sitemap Error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
