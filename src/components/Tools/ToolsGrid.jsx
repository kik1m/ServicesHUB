import React, { memo, useRef, useCallback } from 'react';
import { SearchX } from 'lucide-react';
import ToolCard from '../ToolCard';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './ToolsGrid.module.css';

/**
 * ToolsGrid - Elite Discovery Grid
 * Rule #29: Pure Rendering with Safeguard Protection
 * Rule #11: Infinite Scroll implementation
 */
const ToolsGrid = memo(({
    tools,
    isLoading,
    loadingMore,
    hasMore,
    setPage,
    refresh,
    emptyMessage,
    error,
    onRetry
}) => {
    const observer = useRef();

    const lastElementRef = useCallback(node => {
        if (isLoading || loadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isLoading, loadingMore, hasMore, setPage]);

    // 1. Initial Loading State (Skeleton)
    if (isLoading && (!tools || tools.length === 0)) {
        return (
            <div className={styles.gridWrapper}>
                <div className={styles.resultsGrid}>
                    {Array.from({ length: 12 }).map((_, i) => (
                        <ToolCard isLoading={true} key={`skeleton-grid-${i}`} />
                    ))}
                </div>
            </div>
        );
    }

    // 2. Empty State Handling
    if ((!tools || tools.length === 0) && !isLoading) {
        return (
            <div className={styles.emptyState}>
                <SearchX size={48} strokeWidth={1.5} className={styles.emptyIcon} />
                <h3>No Tools Found</h3>
                <p>{emptyMessage}</p>
                <Button onClick={refresh} variant="outline" className={styles.resetBtn}>
                    Clear All Filters
                </Button>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.gridWrapper}>
                <div className={styles.resultsGrid}>
                    {tools?.map(tool => (
                        <ToolCard key={tool?.id || tool?.slug} tool={tool} />
                    ))}
                </div>

                <div ref={lastElementRef} className={styles.observerTarget} />

                {loadingMore && (
                    <div className={styles.loadMoreLoading}>
                        <div className={styles.loadingSpinner} />
                        <span>Loading more tools...</span>
                    </div>
                )}
            </div>
        </Safeguard>
    );
});

export default ToolsGrid;
