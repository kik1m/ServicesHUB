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

    // 1. Elite Dynamic SEO Hardening (v3.0)
    useSEO({ 
        title: searchQuery 
            ? `Search "${searchQuery}" AI Categories | HUBly Discovery` 
            : 'Browse Elite AI & SaaS Tool Categories | Find the Best Software',
        description: searchQuery
            ? `Discover specific AI and SaaS categories matching "${searchQuery}". Find specialized tools for your niche.`
            : 'Explore our curated directory of AI and SaaS categories. From LLMs to Productivity, find the perfect tools for your workflow.',
        noindex: !!searchQuery,
        schema: {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Professional AI & SaaS Categories",
            "description": "A comprehensive directory of specialized AI and SaaS software categories.",
            "url": "https://hubly-tools.com/categories"
        }
    });

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
