import React, { memo } from 'react';
import { MessageSquare } from 'lucide-react';
import Safeguard from '../ui/Safeguard';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';
import styles from './ProfileReviewsEmpty.module.css';

/**
 * ProfileReviewsEmpty - Component 8/10
 * @param {Object} props
 * @param {boolean} props.isActive
 */
const ProfileReviewsEmpty = memo(({ isActive, content, error, onRetry }) => {
    // Rule #38: Resilience Fallback
    const labels = content || PROFILE_CONSTANTS.REVIEWS;

    if (!isActive) return null;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.emptyStateCard} fade-in`}>
                <MessageSquare size={64} className={styles.emptyStateIcon} />
                <h4 className={styles.emptyStateTitle}>{labels?.EMPTY_TITLE || labels?.emptyTitle}</h4>
                <p className={styles.emptyStateText}>{labels?.EMPTY_TEXT || labels?.emptyText}</p>
            </div>
        </Safeguard>
    );
});

export default ProfileReviewsEmpty;
