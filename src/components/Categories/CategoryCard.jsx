import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getIcon } from '../../utils/iconMap.jsx';
import Skeleton from '../ui/Skeleton';
import styles from './CategoryCard.module.css';

import { CATEGORY_STRINGS } from '../../constants/categoryConstants';

import Safeguard from '../ui/Safeguard';

/**
 * CategoryCard - Elite Atomic Component
 * Rule #13: Unified Interaction Patterns
 * Rule #19: Component Isolation
 */
const CategoryCard = memo(({ category, isLoading, error, onRetry }) => {
    // Rule #11: Component-Owned Skeletons
    if (isLoading) {
        return (
            <div className={styles.categoryCardSkeleton}>
                <div className={styles.skeletonHeader}>
                    <Skeleton className={styles.skeletonBadge} borderRadius="100px" />
                </div>
                <Skeleton borderRadius="14px" className={styles.skeletonIcon} />
                <Skeleton className={styles.skeletonTitle} />
                <Skeleton className={styles.skeletonSub} />
            </div>
        );
    }

    if (!category) return null;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <Link 
                to={`/category/${category?.slug}`} 
                className={styles.categoryCard}
                aria-label={`Browse tools in ${category?.name}`}
            >
                <div className={styles.catCountBadge}>
                    <span>{category?.toolCount || 0}</span> {CATEGORY_STRINGS?.LIST?.CARD?.TOOLS}
                </div>
                <div className={styles.catIconWrapper}>
                    {getIcon(category?.icon_name || 'LayoutGrid', 24)}
                </div>
                <h3 className={styles.catName}>{category?.name}</h3>
                <div className={styles.browseLink}>
                    <span>{CATEGORY_STRINGS?.LIST?.CARD?.BROWSE}</span> <ChevronRight size={14} />
                </div>
            </Link>
        </Safeguard>
    );
});

export default CategoryCard;
