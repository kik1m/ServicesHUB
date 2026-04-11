import React from 'react';
import { LayoutGrid, MousePointerClick, Zap, Heart } from 'lucide-react';
import styles from './DashboardStats.module.css';

const DashboardStats = ({ isCreator, userTools, favorites, user }) => {
    // Calculate Stats
    const totalViews = userTools.reduce((sum, tool) => sum + (tool.view_count || 0), 0);
    
    const stats = isCreator ? [
        { label: 'Total Submissions', value: userTools.length, icon: LayoutGrid, color: 'var(--primary)' },
        { label: 'Total Views', value: totalViews.toLocaleString(), icon: MousePointerClick, color: '#00e676' },
        { label: 'Plan Tier', value: user?.is_premium ? 'PREMIUM' : 'FREE', icon: Zap, color: user?.is_premium ? '#FFD700' : 'var(--primary)', isPremium: user?.is_premium }
    ] : [
        { label: 'Saved Tools', value: favorites.length, icon: Heart, color: '#ff4757' },
        { label: 'Account Type', value: 'Discovery', icon: Zap, color: 'var(--primary)' },
        { label: 'Plan Tier', value: user?.is_premium ? 'PREMIUM' : 'FREE', icon: Zap, color: user?.is_premium ? '#FFD700' : 'var(--primary)', isPremium: user?.is_premium }
    ];

    return (
        <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
                <div key={index} className={`${styles.metricCard} ${stat.isPremium ? styles.premiumCard : ''}`}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>{stat.label}</span>
                        <stat.icon size={20} color={stat.color} className={styles.metricIcon} />
                    </div>
                    <div className={`${styles.metricValue} ${stat.isPremium ? styles.premiumValue : ''}`}>
                        {stat.value}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DashboardStats;
