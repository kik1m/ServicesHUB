import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import ToolCard from '../ToolCard';
import SkeletonLoader from '../SkeletonLoader';
import CustomSelect from '../CustomSelect';

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
            <div className="results-header-row">
                <p style={{ color: 'var(--text-muted)' }}>
                    Showing <span style={{ color: 'white', fontWeight: '700' }}>{results.length}</span> tools
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ minWidth: '180px' }}>
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

            <div className="results-grid-container">
                <div className="results-grid">
                    {isLoading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <SkeletonLoader key={i} type="card" />
                        ))
                    ) : results.length > 0 ? (
                        results.map(tool => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))
                    ) : (
                        <div className="search-results-empty">
                            <SearchIcon size={48} color="var(--text-muted)" style={{ marginBottom: '1rem', opacity: 0.3 }} />
                            <h3>No tools found</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search query.</p>
                        </div>
                    )}
                </div>

                {hasMore && results.length > 0 && !isLoading && (
                    <div className="results-pagination-row">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className="btn-primary"
                            disabled={loadingMore}
                            style={{ padding: '1rem 3rem' }}
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
