import React from 'react';
import { useParams } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useCategoryDetailData } from '../hooks/useCategoryDetailData';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import CategoryDetailHeader from '../components/CategoryDetail/CategoryDetailHeader';
import CategoryDetailTools from '../components/CategoryDetail/CategoryDetailTools';
import CategoryDetailEmpty from '../components/CategoryDetail/CategoryDetailEmpty';

// Import Modular CSS
import styles from './CategoryDetail.module.css';

const CategoryDetail = () => {
    const { id: slug } = useParams();
    const {
        category,
        tools,
        filteredTools,
        totalResults,
        searchQuery,
        setSearchQuery,
        loading,
        loadingMore,
        hasMore,
        setPage,
        page
    } = useCategoryDetailData(slug);

    useSEO({
        title: category?.name ? `Best ${category.name} Tools` : 'Category Details',
        description: `Explore the best curated ${category?.name || 'various'} tools on HUBly. Discover top-rated software for your needs.`,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (loading && page === 0) {
        return (
            <div className={`page-wrapper ${styles.categoryDetailPage}`}>
                <header className={`page-header hero-section-slim ${styles.loadingHero}`}>
                    <div className="hero-content">
                        {/* Skeleton handled in parent for smooth transition */}
                        <div style={{ height: '400px' }}></div>
                    </div>
                </header>
            </div>
        );
    }

    if (!category && !loading) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Category <span className="gradient-text">Not Found</span></h2>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.categoryDetailPage}`}>
            <SmartBanner />
            
            {category && (
                <CategoryDetailHeader 
                    category={category} 
                    totalResults={totalResults} 
                />
            )}

            <main className={styles.categoryContent}>
                {(tools.length > 0 || loading) ? (
                    <CategoryDetailTools 
                        tools={tools}
                        filteredTools={filteredTools}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        loading={loading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        setPage={setPage}
                        totalResults={totalResults}
                        categoryName={category?.name || 'Category'}
                    />
                ) : (
                    <CategoryDetailEmpty categoryName={category?.name || 'Category'} />
                )}
            </main>
        </div>
    );
};

export default CategoryDetail;
