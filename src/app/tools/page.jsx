import React, { Suspense } from 'react';
import ToolsClient from './ToolsClient';
import { toolsService } from '../../services/toolsService';
import { TOOLS_UI_CONSTANTS } from '../../constants/toolsConstants';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateMetadata(props) {
    const searchParams = await props.searchParams;
    const searchQuery = searchParams?.q || '';
    const isTextSearch = !!searchQuery;

    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.tools, 'page');
    const staticSeo  = SEO_CONFIG.pages.tools;

    const baseTitle       = dynamicSeo?.title       || staticSeo.title;
    const baseDescription = dynamicSeo?.description || staticSeo.description;

    return {
        title: isTextSearch
            ? `"${searchQuery}" — AI & SaaS Tools Search | HUBly`
            : baseTitle,
        description: isTextSearch
            ? `Explore the most relevant AI and SaaS tools matching your search for "${searchQuery}" on HUBly.`
            : baseDescription,
        keywords: staticSeo.keywords,
        robots: {
            index: !isTextSearch,
            follow: true,
        },
        openGraph: {
            title: baseTitle,
            description: baseDescription,
            url: 'https://www.hubly-tools.com/tools',
            siteName: SEO_CONFIG.global.siteName,
            images: [{
                url: SEO_CONFIG.global.defaultImage,
                width: 512,
                height: 512,
                alt: 'HUBly AI & SaaS Tools Directory',
            }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: baseTitle,
            description: baseDescription,
            images: [SEO_CONFIG.global.defaultImage],
        },
    };
}

export default async function ToolsPage() {
    // We no longer block the route transition with an SSR fetch here.
    // The banner tools will be fetched on the client side to ensure 
    // an instantaneous, skeleton-first navigation experience.

    // We pass banner tools down. The actual search results are managed 
    // by useSearchEngine on the client to preserve the dynamic interactive experience.
    
    return (
        <Suspense fallback={null}>
            <ToolsClient />
        </Suspense>
    );
}
