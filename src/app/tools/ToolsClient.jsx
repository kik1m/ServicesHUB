'use client';
import React, { useCallback, memo } from 'react';
import { Search as SearchIcon, Layers } from 'lucide-react';
import { useSearchEngine } from '../../hooks/useSearchEngine';
import { useAiSearch } from '../../hooks/useAiSearch';
import { useBannerState } from '../../hooks/useBannerState';
import { TOOLS_UI_CONSTANTS } from '../../constants/toolsConstants';
import { SEARCH_UI_CONSTANTS } from '../../constants/searchConstants';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../../lib/queryOptions';

// Import Global UI Atoms
import PageHero from '../../components/ui/PageHero';
import Safeguard from '../../components/ui/Safeguard';
import SmartBanner from '../../components/SmartBanner';

// Import Unified Search Components
import DirectorySidebar from '../../components/Directory/DirectorySidebar';
import DirectoryResults from '../../components/Directory/DirectoryResults';
import DirectorySubmitCTA from '../../components/Directory/DirectorySubmitCTA';
import AiSearchAssistant from '../../components/Directory/AiSearchAssistant';
import DirectoryFilterToggle from '../../components/Directory/DirectoryFilterToggle.jsx';

// Styles
import styles from './Tools.module.css';

/**
 * 🚀 Elite Unified Tools Directory (Client Component)
 * Rule #1: Logic Isolation
 * Rule #31: Component Resilience via Safeguard
 */
const ToolsClient = () => {
    // 1. Fetch Banner Tools purely on the client so we don't block SSR navigation
    const { data: bannerTools = [], isLoading: isBannerLoading } = useQuery(queryOptions.bannerTools(20));

    // Isolated banner state manager
    const banner = useBannerState(bannerTools, isBannerLoading);

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
        showAllCats, setShowAllCats,
        isMobileFiltersOpen, setIsMobileFiltersOpen
    } = useSearchEngine({
        mode: 'full',
        syncUrl: true,
        itemsPerPage: 20
    });

    // 1.5. Hook into the AI Semantic Search
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

    const categoryFilter = { selectedCategory, setSelectedCategory: setCategory };
    const pricingFilter = { pricingModels: TOOLS_UI_CONSTANTS.filters.pricing, selectedPrice, setSelectedPrice: setPrice };

    return (
        <div className={styles.toolsDirectoryPage}>
            {/* Top Banner Discovery */}
            <SmartBanner
                tools={bannerTools}
                currentIndex={banner.currentIndex}
                next={banner.next}
                prev={banner.prev}
                isLoading={isBannerLoading}
            />

            <PageHero
                title={TOOLS_UI_CONSTANTS.hero.title}
                highlight={TOOLS_UI_CONSTANTS.hero.highlight}
                subtitle={TOOLS_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={TOOLS_UI_CONSTANTS.hero.breadcrumbs}
                icon={<Layers size={24} />}
                isLoading={false}
            />

            <div className={styles.searchContainer}>
                <Safeguard error={error} onRetry={refresh} fullPage title="Discovery Engine Offline">
                    <div className={styles.searchGridLayout}>
                        {/* 1. Side Filtering (Desktop: Sticky | Mobile: Drawer) */}
                        <DirectoryFilterToggle onClick={() => setIsMobileFiltersOpen(true)} />
                        
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
                            isOpen={isMobileFiltersOpen}
                            onClose={() => setIsMobileFiltersOpen(false)}
                            sortBy={sortBy}
                            setSortBy={setSort}
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
                                pricingFilter={pricingFilter}
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

export default memo(ToolsClient);
