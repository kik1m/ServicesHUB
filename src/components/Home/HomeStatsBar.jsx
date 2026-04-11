import React from 'react';
import SkeletonLoader from '../SkeletonLoader';
import styles from './HomeStatsBar.module.css';

const HomeStatsBar = ({ statsCount, categoriesCount, loading }) => {
    if (loading) {
        return (
            <div className={styles.statsBarWrapper}>
                <div className={`${styles.statsBar} glass-card`} style={{ gap: '2rem' }}>
                    <SkeletonLoader type="stat" style={{ flex: 1, background: 'transparent', border: 'none', boxShadow: 'none' }} />
                    <div className={styles.statDivider}></div>
                    <SkeletonLoader type="stat" style={{ flex: 1, background: 'transparent', border: 'none', boxShadow: 'none' }} />
                    <div className={styles.statDivider}></div>
                    <SkeletonLoader type="stat" style={{ flex: 1, background: 'transparent', border: 'none', boxShadow: 'none' }} />
                </div>
            </div>
        );
    }

    return (
        <div className={styles.statsBarWrapper}>
            <div className={`${styles.statsBar} glass-card`}>
                <div className={styles.statItem}>
                    <div className={styles.statVal}>{(statsCount.tools || 0).toLocaleString()}+</div>
                    <div className={styles.statLabel}>Vetted Tools</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                    <div className={styles.statVal}>{(statsCount.views || 0).toLocaleString()}+</div>
                    <div className={styles.statLabel}>Discoveries</div>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                    <div className={styles.statVal}>{categoriesCount || 0}</div>
                    <div className={styles.statLabel}>Expert Categories</div>
                </div>
            </div>
        </div>
    );
};

export default HomeStatsBar;
