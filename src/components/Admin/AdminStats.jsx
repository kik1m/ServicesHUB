import React from 'react';
import styles from './AdminStats.module.css';

const AdminStats = ({ stats }) => {
    if (!stats || stats.length === 0) return null;

    return (
        <div className={styles.statsGrid}>
            {stats.map(stat => (
                <div key={stat.id} className={`${styles.statCard} glass-card`}>
                    <div className={styles.iconWrapper} style={{ color: stat.color }}>
                        <stat.icon size={22} />
                    </div>
                    <div className={styles.info}>
                        <p className={styles.label}>{stat.label}</p>
                        <h3 className={styles.value}>{stat.value.toLocaleString()}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
