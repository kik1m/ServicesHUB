import React, { memo } from 'react';
import Select from '../ui/Select';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import styles from './ToolsFilterBar.module.css';

/**
 * ToolsFilterBar - Elite Filtering System
 * Rule #18: Memoized for zero-latency filter switches
 * Rule #34: Constant-driven content
 */
const ToolsFilterBar = memo(({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    priceFilter, 
    setPriceFilter, 
    sortBy, 
    setSortBy,
    isLoading,
    content
}) => {
    
    if (isLoading) {
        return (
            <div className={styles.filterBarLayout}>
                <div className={styles.categoryScrollContainer}>
                    <div className={styles.categoryTabs}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={`cat-skeleton-${i}`} className={styles.tabSkeleton}>
                                <Skeleton width="90px" height="38px" borderRadius="12px" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.sortFilters}>
                    <Skeleton width="130px" height="44px" borderRadius="12px" />
                    <Skeleton width="150px" height="44px" borderRadius="12px" />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.filterBarLayout}>
            <div className={styles.categoryScrollContainer}>
                <div className={styles.categoryTabs}>
                    {categories.map(cat => (
                        <Button
                            key={cat.id || cat.name}
                            variant="ghost"
                            onClick={() => setSelectedCategory(cat.name)}
                            className={`${styles.tabBtn} ${selectedCategory === cat.name ? styles.active : ''}`}
                        >
                            {cat.name === 'All' ? 'All Directory' : cat.name}
                        </Button>
                    ))}
                </div>
            </div>
            
            <div className={styles.sortFilters}>
                <div className={styles.selectWrapper}>
                    <Select
                        options={content.pricing}
                        value={priceFilter}
                        onChange={setPriceFilter}
                        placeholder="Pricing"
                    />
                </div>
                <div className={styles.selectWrapper}>
                    <Select
                        options={content.sorting}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort Order"
                    />
                </div>
            </div>
        </div>
    );
});

export default ToolsFilterBar;
