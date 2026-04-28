import React, { memo } from 'react';
import { Heart, MessageSquare, AlertCircle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileStats.module.css';
import { PROFILE_CONSTANTS, PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * ProfileStats - Component 2/10
 * @param {Object} props
 * @param {number} props.favoritesCount
 * @param {number} props.reviewsCount
 * @param {boolean} props.isLoading
 * @param {string} props.error
 */
const ProfileStats = memo(({ favoritesCount, reviewsCount = 0, isLoading, error, onRetry, content }) => {
    // Rule #38: Resilience Fallback
    const labels = content || PROFILE_UI_CONSTANTS.dashboard.stats;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.statsContainer}>
                {/* Rule #11.2: In-place Skeleton for Numbers only */}
                <div className={styles.statBoxModern}>
                    <div className={`${styles.iconWrapper} ${styles.heart}`}>
                        <Heart size={18} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statNumber}>
                            {isLoading ? (
                                <Skeleton className={styles.skeletonStat} />
                            ) : error ? (
                                <AlertCircle size={14} color="var(--error)" />
                            ) : (
                                favoritesCount ?? 0
                            )}
                        </span>
                        <span className={styles.statLabel}>{labels?.SAVED || labels?.saved}</span>
                    </div>
                </div>

                <div className={styles.verticalLine}></div>

                <div className={styles.statBoxModern}>
                    <div className={`${styles.iconWrapper} ${styles.star}`}>
                        <MessageSquare size={18} fill="currentColor" />
                    </div>
                    <div className={styles.statContent}>
                        <span className={styles.statNumber}>
                            {isLoading ? (
                                <Skeleton className={styles.skeletonStat} />
                            ) : error ? (
                                <AlertCircle size={14} color="var(--error)" />
                            ) : (
                                reviewsCount
                            )}
                        </span>
                        <span className={styles.statLabel}>{labels?.REVIEWS || labels?.reviews}</span>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default ProfileStats;




