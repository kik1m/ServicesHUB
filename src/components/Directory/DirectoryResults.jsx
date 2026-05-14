import React, { useRef, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import ToolCard from '../ToolCard';
import Skeleton from '../ui/Skeleton';
import Select from '../ui/Select';
import EmptyState from '../ui/EmptyState';
import Safeguard from '../ui/Safeguard';
import { SORT_OPTIONS, SKELETON_COUNTS } from '../../constants/searchConstants';
import styles from './DirectoryResults.module.css';

/**
 * DirectoryResults Component - Elite Grid
 * Rule #29: Pure View with Safeguard protection
 * Rule #11: Infinite Scroll implementation
 */
const DirectoryResults = (props) => {
    const { results, totalResults, isLoading, loadingMore, hasMore, setPage, sortBy, setSortBy, error, refetch, onToolClick, className = '', content, headerExtra, onClearFilters } = props;

    const observerTarget = useRef(null);
    const safeResults = results?.filter(Boolean) ?? [];
    const isInitialLoad = isLoading && safeResults.length === 0;

    useEffect(() => {
        const target = observerTarget.current;
        if (!target || !hasMore || isLoading || loadingMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage(prev => prev + 1);
            }
        }, { threshold: 0.1, rootMargin: '400px' });

        observer.observe(target);
        return () => { if (target) observer.unobserve(target); };
    }, [hasMore, isLoading, loadingMore, setPage]);

    return (
        <Safeguard error={error} onRetry={refetch}>
            <main className={`${styles.resultsGridContainer} ${className}`}>
                <div className={styles.resultsHeaderRow}>
                    <div className={styles.resultsMeta}>
                        {isInitialLoad ? (
                            <Skeleton width="120px" height="18px" borderRadius="4px" />
                        ) : (
                            <p className={styles.resultCount}>
                                Showing <span className={styles.resultCountHighlight}>{safeResults.length}</span> {totalResults ? `of ${totalResults}` : ''} {content?.found}
                            </p>
                        )}
                    </div>

                    {headerExtra && <div className={styles.headerExtra}>{headerExtra}</div>}

                    <div className={styles.sortContainer}>
                        <span className={styles.sortLabel}>{content?.sortBy || "Sort by:"}</span>
                        {isInitialLoad ? (
                            <Skeleton width="180px" height="44px" borderRadius="12px" />
                        ) : (
                            <div className={styles.sortSelectBox}>
                                <Select
                                    value={sortBy}
                                    onChange={(v) => setSortBy(v)}
                                    options={SORT_OPTIONS}
                                    variant="outline"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className={props.mode === 'lite' ? styles.resultsGridLite : styles.resultsGrid}>
                    {safeResults.length > 0 ? (
                        safeResults.map((tool, index) => (
                            <ToolCard 
                                key={`${tool.id || tool.slug}-${index}`} 
                                tool={tool} 
                                onClickOverride={onToolClick} 
                            />
                        ))
                    ) : isInitialLoad ? (
                        Array.from({ length: SKELETON_COUNTS.RESULTS_GRID }).map((_, i) => (
                            <ToolCard key={`skeleton-search-grid-${i}`} isLoading={true} />
                        ))
                    ) : (
                        <div className={styles.searchResultsEmpty}>
                            <EmptyState
                                title={content?.noResults?.title || "No results found"}
                                message={content?.noResults?.description || "Try adjusting your search or filters to find what you're looking for."}
                                icon={SearchIcon}
                                actionText="Clear Filters"
                                onAction={onClearFilters}
                            />
                        </div>
                    )}

                    {loadingMore && Array.from({ length: SKELETON_COUNTS.RESULTS_MORE }).map((_, i) => (
                        <ToolCard key={`skeleton-search-more-${i}`} isLoading={true} />
                    ))}
                </div>

                <div ref={observerTarget} className={styles.observerTarget} />
            </main>
        </Safeguard>
    );
};

export default DirectoryResults;
