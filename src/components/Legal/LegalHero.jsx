import React from 'react';
import SkeletonLoader from '../SkeletonLoader';

const LegalHero = ({ loading, badge, title, accent, subtitle, isCompact }) => {
    if (loading) {
        return (
            <header className={`page-header ${isCompact ? 'hero-section-compact' : 'hero-section'}`} style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <SkeletonLoader type="title" width="40%" style={{ margin: '0 auto' }} />
                    <SkeletonLoader type="text" width="200px" style={{ margin: '1rem auto' }} />
                </div>
            </header>
        );
    }

    return (
        <header className={`page-header ${isCompact ? 'hero-section-compact' : 'hero-section'}`}>
            <div className="hero-content">
                <div className="badge">{badge}</div>
                <h1 className="hero-title">
                    {title} <span className="gradient-text">{accent}</span>
                </h1>
                <p className="hero-subtitle">{subtitle}</p>
            </div>
        </header>
    );
};

export default LegalHero;
