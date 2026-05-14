import React from 'react';
import Skeleton from '../ui/Skeleton';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogFilters.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogFilters - Category selector for the blog magazine
 * Rule #12: Pure UI Component
 */
const BlogFilters = ({ categories, selectedCategory, setSelectedCategory, isLoading, error, onRetry }) => {
    if (isLoading) {
        return (
            <div className={styles.filtersContainer}>
                {BLOG_CONSTANTS.SKELETONS.FILTERS.map(i => (
                    <Skeleton key={i} className={styles.skeletonPill} />
                ))}
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.filtersContainer}>
                {categories?.map(cat => (
                    <div
                        key={cat}
                        role="button"
                        tabIndex={0}
                        aria-label={`${BLOG_CONSTANTS?.FILTERS?.ARIA_LABEL_PREFIX}${cat}`}
                        onClick={() => setSelectedCategory(cat)}
                        onKeyDown={(e) => e.key === 'Enter' && setSelectedCategory(cat)}
                        className={`${styles.filterPill} ${selectedCategory === cat ? styles.active : ''}`}
                    >
                        {cat}
                    </div>
                ))}
            </div>
        </Safeguard>
    );
};

export default React.memo(BlogFilters);




