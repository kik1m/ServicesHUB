import React from 'react';
import { Zap } from 'lucide-react';
import ToolCard from '../ToolCard';
import SkeletonLoader from '../SkeletonLoader';

const ToolsGrid = ({ 
    tools, 
    loading, 
    loadingMore, 
    error, 
    hasMore, 
    setPage 
}) => {
    return (
        <div className="results-grid-container">
            <div className="results-grid">
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <SkeletonLoader key={i} type="card" />
                    ))
                ) : error ? (
                    <div className="error-message-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                        <p style={{ color: 'var(--accent)', fontWeight: '700' }}>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-outline" style={{ marginTop: '1rem' }}>Retry Now</button>
                    </div>
                ) : tools.length > 0 ? (
                    tools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                    ))
                ) : (
                    <div className="empty-state-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                        <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.1, margin: '0 auto' }} />
                        <p>No tools found matching your criteria.</p>
                    </div>
                )}
            </div>

            {hasMore && tools.length > 0 && !loading && (
                <div className="tools-pagination-row">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="btn-primary btn-load-more"
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
