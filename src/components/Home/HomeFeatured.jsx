import React from 'react';
import { Zap } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import ToolCard from '../ToolCard';

const HomeFeatured = ({ featuredTools, loading, error }) => {
    return (
        <section className="main-section featured-preview">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Editor&apos;s <span className="gradient-text">Choice</span></h2>
                    <p className="section-desc">Hand-picked premium tools for maximum productivity.</p>
                </div>
            </div>

            <div className="featured-tools-grid">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonLoader key={i} type="card" />
                    ))
                ) : error ? (
                    <div className="error-message-container" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                        <p style={{ color: 'var(--accent)', fontWeight: '700' }}>{error}</p>
                        <button onClick={() => window.location.reload()} className="btn-outline" style={{ marginTop: '1rem' }}>Retry Now</button>
                    </div>
                ) : featuredTools.length > 0 ? (
                    featuredTools.map((tool, i) => (
                        <ToolCard key={tool.id || i} tool={tool} />
                    ))
                ) : (
                    <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                        <Zap size={48} className="empty-state-icon" style={{ opacity: 0.1, marginBottom: '1.5rem', margin: '0 auto' }} />
                        <p style={{ color: 'var(--text-muted)' }}>No featured tools yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HomeFeatured;
