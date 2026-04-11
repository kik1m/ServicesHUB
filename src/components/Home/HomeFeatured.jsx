import React from 'react';
import { Zap } from 'lucide-react';
import ToolCard from '../ToolCard';
import ToolCardSkeleton from '../Tools/ToolCardSkeleton';
import styles from './HomeFeatured.module.css';

const HomeFeatured = ({ featuredTools, loading, error }) => {
    return (
        <section className={`main-section ${styles.featuredPreview}`}>
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Editor&apos;s <span className="gradient-text">Choice</span></h2>
                    <p className="section-desc">Hand-picked premium tools for maximum productivity.</p>
                </div>
            </div>

            <div className={styles.featuredToolsGrid}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <ToolCardSkeleton key={i} />
                    ))
                ) : error ? (
                    <div className={styles.errorMessageContainer}>
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-outline">Retry Now</button>
                    </div>
                ) : (featuredTools?.length || 0) > 0 ? (
                    (featuredTools || []).map((tool, i) => (
                        <ToolCard key={tool?.id || i} tool={tool} />
                    ))
                ) : (
                    <div className={`${styles.emptyState} glass-card`}>
                        <Zap size={48} className={styles.emptyStateIcon} />
                        <p style={{ color: 'var(--text-muted)' }}>No featured tools yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeFeatured;
