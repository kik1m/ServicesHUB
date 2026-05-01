import React, { useMemo, memo } from 'react';
import { Search as SearchIcon, Layers } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useSearchEngine } from '../hooks/useSearchEngine';
import { useBannerData } from '../hooks/useBannerData';
import { TOOLS_UI_CONSTANTS } from '../constants/toolsConstants';
import { SEARCH_UI_CONSTANTS } from '../constants/searchConstants';

// Import Global UI Atoms
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';
import SmartBanner from '../components/SmartBanner';
import Input from '../components/ui/Input';

// Import Unified Search Components
import DirectorySidebar from '../components/Directory/DirectorySidebar';
import DirectoryResults from '../components/Directory/DirectoryResults';
import DirectorySubmitCTA from '../components/Directory/DirectorySubmitCTA';

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
        refresh,
        displayedCategories, hiddenCount,
        catSearchQuery, setCatSearchQuery,
        showAllCats, setShowAllCats
    } = useSearchEngine({ 
        mode: 'full', 
        syncUrl: true,
        itemsPerPage: 20
    });

    // Debugging Logic (Elite Health Check)
    console.log('[Tools] Results:', results.length, 'Total:', totalResults, 'Loading:', isLoading);

    // 2. SEO Hardening
    useSEO({ pageKey: 'tools' });

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
                            {/* Unified Search Input */}
                            <div className={styles.searchHeaderWrapper}>
                                <Input 
                                    placeholder={TOOLS_UI_CONSTANTS.filters.placeholder}
                                    icon={SearchIcon}
                                    value={searchQuery}
                                    onChange={(e) => setQuery(e.target.value)}
                                    variant="ghost"
                                />
                            </div>

                            <DirectoryResults 
                                results={results}
                                totalResults={totalResults}
                                isLoading={isLoading}
                                loadingMore={loadingMore}
                                hasMore={hasMore}
                                setPage={setPageNum}
                                sortBy={sortBy}
                                setSortBy={setSort}
                                error={error}
                                refetch={refresh}
                                content={SEARCH_UI_CONSTANTS.results}
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
