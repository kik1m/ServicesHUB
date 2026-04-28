import React, { useMemo, useCallback } from 'react';
import Safeguard from '../ui/Safeguard';

// Import Atomic Sub-parts (Rule #20 Split)
import CategoryToolsSearch from './CategoryToolsSearch';
import CategoryToolsHeader from './CategoryToolsHeader';
import CategoryToolsGrid from './CategoryToolsGrid';
import CategoryToolsPagination from './CategoryToolsPagination';

import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './CategoryDetailTools.module.css';

/**
 * CategoryDetailTools Component - Elite Gold Standard
 * Rule #16: Section Responsibility (Orchestration only)
 * Rule #29: Pure View with Safeguard protection
 */
const CategoryDetailTools = (props) => {
    const { 
        toolsData,
        toolsHandlers,
        isLoading,
        error
    } = props;

    const {
        tools = [],
        searchQuery = '',
        totalResults = 0,
        categoryName = 'Category',
        hasMore = false,
        loadingMore = false
    } = toolsData || {};

    const {
        setSearchQuery,
        setSort,
        setPrice,
        sortBy,
        setPage,
        refetchTools
    } = toolsHandlers || {};

    const safeTools = useMemo(() => tools?.filter(Boolean) ?? [], [tools]);
    const toolsCount = safeTools.length;

    const handleSearchChange = useCallback((e) => {
        setSearchQuery?.(e.target.value);
    }, [setSearchQuery]);
    
    const handleRetry = useCallback(() => {
        refetchTools?.();
    }, [refetchTools]);
    
    const handleLoadMore = useCallback(() => {
        setPage?.(prev => prev + 1);
    }, [setPage]);

    return (
        <section className={styles.mainSection}>
            {/* 1. Search Block */}
            <CategoryToolsSearch 
                categoryName={categoryName}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                priceFilter={toolsData?.selectedPrice}
                onPriceChange={setPrice}
                sortBy={sortBy}
                onSortChange={setSort}
                isLoading={isLoading}
                error={error}
                onRetry={handleRetry}
            />

            {/* 2. Results Header */}
            <CategoryToolsHeader 
                isLoading={isLoading}
                searchQuery={searchQuery}
                toolsCount={toolsCount}
                totalResults={totalResults}
                error={error}
                onRetry={handleRetry}
            />

            {/* 3. Main Content Grid */}
            <CategoryToolsGrid 
                isLoading={isLoading}
                tools={safeTools}
                categoryName={categoryName}
                error={error}
                onRetry={handleRetry}
            />

            {/* 4. Pagination / Load More */}
            <CategoryToolsPagination 
                hasMore={hasMore}
                toolsCount={toolsCount}
                isLoading={isLoading}
                loadingMore={loadingMore}
                onLoadMore={handleLoadMore}
                error={error}
                onRetry={handleRetry}
            />
        </section>
    );
};

export default CategoryDetailTools;
