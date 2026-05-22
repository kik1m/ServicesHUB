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
    
    // Data is fetched strictly on the client using React Query to ensure 
    // an instantaneous route transition and display of component-specific Skeletons.

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
            <BlogClient />
        </>
    );
}
