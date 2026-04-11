import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import styles from './LegalHero.module.css';

const LegalHero = ({ loading, badge, title, accent, subtitle, isCompact }) => {
    if (loading) {
        return (
            <header className={`page-header ${styles.heroSection}`}>
                <div className={styles.heroContent}>
                    <SkeletonLoader type="title" width="40%" style={{ margin: '0 auto' }} />
                </div>
            </header>
        );
    }

    return (
        <header className={`page-header ${styles.heroSection}`}>
            <div className={styles.heroContent}>
                <div className="badge">{badge}</div>
                <h1 className="hero-title" style={{ fontSize: isCompact ? '3.5rem' : '4.5rem' }}>
                    {title} <span className="gradient-text">{accent}</span>
                </h1>
                {subtitle && (
                    <p className="hero-subtitle">
                        {subtitle}
                    </p>
                )}
            </div>
        </header>
    );
};

export default LegalHero;
