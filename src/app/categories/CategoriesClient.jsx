'use client';
import React, { useState, useMemo } from 'react';
import { useBannerState } from '../../hooks/useBannerState';
import SmartBanner from '../../components/SmartBanner';
import PageHero from '../../components/ui/PageHero';
import CategoriesGrid from '../../components/Categories/CategoriesGrid';
import CategoriesSuggestCTA from '../../components/Categories/CategoriesSuggestCTA';
import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './Categories.module.css';

/**
 * CategoriesClient - Interactive Layer for Categories Directory
 * Rule #1: Logic Isolation
 */
const CategoriesClient = ({ 
    initialCategories = [], 
    bannerTools = [], 
    initialBannerIndex = 0 
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    // Rule #1: Logic Isolation via custom hook
    const banner = useBannerState(bannerTools, false);

    // Rule #35: Derived Data Stability
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return initialCategories;
        const query = searchQuery.toLowerCase();
        return initialCategories.filter(cat => 
            cat.name.toLowerCase().includes(query)
        );
    }, [initialCategories, searchQuery]);

    return (
        <div className={styles.categoriesPage}>
            <SmartBanner 
                tools={bannerTools}
                currentIndex={banner.currentIndex}
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
                        categories={filteredCategories} 
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />

                    <CategoriesSuggestCTA />
                </div>
            </section>
        </div>
    );
};

export default CategoriesClient;
