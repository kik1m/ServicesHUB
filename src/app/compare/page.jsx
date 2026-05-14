import React, { Suspense } from 'react';
import { compareService } from '../../services/compareService';
import { toolsService } from '../../services/toolsService';
import CompareClient from './CompareClient';

// Rule #2: ISR Revalidation
export const revalidate = 3600; // 1 hour

export async function generateMetadata() {
    const title = 'Expert AI & SaaS Tool Comparison | HUBly Side-by-Side';
    const description = 'AI-powered structured comparison engine for software analysis. Compare features, pricing, and performance of leading AI tools side-by-side.';
    const url = 'https://www.hubly-tools.com/compare';

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

export default async function ComparePage() {
    // Parallel Fetching for Elite Performance
    const [recentRes, bannerRes] = await Promise.all([
        compareService.getRecentComparisons(),
        toolsService.getBannerTools(20)
    ]);

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Expert AI & SaaS Tool Comparison | HUBly Side-by-Side",
            "url": "https://www.hubly-tools.com/compare",
            "description": "AI-powered structured comparison engine for software analysis."
        },
        {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "HUBly AI Comparison Engine",
            "applicationCategory": "ComparisonTool",
            "operatingSystem": "Web",
            "description": "Structured AI analysis for comparing SaaS and AI tools using real-time data."
        }
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Suspense fallback={null}>
                <CompareClient 
                    initialRecentComparisons={recentRes.data || []}
                    bannerTools={bannerRes.data || []}
                />
            </Suspense>
        </>
    );
}
