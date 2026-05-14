import React, { memo } from 'react';
import { Filter, ChevronRight, Search as SearchIcon } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Input from '../ui/Input';
import Safeguard from '../ui/Safeguard';
import styles from './DirectorySidebar.module.css';

/**
 * DirectorySidebar Component - Elite Gold Standard
 * Rule #29: Pure View with internal Safeguard protection
 */
const DirectorySidebar = memo((props) => {
    const { 
        categoryFilter, 
        pricingFilter, 
        isLoading, 
        error, 
        refetch, 
        content,
        displayedCategories,
        hiddenCount,
        catSearchQuery,
        setCatSearchQuery,
        showAllCats,
        setShowAllCats
    } = props;

    const { selectedCategory, setSelectedCategory } = categoryFilter;
    const { pricingModels, selectedPrice, setSelectedPrice } = pricingFilter;

    // Rule #18: Return Safeguard only if error occurs to avoid wrapping issues
    if (error) return <Safeguard error={error} onRetry={refetch} />;

    return (
        <aside className={styles.searchSidebar}>
            <div className={styles.sidebarCard}>
                {/* 1. Header */}
                <div className={styles.sidebarFilterHeader}>
                    <Filter size={18} />
                    <h3>{content?.title}</h3>
                </div>

                {/* 2. Categories Section */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>{content?.categories?.title}</span>
                    
                    <div className={styles.categorySearchWrapper}>
                        <Input 
                            placeholder={content?.categories?.searchPlaceholder}
                            icon={SearchIcon}
                            value={catSearchQuery}
                            onChange={(e) => setCatSearchQuery(e.target.value)}
                            variant="ghost"
                        />
                    </div>

                    <div className={styles.filterOptionsVertical}>
                        {isLoading ? (
                            Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={`skeleton-cat-${i}`} height="36px" borderRadius="8px" className={styles.mb8} />
                            ))
                        ) : (
                            <>
                                <button 
                                    className={`${styles.filterBtn} ${!selectedCategory ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    <span>All Categories</span>
                                    <ChevronRight size={14} />
                                </button>

                                {displayedCategories.map(cat => (
                                    <button 
                                        key={cat.id} 
                                        className={`${styles.filterBtn} ${selectedCategory === cat.name ? styles.active : ''}`}
                                        onClick={() => setSelectedCategory(cat.name)}
                                    >
                                        <span>{cat.name}</span>
                                        <span>{cat.tool_count}</span>
                                    </button>
                                ))}

                                {hiddenCount > 0 && (
                                    <button 
                                        className={styles.showMoreBtn}
                                        onClick={() => setShowAllCats(!showAllCats)}
                                    >
                                        {showAllCats ? 'Show Less' : `Show All (${hiddenCount + displayedCategories.length})`}
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* 3. Pricing Section */}
                <div className={styles.filterGroup}>
                    <span className={styles.filterLabel}>{content?.pricing?.title}</span>
                    <div className={styles.pricingFilterChips}>
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={`skeleton-price-${i}`} height="38px" borderRadius="8px" />
                            ))
                        ) : (
                            pricingModels.map(model => (
                                <button 
                                    key={model.value}
                                    className={`${styles.pricingChip} ${selectedPrice === model.value ? styles.active : ''}`}
                                    onClick={() => setSelectedPrice(selectedPrice === model.value ? null : model.value)}
                                >
                                    {model.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
});

export default DirectorySidebar;
