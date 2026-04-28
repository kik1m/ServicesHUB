import React from 'react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './CategoryToolsHeader.module.css';

/**
 * CategoryToolsHeader Component
 * Rule #16: Section Responsibility (Title & Stats only)
 * Rule #26: Pure UI
 * Rule #11: Independent Section Loading
 */
const CategoryToolsHeader = (props) => {
    const {
        isLoading,
        searchQuery,
        toolsCount,
        totalResults,
        error,
        onRetry
    } = props;

    // Rule #32: Defensive Type Check
    const count = toolsCount ?? 0;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.sectionHeaderRow}>
                <div className={styles.centeredHeader}>
                    <h2 className={styles.sectionTitle}>
                        {CATEGORY_STRINGS?.TOOLS?.SECTION_TITLE_MAIN} <span className="gradient-text">{CATEGORY_STRINGS?.TOOLS?.SECTION_TITLE_ACCENT}</span>
                    </h2>
                    <div className={styles.filterCount}>
                        {isLoading ? (
                            <Skeleton width="180px" height="18px" />
                        ) : (
                            <>
                                {searchQuery ? (
                                    CATEGORY_STRINGS?.TOOLS?.SEARCH_FOUND(count, searchQuery)
                                ) : (
                                    CATEGORY_STRINGS?.TOOLS?.STATS_SHOWING(count, totalResults)
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Safeguard>
    );
};

export default CategoryToolsHeader;
