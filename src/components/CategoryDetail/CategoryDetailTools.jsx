import React from 'react';
import { Search } from 'lucide-react';
import ToolCard from '../ToolCard';
import SkeletonLoader from '../SkeletonLoader';

const CategoryDetailTools = ({ 
    tools, 
    filteredTools, 
    searchQuery, 
    setSearchQuery, 
    loading, 
    loadingMore, 
    hasMore, 
    setPage, 
    totalResults,
    categoryName 
}) => {
    return (
        <section className="main-section" style={{ paddingTop: '2rem' }}>
            <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 2rem' }}>
                <Search size={20} color="var(--primary)" />
                <input
                    type="text"
                    placeholder={`Search ${categoryName} tools...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="section-header-row">
                <h2 className="section-title">Explore <span className="gradient-text">Top Tools</span></h2>
                <div className="filter-count">Showing {tools.length} of {totalResults} world-class solutions</div>
            </div>

            <div className="category-tools-grid">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonLoader key={i} type="card" />
                    ))
                ) : (
                    filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                )}
            </div>

            {hasMore && tools.length > 0 && !loading && (
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="btn-primary"
                        disabled={loadingMore}
                        style={{ padding: '1rem 3rem' }}
                    >
                        {loadingMore ? 'Loading Tools...' : 'Load More Tools'}
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategoryDetailTools;
