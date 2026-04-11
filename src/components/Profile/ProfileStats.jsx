import React from 'react';
import { Heart, MessageSquare } from 'lucide-react';
import styles from './ProfileStats.module.css';

const ProfileStats = ({ favoritesCount, reviewsCount = 0 }) => {
    return (
        <div className={`${styles.statsContainer} fade-in`}>
            <div className={styles.statBoxModern}>
                <div className={`${styles.iconWrapper} ${styles.heart}`}>
                    <Heart size={18} fill="currentColor" />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statNumber}>{favoritesCount}</span>
                    <span className={styles.statLabel}>Saved</span>
                </div>
            </div>

            <div className={styles.verticalLine}></div>

            <div className={styles.statBoxModern}>
                <div className={`${styles.iconWrapper} ${styles.star}`}>
                    <MessageSquare size={18} fill="currentColor" />
                </div>
                <div className={styles.statContent}>
                    <span className={styles.statNumber}>{reviewsCount}</span>
                    <span className={styles.statLabel}>Reviews</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
