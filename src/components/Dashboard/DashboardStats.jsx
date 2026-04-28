import React, { memo } from 'react';
import { LayoutGrid, MousePointerClick, Zap, Heart, ExternalLink } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './DashboardStats.module.css';

import { DASHBOARD_CONSTANTS, SKELETON_COUNTS } from '../../constants/dashboardConstants';

const DashboardStats = memo(({ isCreator, isPremium, stats, isLoading, error, onRetry, content }) => {
    if (isLoading) {
        return (
            <div className={styles.statsGrid}>
                {SKELETON_COUNTS.STATS.map(i => (
                    <div key={`skeleton-stat-${i}`} className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <Skeleton width="100px" height="16px" borderRadius="100px" />
                            <Skeleton width="24px" height="24px" borderRadius="8px" />
                        </div>
                        <div className={styles.skeletonValue}>
                            <Skeleton width="80px" height="32px" borderRadius="8px" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }


    // Rule #116: Logic Isolation - Stats are pre-computed in the hook
    const statsData = isCreator ? content.creator : content.user;
    const icons = { 
        submissions: LayoutGrid, 
        views: MousePointerClick, 
        clicks: ExternalLink,
        tier: Zap, 
        favorites: Heart, 
        account: Zap 
    };

    const finalStats = statsData?.map(stat => {
        let value = '';
        if (stat?.type === 'submissions') value = stats?.totalSubmissions || 0;
        if (stat?.type === 'views') value = stats?.totalViews?.toLocaleString() || 0;
        if (stat?.type === 'clicks') value = stats?.totalClicks?.toLocaleString() || 0;
        if (stat?.type === 'favorites') value = stats?.totalFavorites || 0;
        if (stat?.type === 'tier') value = isPremium ? content?.tiers?.premium : content?.tiers?.free;
        if (stat?.type === 'account') value = content?.tiers?.discovery;

        return {
            ...stat,
            value,
            icon: icons[stat?.type] || Zap,
            isPremium: stat?.type === 'tier' && isPremium
        };
    });

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.statsGrid}>
                {finalStats?.map((stat) => (
                    // Rule #24.1: Static keys from data
                    <div key={stat?.type} className={`${styles.metricCard} ${stat?.isPremium ? styles.premiumCard : ''}`}>
                        <div className={styles.metricHeader}>
                            <span className={styles.metricLabel}>{stat?.label}</span>
                            <div className={`${styles.iconWrapper} ${styles['icon' + (stat?.type?.charAt(0)?.toUpperCase() + stat?.type?.slice(1))]}`}>
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        <div className={`${styles.metricValue} ${stat?.isPremium ? styles.premiumValue : ''}`}>
                            {stat?.value}
                        </div>
                    </div>
                ))}
            </div>
        </Safeguard>
    );
});

export default DashboardStats;




