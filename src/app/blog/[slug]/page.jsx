import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { blogService } from '../../../services/blogService';
import { toolsService } from '../../../services/toolsService';
import BlogPostClient from './BlogPostClient';

// Rule #2: ISR Revalidation
export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
    try {
        const { data } = await blogService.getPosts({ page: 0, itemsPerPage: 20 });
        if (!data) return [];
        return data.map((post) => ({
            slug: post.slug || post.id.toString(),
        }));
    } catch (e) {
        return [];
    }
}

export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params;
    const { data: post } = await blogService.getPostByIdOrSlug(slug);

    if (!post) {
        return {
            title: 'Article Not Found | HUBly',
            robots: { index: false, follow: false }
        };
    }

    const title = post.seo?.title || `${post.title} - Guide, Tips & Insights | HUBly`;
    const description = post.seo?.description || post.excerpt || post.content?.substring(0, 160);
    const url = `https://www.hubly-tools.com/blog/${post.slug || post.id}`;

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
            images: [{ url: post.featured_image || 'https://www.hubly-tools.com/og-image.png' }],
            type: 'article',
            publishedTime: post.created_at,
            modifiedTime: post.updated_at || post.created_at,
            authors: [post.author_name || 'HUBly Expert'],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [post.featured_image || 'https://www.hubly-tools.com/og-image.png'],
        },
    };
}

// 🚀 ELITE SEO FIX: Streaming JSON-LD Component
// This fetches the post data for SEO but is wrapped in Suspense so it DOES NOT block navigation!
async function JsonLdScript({ slug }) {
    const { data: post } = await blogService.getPostByIdOrSlug(slug);
    if (!post) return null;

    const url = `https://www.hubly-tools.com/blog/${post.slug || post.id}`;
    
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Article",
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": url
            },
            "headline": post.title,
            "image": [post.featured_image],
            "author": {
                "@type": "Person",
                "name": post.author_name || "HUBly Expert",
                "url": `https://www.hubly-tools.com/blog?author=${encodeURIComponent(post.author_name || 'Expert')}`
            },
            "publisher": {
                "@type": "Organization",
                "name": "HUBly",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://www.hubly-tools.com/android-chrome-512x512.png"
                }
            },
            "datePublished": post.created_at,
            "dateModified": post.updated_at || post.created_at,
            "description": post.excerpt || post.content?.substring(0, 160)
        },
        {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hubly-tools.com/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://www.hubly-tools.com/blog" },
                { "@type": "ListItem", "position": 3, "name": post.title, "item": url }
            ]
        }
    ];

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export default async function BlogPostPage(props) {
    const params = await props.params;
    const { slug } = params;

    // Fetch is handled instantly on the client via React Query (Elite Architecture)
    // The SEO metadata is safely handled in generateMetadata above.
    
    return (
        <>
            <Suspense fallback={null}>
                <JsonLdScript slug={slug} />
            </Suspense>
            <BlogPostClient 
                id={slug}
            />
        </>
    );
}
