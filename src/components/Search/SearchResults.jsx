import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import ToolCard from '../ToolCard';
import ToolCardSkeleton from '../Tools/ToolCardSkeleton';
import CustomSelect from '../CustomSelect';
import styles from './SearchResults.module.css';

const SearchResults = ({ 
    results, 
    isLoading, 
    loadingMore, 
    hasMore, 
    setPage, 
    sortBy, 
    setSortBy 
}) => {
    return (
        <main>
            <div className={styles.resultsHeaderRow}>
                <p className={styles.resultCount}>
                    Showing <span className={styles.resultCountHighlight}>{results.length}</span> tools
                </p>
                <div className={styles.sortContainer}>
                    <div className={styles.sortSelectBox}>
                        <CustomSelect
                            options={[
                                { id: 'Newest', name: 'Newest First' },
                                { id: 'Popular', name: 'Most Popular' },
                                { id: 'Rating', name: 'Highest Rated' }
                            ]}
                            value={sortBy}
                            onChange={(val) => setSortBy(val)}
                            placeholder="Sort By"
                        />
                    </div>
                </div>
            </div>

            <div className={styles.resultsGridContainer}>
                <div className={styles.resultsGrid}>
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <ToolCardSkeleton key={i} />
                        ))
                    ) : results.length > 0 ? (
                        results.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))
                    ) : (
                        <div className={styles.searchResultsEmpty}>
                            <SearchIcon size={48} className={styles.emptyIcon} color="var(--text-muted)" />
                            <h3>No tools found</h3>
                            <p className={styles.emptyText}>Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

                {hasMore && results.length > 0 && !isLoading && (
                    <div className={styles.resultsPaginationRow}>
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className={`btn-primary ${styles.loadMoreBtn}`}
                            disabled={loadingMore}
                        >
                            {loadingMore ? 'Searching...' : 'Load More Results'}
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SearchResults;
