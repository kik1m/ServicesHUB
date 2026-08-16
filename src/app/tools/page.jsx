import React, { Suspense } from 'react';
import ToolsClient from './ToolsClient';
import { toolsService } from '../../services/toolsService';
import { TOOLS_UI_CONSTANTS } from '../../constants/toolsConstants';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { queryOptions } from '../../lib/queryOptions';

import { seoService } from '../../services/seoService';
import { SEO_CONFIG } from '../../constants/seoManifest';

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateMetadata(props) {
    const searchParams = await props.searchParams;
    const searchQuery = searchParams?.q || '';
    const isTextSearch = !!searchQuery;

    const dynamicSeo = await seoService.getMetadata(SEO_CONFIG.global.pageIds.tools, 'page');
    const staticSeo  = SEO_CONFIG.pages.tools;

    const stats = await toolsService.getToolsStats();
    const toolsCount = stats.count || 85;

    const baseTitle = (dynamicSeo?.title || staticSeo.title).replace('500+', `${toolsCount}+`);
    const baseDescription = (dynamicSeo?.description || staticSeo.description).replace('500+', `${toolsCount}+`);

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
    const queryClient = new QueryClient();

    // 🚀 Elite SEO: Prefetch the initial page of tools on the server
    await queryClient.prefetchInfiniteQuery({
        ...queryOptions.toolsSearch({
            searchQuery: '',
            selectedCategory: 'All',
            selectedCategoryId: null,
            selectedPrice: 'All',
            sortBy: 'featured',
            itemsPerPage: 20,
            queryCategories: [{ id: 'All', name: 'All' }]
        }),
        initialPageParam: 0
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={null}>
                <ToolsClient />
            </Suspense>
        </HydrationBoundary>
    );
}
