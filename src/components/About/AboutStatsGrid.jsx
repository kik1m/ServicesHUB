import React from 'react';
import { Users, Wrench, Globe, Zap } from 'lucide-react';
import styles from './AboutStatsGrid.module.css';

const AboutStatsGrid = () => {
    const stats = [
        { icon: <Users size={24} />, value: '10k+', label: 'Active Users' },
        { icon: <Wrench size={24} />, value: '250+', label: 'Curated Tools' },
        { icon: <Globe size={24} />, value: '50+', label: 'Countries' },
        { icon: <Zap size={24} />, value: '24/7', label: 'Availability' }
    ];

    return (
        <div className={styles.statsGrid}>
            {stats.map((stat, i) => (
                <div key={i} className={`${styles.statCard} glass-card`}>
                    <div className={styles.iconWrapper}>
                        {stat.icon}
                    </div>
                    <div className={styles.value}>{stat.value}</div>
                    <div className={styles.label}>{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default AboutStatsGrid;
