import React, { useMemo, memo } from 'react';
import useSEO from '../hooks/useSEO';
import { useSearchEngine } from '../hooks/useSearchEngine';
import { SEARCH_UI_CONSTANTS } from '../constants/searchConstants';

// Import Modular Components
import SearchHeader from '../components/Search/SearchHeader';
import SearchSidebar from '../components/Search/SearchSidebar';
import SearchResults from '../components/Search/SearchResults';
import Safeguard from '../components/ui/Safeguard';

// Styles
import styles from './Search.module.css';

/**
 * Search Page - Elite Gold Standard (Powered by Unified Search Engine)
 * Rule #16: Pure Orchestration Layer
 * Rule #31: Component Resilience via Safeguard
 */
const Search = () => {
    // 1. Hook into the Unified Search Engine (Full Mode)
    const {
        isLoading, loadingMore, error, results, hasMore, categories, pricingModels,
        searchQuery, setQuery,
        selectedCategory, setCategory,
        selectedPrice, setPrice,
        sortBy, setSort,
        setPageNum,
        refresh,
        displayedCategories,
        hiddenCount,
        catSearchQuery,
        setCatSearchQuery,
        showAllCats,
        setShowAllCats
    } = useSearchEngine({ 
        mode: 'full', 
        syncUrl: true,
        itemsPerPage: 20
    });

    // 2. SEO Hardening (v2.0)
    useSEO({
        pageKey: 'search',
        title: searchQuery ? `Results for "${searchQuery}"` : undefined,
    });

    // 3. Data Grouping for Children
    const categoryFilter = useMemo(() => ({
        selectedCategory,
        setSelectedCategory: setCategory,
        filteredCategories: categories
    }), [selectedCategory, setCategory, categories]);

    const pricingFilter = useMemo(() => ({
        pricingModels,
        selectedPrice,
        setSelectedPrice: setPrice
    }), [pricingModels, selectedPrice, setPrice]);

    return (
        <div className={styles.searchPage}>
            <div className={styles.searchContainer}>
                <SearchHeader 
                    searchQuery={searchQuery} 
                    setSearchQuery={setQuery} 
                    isLoading={isLoading}
                    content={SEARCH_UI_CONSTANTS.header}
                />

                <Safeguard error={error} onRetry={refresh} fullPage title="Search Engine Offline">
                    <div className={styles.searchGridLayout}>
                        <SearchSidebar 
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

                        <SearchResults 
                            results={results}
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
                </Safeguard>
            </div>
        </div>
    );
};

export default memo(Search);
