import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { compareService } from '../../../services/compareService';
import { toolsService } from '../../../services/toolsService';
import CompareClient from '../CompareClient';

// Rule #2: ISR Revalidation
export const revalidate = 3600; // 1 hour

export async function generateMetadata(props) {
    const params = await props.params;
    const { slug } = params;
    if (!slug || !slug.includes('-vs-')) return { title: 'Compare AI Tools | HUBly' };

    const [s1, s2] = slug.split('-vs-');
    
    // Fetch tool names for metadata
    const [t1Res, t2Res] = await Promise.all([
        compareService.getToolBySlug(s1),
        compareService.getToolBySlug(s2)
    ]);

    const tool1 = t1Res.data;
    const tool2 = t2Res.data;

    if (!tool1 || !tool2) {
        return {
            title: 'Comparison Not Found | HUBly',
            robots: { index: false, follow: false }
        };
    }

    const title = `${tool1.name} vs ${tool2.name} - Expert AI Comparison & Pricing | HUBly`;
    const description = `Side-by-side analysis of ${tool1.name} and ${tool2.name}. Explore features, pricing plans, and an AI-powered technical verdict to find the best tool for your workflow.`;
    const url = `https://www.hubly-tools.com/compare/${slug}`;

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
            images: [{ url: tool1.image_url || 'https://www.hubly-tools.com/og-image.png' }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [tool1.image_url || 'https://www.hubly-tools.com/og-image.png'],
        },
    };
}

export default async function ComparisonDetailPage(props) {
    const params = await props.params;
    const { slug } = params;
    if (!slug || !slug.includes('-vs-')) {
        notFound();
    }

    const [s1, s2] = slug.split('-vs-');

    // Parallel Fetching for Elite Performance
    const [t1Res, t2Res, recentRes, bannerRes] = await Promise.all([
        compareService.getToolBySlug(s1),
        compareService.getToolBySlug(s2),
        compareService.getRecentComparisons(),
        toolsService.getBannerTools(20)
    ]);

    const tool1 = t1Res.data;
    const tool2 = t2Res.data;

    if (!tool1 || !tool2) {
        notFound();
    }

    // Try to fetch cached AI result for server-side hydration (Elite SEO benefit)
    const { data: cachedComp } = await compareService.getCachedComparison(tool1.id, tool2.id);
    
    const url = `https://www.hubly-tools.com/compare/${slug}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": `${tool1.name} vs ${tool2.name} Comparison`,
        "url": url,
        "description": `Detailed side-by-side comparison between ${tool1.name} and ${tool2.name}.`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={null}>
                <CompareClient 
                    initialTool1={tool1}
                    initialTool2={tool2}
                    initialRecentComparisons={recentRes.data || []}
                    bannerTools={bannerRes.data || []}
                    initialAiResults={cachedComp}
                />
            </Suspense>
        </>
    );
}
