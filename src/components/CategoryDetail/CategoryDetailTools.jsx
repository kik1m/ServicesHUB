import React from 'react';
import { Search } from 'lucide-react';
import ToolCard from '../ToolCard';
import ToolCardSkeleton from '../Tools/ToolCardSkeleton';
import styles from './CategoryDetailTools.module.css';

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
        <section className={styles.mainSection}>
            <div className={styles.heroSearchWrapperLarge}>
                <Search size={20} color="var(--primary)" />
                <input
                    type="text"
                    placeholder={`Search ${categoryName} tools...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className={styles.sectionHeaderRow}>
                <h2 className={styles.sectionTitle}>Explore <span className="gradient-text">Top Tools</span></h2>
                <div className={styles.filterCount}>Showing {tools.length} of {totalResults} world-class solutions</div>
            </div>

            <div className={styles.categoryToolsGrid}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <ToolCardSkeleton key={i} />
                    ))
                ) : (
                    filteredTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                )}
            </div>

            {hasMore && tools.length > 0 && !loading && (
                <div className={styles.paginationRow}>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className={`btn-primary ${styles.loadMoreBtn}`}
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Loading Tools...' : 'Load More Tools'}
                    </button>
                </div>
            )}
        </section>
    );
};

export default CategoryDetailTools;
