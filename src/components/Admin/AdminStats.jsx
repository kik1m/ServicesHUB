'use client';
import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AdminStats.module.css';

/**
 * AdminStats - Elite Modular Component (Next.js Port)
 */
const AdminStats = memo(({ stats = [], isLoading, error, onRetry }) => {
    const SKELETON_COUNT = 4;

    const colorMap = {
        'var(--primary)': styles.iconPrimary,
        'var(--secondary)': styles.iconSecondary,
        '#ffcc00': styles.iconWarning,
        '#00ff88': styles.iconSecondary, // Map status to secondary
        '#00a3ff': styles.iconPrimary,
        '#00e676': styles.iconSecondary,
        '#ffa500': styles.iconWarning,
        '#ff4757': styles.iconDanger,
        '#ffd700': styles.iconPremium
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.statsGrid}>
                {isLoading ? (
                    [...Array(SKELETON_COUNT)].map((_, i) => (
                        <div key={`skeleton-admin-stat-${i}`} className={styles.statCard}>
                            <div className={styles.iconWrapper}>
                                <Skeleton className={styles.skeletonIcon} />
                            </div>
                            <div className={styles.info}>
                                <Skeleton className={styles.skeletonLabel} />
                                <Skeleton className={styles.skeletonValue} />
                            </div>
                        </div>
                    ))
                ) : (
                    stats?.map(stat => (
                        <div key={stat.id} className={styles.statCard}>
                            <div className={`${styles.iconWrapper} ${colorMap[stat?.color] || styles.iconPrimary}`}>
                                {stat?.icon && <stat.icon size={22} />}
                            </div>
                            <div className={styles.info}>
                                <p className={styles.label}>{stat?.label}</p>
                                <h3 className={styles.value}>
                                    {typeof stat?.value === 'number' ? stat.value.toLocaleString() : (stat?.value || '0')}
                                </h3>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Safeguard>
    );
});

export default AdminStats;
