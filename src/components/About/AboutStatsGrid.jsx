import React, { memo } from 'react';
import { Users, Wrench, Globe, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AboutStatsGrid.module.css';

/**
 * AboutStatsGrid - Elite Component
 * Rule #14: Data-Driven UI via props/constants
 * Rule #112: Zero inline styles
 */
const AboutStatsGrid = ({ isLoading, stats = [], error, onRetry }) => {
    const icons = [
        <Users size={24} />, 
        <Wrench size={24} />, 
        <Globe size={24} />, 
        <Zap size={24} />
    ];

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.statsGrid}>
                {isLoading ? (
                    [1, 2, 3, 4].map(i => (
                        <div key={i} className={`${styles.statCard} glass-card`}>
                            <Skeleton className={styles.skeletonIcon} />
                            <Skeleton className={styles.skeletonValue} />
                            <Skeleton className={styles.skeletonLabel} />
                        </div>
                    ))
                ) : (
                    stats?.map((stat, i) => (
                        <div key={i} className={`${styles.statCard} glass-card`}>
                            <div className={styles.iconWrapper}>
                                {icons[i] || <Zap size={24} />}
                            </div>
                            <div className={styles.value}>{stat?.value}</div>
                            <div className={styles.label}>{stat?.label}</div>
                        </div>
                    ))
                )}
            </div>
        </Safeguard>
    );
};

export default memo(AboutStatsGrid);
