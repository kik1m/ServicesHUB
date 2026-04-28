import React, { memo } from 'react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileTabs.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * ProfileTabs - Elite Component
 * Rule #14: Constants SSOT
 * Rule #2: Memoized correctly
 * Rule #31: Component Resilience
 */
const ProfileTabs = memo(({ activeTab, onTabChange, favoritesCount, reviewsCount = 0, isLoading, error, onRetry, content }) => {
    // Rule #38: Defensive Fallback
    const labels = content || PROFILE_UI_CONSTANTS.dashboard.tabs;

    const handleFavoritesClick = () => onTabChange?.('favorites');
    const handleReviewsClick = () => onTabChange?.('reviews');

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.tabsNav}>
                <Button
                    variant="text"
                    onClick={handleFavoritesClick}
                    className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
                >
                    {labels?.collection} ({isLoading ? (
                        <Skeleton className={styles.skeletonTabCount} />
                    ) : (
                        favoritesCount ?? 0
                    )})
                </Button>
                <Button
                    variant="text"
                    onClick={handleReviewsClick}
                    className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.active : ''}`}
                >
                    {labels?.reviews} ({isLoading ? (
                        <Skeleton className={styles.skeletonTabCount} />
                    ) : (
                        reviewsCount
                    )})
                </Button>
            </div>
        </Safeguard>
    );
});

export default ProfileTabs;




