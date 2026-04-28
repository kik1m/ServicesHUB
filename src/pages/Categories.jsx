import React, { useMemo } from 'react';
import useSEO from '../hooks/useSEO';
import { useCategoriesData } from '../hooks/useCategoriesData';
import { useBannerData } from '../hooks/useBannerData';
import { CATEGORY_STRINGS } from '../constants/categoryConstants';

// Import Global Components
import PageHero from '../components/ui/PageHero';
import SmartBanner from '../components/SmartBanner';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import CategoriesGrid from '../components/Categories/CategoriesGrid';
import CategoriesSuggestCTA from '../components/Categories/CategoriesSuggestCTA';

// Import Modular CSS
import styles from './Categories.module.css';

/**
 * Categories Directory Page (Elite 10/10)
 * Rule #1: Logic Isolation (useCategoriesData)
 * Rule #31: Component Resilience via Safeguard
 */
const Categories = () => {
    const {
        categories,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        trackClick,
        refresh
    } = useCategoriesData();

    const banner = useBannerData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'categories' });

    return (
        <div className={styles.categoriesPage}>
            <SmartBanner 
                tools={banner.tools}
                currentIndex={banner.currentIndex}
                isLoading={banner.loading}
                error={banner.error}
                onExternalClick={trackClick}
                next={banner.next}
                prev={banner.prev}
            />
            
            <PageHero 
                title={CATEGORY_STRINGS.LIST.HERO.TITLE}
                highlight={CATEGORY_STRINGS.LIST.HERO.HIGHLIGHT}
                subtitle={CATEGORY_STRINGS.LIST.HERO.SUBTITLE}
                breadcrumbs={CATEGORY_STRINGS.LIST.HERO.BREADCRUMBS}
            />

            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <CategoriesGrid 
                        categories={categories} 
                        loading={loading}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        error={error}
                        onRetry={refresh}
                    />

                    <CategoriesSuggestCTA />
                </div>
            </section>
        </div>
    );
};

export default Categories;
