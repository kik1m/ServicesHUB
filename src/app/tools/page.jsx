import React, { Suspense } from 'react';
import ToolsClient from './ToolsClient';
import { toolsService } from '../../services/toolsService';
import { TOOLS_UI_CONSTANTS } from '../../constants/toolsConstants';

export const revalidate = 3600; // ISR: Revalidate every hour

export async function generateMetadata(props) {
    const searchParams = await props.searchParams;
    const searchQuery = searchParams?.q || '';
    const isTextSearch = !!searchQuery;

    return {
        title: isTextSearch 
            ? `"${searchQuery}" AI Tools, SaaS & Software | HUBly Discovery` 
            : "AI & SaaS Tools Directory | Elite Discovery Hub",
        description: isTextSearch
            ? `Explore the most relevant AI and SaaS tools matching your search for "${searchQuery}".`
            : "Access our curated directory of premium AI and SaaS tools. Filter by category, pricing, and ratings to find your next favorite software.",
        robots: {
            index: !isTextSearch, // Only block indexing for open-ended text searches; allow categories
            follow: true,
        },
        openGraph: {
            title: "HUBly AI & SaaS Directory",
            description: "Discover and compare the world's best AI and SaaS software.",
            url: "https://www.hubly-tools.com/tools",
            siteName: "HUBly",
            images: [
                {
                    url: 'https://www.hubly-tools.com/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: "HUBly AI & SaaS Directory",
                }
            ],
            type: 'website',
        }
    };
}

export default async function ToolsPage() {
    // 1. Fetch initial tools for SSR (Page 1) and banner tools concurrently
    const [bannerRes] = await Promise.all([
        toolsService.getBannerTools(20)
    ]);

    // We pass banner tools down. The actual search results are managed 
    // by useSearchEngine on the client to preserve the dynamic interactive experience.
    
    return (
        <Suspense fallback={null}>
            <ToolsClient 
                bannerTools={bannerRes.data || []}
            />
        </Suspense>
    );
}
