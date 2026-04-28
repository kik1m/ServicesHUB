import React, { useMemo } from 'react';
import { Search } from 'lucide-react';
import Input from '../ui/Input';
import { CATEGORY_STRINGS, SKELETON_COUNTS } from '../../constants/categoryConstants';
import CategoryCard from './CategoryCard';
import styles from './CategoriesGrid.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * CategoriesGrid - Elite Standard
 * Rule #16: Section Responsibility (Search + Grid)
 * Rule #11: Independent Loading States
 */
const CategoriesGrid = ({ categories, counts, loading, searchQuery, setSearchQuery, error, onRetry }) => {

    // Rule #32: Defensive calculation
    const safeCategories = useMemo(() => categories?.filter(Boolean) ?? [], [categories]);
    const hasResults = safeCategories.length > 0;

    return (
        <Safeguard error={error} onRetry={onRetry} title={CATEGORY_STRINGS?.LIST?.SEARCH?.PLACEHOLDER}>
            <div className={styles.gridSection}>
                {/* Rule #38: Integrated Search within section for better UX flow */}
                <div className={styles.searchWrapper}>
                    <Input
                        placeholder={CATEGORY_STRINGS?.LIST?.SEARCH?.PLACEHOLDER}
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="pill"
                        className={styles.searchInput}
                        disabled={loading && safeCategories?.length === 0}
                    />
                </div>

                <div className={styles.gridContainer}>
                    {loading && safeCategories?.length === 0 ? (
                        // Rule #11: Thematic Skeleton Loading (Rule #30: Static Array)
                        SKELETON_COUNTS?.CATEGORIES_GRID?.map((i) => (
                            <CategoryCard key={`skeleton-cat-${i}`} isLoading={true} />
                        ))
                    ) : (
                        <>
                            {hasResults ? (
                                safeCategories?.map((cat) => (
                                    <CategoryCard
                                        key={cat?.id || cat?.slug}
                                        category={cat}
                                        error={error}
                                        onRetry={onRetry}
                                    />
                                ))
                            ) : (
                                <div className={styles.noResults}>
                                    <p>{CATEGORY_STRINGS?.LIST?.SEARCH?.NO_RESULTS(searchQuery)}</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Safeguard>
    );
};

export default CategoriesGrid;
