import React, { useMemo, memo } from 'react';
import { Search as SearchIcon, Layers } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useSearchEngine } from '../hooks/useSearchEngine';
import { useBannerData } from '../hooks/useBannerData';
import { TOOLS_UI_CONSTANTS } from '../constants/toolsConstants';

// Import Global UI Atoms
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';
import SmartBanner from '../components/SmartBanner';
import Input from '../components/ui/Input';

// Import Modular Components
import ToolsFilterBar from '../components/Tools/ToolsFilterBar';
import ToolsGrid from '../components/Tools/ToolsGrid';
import ToolsSubmitCTA from '../components/Tools/ToolsSubmitCTA';

// Styles
import styles from './Tools.module.css';

/**
 * Tools Directory - Elite 10/10 Orchestrator
 * Rule #16: Pure Orchestration via useSearchEngine
 * Rule #19: Atomic Component Standardization
 */
const Tools = () => {
    const banner = useBannerData();

    // 1. Hook into the Unified Search Engine (Directory Mode)
    const {
        isLoading, loadingMore, error, results, hasMore, totalResults, formattedTotalResults, categories,
        searchQuery, setQuery,
        selectedCategory, setCategory,
        selectedPrice, setPrice,
        sortBy, setSort,
        page, setPageNum,
        refresh
    } = useSearchEngine({ 
        mode: 'lite', // Directory mode
        syncUrl: true,
        itemsPerPage: 20
    });

    // 2. SEO Hardening (v2.0)
    useSEO({ pageKey: 'tools' });

    return (
        <div className={styles.toolsDirectoryPage}>
            <SmartBanner 
                tools={banner.tools}
                isLoading={banner.loading}
                error={banner.error}
                next={banner.next}
                prev={banner.prev}
                currentIndex={banner.currentIndex}
            />
            
            {/* Zero-Shift Hero Rendering */}
            <PageHero 
                title={TOOLS_UI_CONSTANTS.hero.title}
                highlight={TOOLS_UI_CONSTANTS.hero.highlight}
                subtitle={TOOLS_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={TOOLS_UI_CONSTANTS.hero.breadcrumbs}
                icon={<Layers size={24} />}
            />

            <main className={styles.mainContainer}>
                <Safeguard 
                    error={error} 
                    onRetry={refresh} 
                    fullPage 
                    title="Directory Sync Failed"
                >
                    <div className={styles.contentLayout}>
                        {/* Search Bar - Integrated Pattern (Rule #13: Use Unified Input) */}
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchInner}>
                                <Input 
                                    type="text"
                                    placeholder={TOOLS_UI_CONSTANTS.filters.placeholder}
                                    value={searchQuery}
                                    onChange={(e) => setQuery(e.target.value)}
                                    icon={SearchIcon}
                                    className={styles.toolsMainInput}
                                />
                                {totalResults > 0 && (
                                    <div className={styles.resultsBadge}>
                                        {formattedTotalResults} Tools
                                    </div>
                                )}
                            </div>
                        </div>

                        <ToolsFilterBar 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setCategory}
                            priceFilter={selectedPrice}
                            setPriceFilter={setPrice}
                            sortBy={sortBy}
                            setSortBy={setSort}
                            isLoading={isLoading && categories.length === 0}
                            content={TOOLS_UI_CONSTANTS.filters}
                        />

                        <ToolsGrid 
                            tools={results}
                            isLoading={isLoading}
                            loadingMore={loadingMore}
                            hasMore={hasMore}
                            setPage={setPageNum}
                            refresh={refresh}
                            emptyMessage={TOOLS_UI_CONSTANTS.empty}
                        />

                        <ToolsSubmitCTA content={TOOLS_UI_CONSTANTS.cta} />
                    </div>
                </Safeguard>
            </main>
        </div>
    );
};

export default memo(Tools);
