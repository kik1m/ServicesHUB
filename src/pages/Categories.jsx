import React from 'react';
import useSEO from '../hooks/useSEO';
import { useCategoriesData } from '../hooks/useCategoriesData';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import CategoriesHeader from '../components/Categories/CategoriesHeader';
import CategoriesGrid from '../components/Categories/CategoriesGrid';
import CategoriesSuggestCTA from '../components/Categories/CategoriesSuggestCTA';

// Import Modular CSS
import styles from './Categories.module.css';

const Categories = () => {
    const {
        categories,
        counts,
        searchQuery,
        setSearchQuery,
        loading
    } = useCategoriesData();

    useSEO({
        title: 'Browse Tools by Category | HUBly',
        description: 'Explore our curated directory of best tools organized by category. Find the right software for your needs on HUBly.',
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    return (
        <div className={`page-wrapper ${styles.categoriesPage}`}>
            <SmartBanner />
            
            <CategoriesHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className={styles.mainSection}>
                <CategoriesGrid 
                    categories={categories} 
                    counts={counts} 
                    loading={loading} 
                />

                <CategoriesSuggestCTA />
            </section>
        </div>
    );
};

export default Categories;
