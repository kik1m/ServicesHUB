import React, { useMemo, memo, useCallback } from 'react';
import { Search as SearchIcon, Layers } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useSearchEngine } from '../hooks/useSearchEngine';
import { useAiSearch } from '../hooks/useAiSearch';
import { useBannerData } from '../hooks/useBannerData';
import { TOOLS_UI_CONSTANTS } from '../constants/toolsConstants';
import { SEARCH_UI_CONSTANTS } from '../constants/searchConstants';

// Import Global UI Atoms
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';
import SmartBanner from '../components/SmartBanner';
import { useAuth } from '../context/AuthContext';


// Import Unified Search Components
import DirectorySidebar from '../components/Directory/DirectorySidebar';
import DirectoryResults from '../components/Directory/DirectoryResults';
import DirectorySubmitCTA from '../components/Directory/DirectorySubmitCTA';
import AiSearchAssistant from '../components/Directory/AiSearchAssistant';

// Styles
import styles from './Tools.module.css';

/**
 * 🚀 Elite Unified Tools Directory
 * This page replaces both the old Tools and Search pages.
 * It provides a powerful sidebar discovery experience with 3-column tool grid.
 */
const Tools = () => {
    const banner = useBannerData();

    // 1. Hook into the Unified Search Engine
    const {
        isLoading, loadingMore, error, results, hasMore, totalResults, categories,
        searchQuery, setQuery,
        selectedCategory, setCategory,
        selectedPrice, setPrice,
        sortBy, setSort,
        page, setPageNum,
        setFilters,
        refresh,
        displayedCategories, hiddenCount,
        catSearchQuery, setCatSearchQuery,
        showAllCats, setShowAllCats
    } = useSearchEngine({ 
        mode: 'full', 
        syncUrl: true,
        itemsPerPage: 20
    });

    // 1.5. Hook into the AI Semantic Search
    // Use setFilters for a single atomic URL update (prevents race conditions)
    const handleAiFilters = useCallback((filters) => {
        const params = {};
        if (filters.q !== undefined) params.q = filters.q;
        if (filters.category !== undefined) params.category = filters.category;
        if (filters.price !== undefined) params.price = filters.price;
        setFilters(params);
    }, [setFilters]);

    const { user } = useAuth();

    const { processQuery, aiMessage, aiResults, isAiLoading, setAiMessage, error: aiError, setError: setAiError, resetAi } = useAiSearch({ 
        userId: user?.id
    });

    const handleAiReset = useCallback(() => {
        resetAi();
    }, [resetAi]);

    // Debugging Logic (Elite Health Check)
    console.log('[Tools] Results:', results.length, 'Total:', totalResults, 'Loading:', isLoading);

    // 2. Elite Context-Aware SEO (v4.0) - Sitelinks Searchbox Enabled
    const isSearchMode = typeof window !== 'undefined' && window.location.pathname.includes('/search');
    
    useSEO({ 
        pageKey: isSearchMode ? 'search' : 'tools',
        entityId: isSearchMode ? 'search' : 'tools',
        entityType: 'page',
        title: searchQuery 
            ? `"${searchQuery}" AI Tools, SaaS & Software | HUBly Discovery` 
            : isSearchMode 
            ? "Search AI Tools & Software | HUBly Explorer"
            : "AI & SaaS Tools Directory | Elite Discovery Hub",
        description: isSearchMode && searchQuery
            ? `Explore the most relevant AI and SaaS tools matching your search for "${searchQuery}".`
            : "Access our curated directory of premium AI and SaaS tools. Filter by category, pricing, and ratings to find your next favorite software.",
        noindex: isSearchMode ? true : false, // Rule #34: Prevent indexing of search permutations only
        ogType: 'website',
        prev: page > 0 ? `/tools?page=${page}` : null,
        next: hasMore ? `/tools?page=${page + 2}` : null,
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "HUBly",
                "url": "https://hubly-tools.com",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://hubly-tools.com/search?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                }
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "AI Tools",
                        "item": "https://hubly-tools.com/tools"
                    }
                ]
            },
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": isSearchMode ? "AI Tool Search Results" : "HUBly AI & SaaS Directory",
                "description": "Discover and compare the world's best AI and SaaS software.",
                "url": isSearchMode ? "https://hubly-tools.com/search" : "https://hubly-tools.com/tools"
            }
        ]
    });

    const categoryFilter = { selectedCategory, setSelectedCategory: setCategory };
    const pricingFilter = { pricingModels: TOOLS_UI_CONSTANTS.filters.pricing, selectedPrice, setSelectedPrice: setPrice };

    return (
        <div className={styles.toolsDirectoryPage}>
            {/* Top Banner Discovery */}
            <SmartBanner 
                tools={banner.tools}
                isLoading={banner.loading}
                error={banner.error}
                next={banner.next}
                prev={banner.prev}
                currentIndex={banner.currentIndex}
            />
            
            <PageHero 
                title={TOOLS_UI_CONSTANTS.hero.title}
                highlight={TOOLS_UI_CONSTANTS.hero.highlight}
                subtitle={TOOLS_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={TOOLS_UI_CONSTANTS.hero.breadcrumbs}
                icon={<Layers size={24} />}
            />

            <div className={styles.searchContainer}>
                <Safeguard error={error} onRetry={refresh} fullPage title="Discovery Engine Offline">
                    <div className={styles.searchGridLayout}>
                        {/* 1. Powerful Side Filtering */}
                        <DirectorySidebar 
                            categoryFilter={categoryFilter}
                            pricingFilter={pricingFilter}
                            isLoading={isLoading && categories.length === 0}
                            error={error}
                            refetch={refresh}
                            content={SEARCH_UI_CONSTANTS.sidebar}
                            displayedCategories={displayedCategories}
                            hiddenCount={hiddenCount}
                            catSearchQuery={catSearchQuery}
                            setCatSearchQuery={setCatSearchQuery}
                            showAllCats={showAllCats}
                            setShowAllCats={setShowAllCats}
                        />

                        {/* 2. Main Results Column */}
                        <div className={styles.resultsColumn}>
                            {/* Unified Smart Search Bar */}
                            <div className={styles.searchHeaderWrapper}>
                                <AiSearchAssistant 
                                    standardQuery={searchQuery}
                                    setStandardQuery={setQuery}
                                    onProcess={processQuery} 
                                    onReset={handleAiReset}
                                    message={aiMessage || aiError} 
                                    isThinking={isAiLoading}
                                />
                            </div>

                            <DirectoryResults 
                                results={aiResults !== null ? aiResults : results}
                                totalResults={aiResults !== null ? aiResults.length : totalResults}
                                isLoading={isAiLoading || isLoading}
                                loadingMore={loadingMore}
                                hasMore={aiResults ? false : hasMore}
                                setPage={setPageNum}
                                sortBy={sortBy}
                                setSortBy={setSort}
                                error={error}
                                refetch={refresh}
                                content={SEARCH_UI_CONSTANTS.results}
                                onClearFilters={handleAiReset}
                            />
                        </div>
                    </div>
                </Safeguard>
            </div>

            {/* Bottom Community CTA */}
            <div className={styles.bottomCtaSection}>
                <DirectorySubmitCTA content={TOOLS_UI_CONSTANTS.cta} />
            </div>
        </div>
    );
};

export default memo(Tools);
