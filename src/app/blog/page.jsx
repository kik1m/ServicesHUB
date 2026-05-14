import React from 'react';
import { blogService } from '../../services/blogService';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import BlogClient from './BlogClient';

// Rule #2: ISR Revalidation
export const revalidate = 3600; // 1 hour

export async function generateMetadata() {
    const title = 'AI & SaaS Magazine - Expert Guides, News & Insights | HUBly';
    const description = 'Stay updated with the world of AI and SaaS through our handpicked collection of expert articles, tutorials, and news.';
    const url = 'https://www.hubly-tools.com/blog';

    return {
        title,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title,
            description,
            url,
            siteName: 'HUBly',
            images: [{ url: 'https://www.hubly-tools.com/og-image.png' }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: ['https://www.hubly-tools.com/og-image.png'],
        },
    };
}

export default async function BlogPage() {
    const { ITEMS_PER_PAGE } = BLOG_CONSTANTS.GRID;
    
    // Parallel Fetching for Elite Performance
    const [postsRes, categoriesRes] = await Promise.all([
        blogService.getPosts({ 
            page: 0, 
            itemsPerPage: ITEMS_PER_PAGE 
        }),
        blogService.getCategories()
    ]);

    const initialCategories = categoriesRes.data 
        ? [BLOG_CONSTANTS.FILTERS.ALL, ...categoriesRes.data.map(c => c.name)]
        : [BLOG_CONSTANTS.FILTERS.ALL];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "HUBly Magazine",
        "url": "https://www.hubly-tools.com/blog",
        "description": "Premium AI & SaaS insights, news, and expert tutorials for the modern creator.",
        "publisher": {
            "@type": "Organization",
            "name": "HUBly",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.hubly-tools.com/android-chrome-512x512.png"
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <BlogClient 
                initialPosts={postsRes.data || []}
                initialCategories={initialCategories}
            />
        </>
    );
}
