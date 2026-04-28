import React, { useMemo, memo } from 'react';
import { useParams } from 'react-router-dom';
import { useCategoryDetailData } from '../hooks/useCategoryDetailData';
import { useSearchEngine } from '../hooks/useSearchEngine';
import { useBannerData } from '../hooks/useBannerData';
import { getIcon } from '../utils/iconMap.jsx';
import { CATEGORY_STRINGS } from '../constants/categoryConstants';

// Import Global UI Components
import useSEO from '../hooks/useSEO';
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import CategoryDetailTools from '../components/CategoryDetail/CategoryDetailTools';

// Styles
import styles from './CategoryDetail.module.css';

/**
 * CategoryDetail - Elite 10/10 Orchestrator
 * Rule #16: Multi-Hook Orchestration (Metadata + Unified Engine)
 * Rule #31: Component Resilience via Safeguard
 */
const CategoryDetail = () => {
    const { id: slug } = useParams();
    
    // 1. Fetch Category Metadata
    const { 
        category, 
        isCategoryLoading, 
        categoryError, 
        refetchCategory,
        trackClick 
    } = useCategoryDetailData(slug);

    // 2. Hook into Unified Search Engine
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

    const banner = useBannerData();

    // 3. SEO Hardening
    useSEO({
        title: category?.name ? `${category.name} Tools` : 'Browse Categories',
        description: category?.description || 'Explore the best tools in this category.',
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
                tools={banner.tools}
                isLoading={banner.loading}
                error={banner.error}
                onExternalClick={trackClick}
            />

            <PageHero 
                title={category?.name || 'Category'}
                highlight={CATEGORY_STRINGS?.TOOLS?.SECTION_TITLE_ACCENT}
                subtitle={category?.description}
                breadcrumbs={breadcrumbs}
                icon={IconComponent}
                badge={!isCategoryLoading && totalResults > 0 ? `${totalResults} ${CATEGORY_STRINGS?.LIST?.CARD?.TOOLS}` : null}
                isLoading={isCategoryLoading}
                error={categoryError}
                onRetry={refetchCategory}
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

export default memo(CategoryDetail);
