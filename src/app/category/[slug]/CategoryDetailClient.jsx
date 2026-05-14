'use client';
import React, { useMemo, memo } from 'react';
import { useSearchEngine } from '../../../hooks/useSearchEngine';
import { useBannerState } from '../../../hooks/useBannerState';
import { getIcon } from '../../../utils/iconMap.jsx';
import { CATEGORY_STRINGS } from '../../../constants/categoryConstants';
import PageHero from '../../../components/ui/PageHero';
import SmartBanner from '../../../components/SmartBanner';
import CategoryDetailTools from '../../../components/CategoryDetail/CategoryDetailTools';
import styles from './CategoryDetail.module.css';

/**
 * CategoryDetailClient - Elite Orchestrator for Category Detail
 */
const CategoryDetailClient = ({ category, bannerTools }) => {
    // Rule #1: Logic Isolation via custom hook
    const banner = useBannerState(bannerTools, false);

    // 1. Hook into Unified Search Engine
    const {
        isLoading: isToolsLoading, 
        loadingMore, 
        error: toolsError, 
        results: tools, 
        hasMore, 
        totalResults,
        searchQuery,
        setQuery,
        selectedPrice,
        setPrice,
        sortBy,
        setSort,
        setPageNum,
        refresh: refetchTools
    } = useSearchEngine({ 
        mode: 'category', 
        fixedCategory: category?.name || 'All',
        syncUrl: true,
        itemsPerPage: 20
    });

    const breadcrumbs = useMemo(() => [
        CATEGORY_STRINGS.HEADER.BREADCRUMBS.ROOT,
        { label: category?.name || 'Category' }
    ], [category?.name]);

    const IconComponent = useMemo(() => {
        if (!category?.icon_name) return null;
        return getIcon(category.icon_name, 32);
    }, [category?.icon_name]);

    const toolsData = {
        tools,
        searchQuery,
        totalResults,
        selectedPrice,
        categoryName: category?.name,
        hasMore,
        loadingMore
    };

    const toolsHandlers = {
        setSearchQuery: setQuery,
        setSort,
        setPrice,
        sortBy,
        setPage: setPageNum,
        refetchTools
    };

    return (
        <div className={styles.categoryDetailPage}>
            <SmartBanner 
                tools={bannerTools}
                currentIndex={banner.currentIndex}
                next={banner.next}
                prev={banner.prev}
                isLoading={false}
            />

            <PageHero 
                title={category?.name || 'Category'}
                highlight={CATEGORY_STRINGS?.TOOLS?.SECTION_TITLE_ACCENT}
                subtitle={category?.description}
                breadcrumbs={breadcrumbs}
                icon={IconComponent}
                badge={`${totalResults || 0} ${CATEGORY_STRINGS?.LIST?.CARD?.TOOLS}`}
                isLoading={false}
            />

            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <CategoryDetailTools 
                        toolsData={toolsData}
                        toolsHandlers={toolsHandlers}
                        isLoading={isToolsLoading}
                        error={toolsError}
                    />
                </div>
            </main>
        </div>
    );
};

export default memo(CategoryDetailClient);
