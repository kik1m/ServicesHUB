import React from 'react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import { CATEGORY_STRINGS } from '../../constants/categoryConstants';
import styles from './CategoryToolsPagination.module.css';

/**
 * CategoryToolsPagination Component
 * Rule #16: Section Responsibility (Pagination only)
 * Rule #15: Inline Functions Rule (Avoid inside JSX)
 */
const CategoryToolsPagination = (props) => {
    const { 
        hasMore, 
        toolsCount, 
        isLoading, 
        loadingMore, 
        onLoadMore,
        error,
        onRetry
    } = props;

    // Rule #32: Defensive Type Check
    const count = toolsCount ?? 0;

    // Rule #38: Silent Failure Prevention
    if (!hasMore || count === 0 || isLoading) {
        return null;
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.paginationRow}>
                <Button
                    onClick={onLoadMore}
                    isLoading={loadingMore}
                    disabled={loadingMore}
                    className={styles.loadMoreBtn}
                    variant="primary"
                    aria-label="Load more tools"
                >
                    {CATEGORY_STRINGS?.TOOLS?.LOAD_MORE}
                </Button>
            </div>
        </Safeguard>
    );
};

export default CategoryToolsPagination;
