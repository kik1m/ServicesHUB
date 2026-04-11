import React from 'react';
import { Zap } from 'lucide-react';
import ToolCard from '../ToolCard';
import ToolCardSkeleton from './ToolCardSkeleton';
import styles from './ToolsGrid.module.css';

const ToolsGrid = ({ 
    tools, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    setPage 
}) => {
    return (
        <div className={styles.resultsGridContainer}>
            <div className={styles.resultsGrid}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <ToolCardSkeleton key={i} />
                    ))
                ) : error ? (
                    <div className={styles.errorMessageContainer}>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-outline">Retry Now</button>
                    </div>
                ) : tools.length > 0 ? (
                    tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                ) : (
                    <div className={styles.emptyStateContainer}>
                        <Zap size={48} className={styles.emptyIcon} />
                        <p>No tools found matching your criteria.</p>
                    </div>
                )}
            </div>

            {hasMore && tools.length > 0 && !loading && (
                <div className={styles.toolsPaginationRow}>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className={`btn-primary ${styles.btnLoadMore}`}
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Loading More...' : 'Load More Tools'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ToolsGrid;
