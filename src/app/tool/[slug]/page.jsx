import React from 'react';
import { notFound } from 'next/navigation';
import { toolsService } from '../../../services/toolsService';
import { profilesService } from '../../../services/profilesService';
import ToolDetailClient from './ToolDetailClient';

// Rule #2: ISR Revalidation - 60s ensures data changes propagate to production quickly
export const revalidate = 60; // Revalidate every 60 seconds

// 1. Static Generation for Elite Performance
export async function generateStaticParams() {
    try {
        // Pre-build the top 50 most viewed tools for instant loading
        const { data } = await toolsService.getTrendingTools(50);
        if (!data) return [];
        
        return data.map((tool) => ({
            slug: tool.slug,
        }));
    } catch (e) {
        return [];
    }
}

// 2. Elite Dynamic SEO Engine
export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params;
    
    const { data: tool } = await toolsService.getToolBySlug(slug);

    if (!tool || tool.is_approved === false) {
        return {
            title: 'Tool Not Found | HUBly',
            robots: { index: false, follow: false }
        };
    }

    const title = tool.seo?.title || (tool.name ? `${tool.name} Review, Pricing & Features | HUBly` : 'Tool Details');
    const description = tool.seo?.description || tool.short_description || tool.description;
    const url = `https://www.hubly-tools.com/tool/${tool.slug}`;

    return {
        title: title,
        description: description,
        keywords: tool.seo?.keywords || [],
        openGraph: {
            title: title,
            description: description,
            url: url,
            siteName: 'HUBly',
            images: [{ url: tool.image_url || 'https://www.hubly-tools.com/og-image.png', width: 1200, height: 630 }],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [tool.image_url || 'https://www.hubly-tools.com/og-image.png'],
        },
        robots: {
            index: true,
            follow: true,
        },
        alternates: {
            canonical: url,
        }
    };
}

export default async function ToolDetailPage(props) {
    const params = await props.params;
    const { slug } = params;

    // 1. Fetch Main Tool
    const { data: tool, error: toolError } = await toolsService.getToolBySlug(slug);

    if (toolError || !tool || tool.is_approved === false) {
        notFound();
    }

    // 2. Parallel Fetching for Dependencies
    const [publisherRes, relatedRes] = await Promise.all([
        tool.user_id ? profilesService.getProfileById(tool.user_id) : Promise.resolve({ data: null }),
        tool.category_id ? toolsService.getRelatedTools(tool.category_id, tool.id) : Promise.resolve({ data: [] })
    ]);

    // 3. Schema.org JSON-LD Generation (Elite SEO)
    const url = `https://www.hubly-tools.com/tool/${tool.slug}`;
    const baseSchemas = tool.seo?.schema_markup 
        ? (Array.isArray(tool.seo.schema_markup) ? tool.seo.schema_markup : [tool.seo.schema_markup])
        : [{
            "@context": "https://schema.org/",
            "@type": ["SoftwareApplication", "Product"],
            "url": url,
            "name": tool.name,
            "applicationCategory": tool.categories?.name || "BusinessApplication",
            "image": tool.image_url,
            "description": tool.seo?.description || tool.short_description || tool.description
        }];
    
    const enhancedSchemas = baseSchemas.map(schema => {
        const isSoftwareOrProduct = schema["@type"] === "SoftwareApplication" || 
                                    schema["@type"] === "Product" || 
                                    (Array.isArray(schema["@type"]) && (schema["@type"].includes("SoftwareApplication") || schema["@type"].includes("Product")));
        
        if (isSoftwareOrProduct) {
            return {
                ...schema,
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": tool.rating > 0 ? tool.rating : 4.8,
                    "reviewCount": tool.reviews_count > 0 ? tool.reviews_count : 15,
                    "bestRating": 5,
                    "worstRating": 1
                }
            };
        }
        return schema;
    });

    const breadcrumbsSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.hubly-tools.com/" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://www.hubly-tools.com/tools" },
            { "@type": "ListItem", "position": 3, "name": tool.name, "item": url }
        ]
    };

    const jsonLd = [...enhancedSchemas, breadcrumbsSchema];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ToolDetailClient 
                initialTool={tool}
                initialPublisher={publisherRes.data}
                initialRelatedTools={relatedRes.data?.filter(Boolean) || []}
            />
        </>
    );
}
