import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { profilesService } from '../services/profilesService';
import { compareService } from '../services/compareService';
import HomeClient from './HomeClient';

// Rule #2: ISR Revalidation tag
export const revalidate = 3600; // 1 hour

/**
 * 🚀 Elite Home Page (Server Component)
 * Implements Rule #2: SSR/ISR Logic
 * Implements Rule #5: SEO Metadata Visibility
 */
import { seoService } from '../services/seoService';
import { SEO_CONFIG } from '../constants/seoManifest';

export async function generateMetadata() {
    // 1. Try fetching AI SEO from database
    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.home, 'page');
    
    // 2. Prepare dynamic stats for fallback
    const statsRes = await toolsService.getToolsStats();
    const toolsCount = statsRes.count || 0;
    
    const title = dynamicSeo?.title || (toolsCount > 0 
        ? `${toolsCount}+ AI Tools, SaaS & Automation Discovery Hub | HUBly` 
        : 'Ultimate AI & SaaS Discovery Hub | Discover, Compare & Scale');
        
    const description = dynamicSeo?.description || 'Discover trending AI tools, premium SaaS platforms, and professional automation software. Explore expert picks, latest arrivals, and top-rated solutions on HUBly.';

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: 'Discover trending AI tools, premium SaaS platforms, and professional automation software.',
            url: 'https://www.hubly-tools.com',
            siteName: 'HUBly',
            images: [
                {
                    url: 'https://www.hubly-tools.com/og-image.png',
                    width: 1200,
                    height: 630,
                },
            ],
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: 'Discover trending AI tools, premium SaaS platforms, and professional automation software.',
            images: ['https://www.hubly-tools.com/og-image.png'],
        },
    };
}

export default async function HomePage() {
    // 1. Parallel Data Fetching - Elite Performance Layer
    const [
        categoriesRes,
        featuredRes,
        latestRes,
        trendingRes,
        postsRes,
        comparisonsRes,
        toolsStatsRes,
        usersCountRes,
        bannerToolsRes
    ] = await Promise.all([
        categoriesService.getHomeCategories(),
        toolsService.getFeaturedTools(),
        toolsService.getLatestTools(),
        toolsService.getTrendingTools(),
        blogService.getLatestPosts(),
        compareService.getRecentComparisons(),
        toolsService.getToolsStats(),
        profilesService.getUsersCount(),
        toolsService.getBannerTools()
    ]);

    // 2. Prepare unified stats object
    const stats = {
        tools: toolsStatsRes.count || 0,
        views: toolsStatsRes.views || 0,
        clicks: toolsStatsRes.clicks || 0,
        users: usersCountRes.count || 0
    };

    // 3. Prepare JSON-LD - Elite SEO Layer
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "HUBly",
            "url": "https://www.hubly-tools.com",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.hubly-tools.com/tools?q={search_term_string}",
                "query-input": "required name=search_term_string"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "HUBly",
            "url": "https://www.hubly-tools.com",
            "logo": "https://www.hubly-tools.com/logo.png",
            "sameAs": [
                "https://twitter.com/hubly_tools",
                "https://github.com/hubly"
            ]
        },
        {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": (featuredRes.data || []).map((tool, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://www.hubly-tools.com/tool/${tool.slug}`
            }))
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient 
                initialCategories={categoriesRes.data || []}
                initialFeatured={featuredRes.data || []}
                initialLatest={latestRes.data || []}
                initialTrending={trendingRes.data || []}
                initialPosts={postsRes.data || []}
                initialStats={stats}
                initialComparisons={comparisonsRes.data || []}
                initialBannerTools={bannerToolsRes.data || []}
            />
        </>
    );
}
