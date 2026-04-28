import React, { memo } from 'react';
import { Github, Chrome } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SocialLogins.module.css';
import { AUTH_UI_CONSTANTS } from '../../constants/authConstants';

/**
 * SocialLogins - Elite Component
 * Rule #14: Data-Driven UI via constants
 * Rule #2: Memoized
 */
const SocialLogins = memo(({ onSocialAction, isLoading, error, onRetry }) => {
    const { social } = AUTH_UI_CONSTANTS;

    if (isLoading) {
        return (
            <div className={styles.socialGrid}>
                <Skeleton className={styles.skeletonSocial} />
                <Skeleton className={styles.skeletonSocial} />
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry} title={social?.divider}>
            <div className={styles.divider}>
                <span>{social?.divider}</span>
            </div>
            <div className={styles.socialGrid}>
                <Button 
                    variant="outline"
                    className={styles.socialBtn}
                    onClick={() => onSocialAction('google')}
                    icon={Chrome}
                    iconSize={20}
                >
                    {social?.google}
                </Button>
                <Button 
                    variant="outline"
                    className={styles.socialBtn}
                    onClick={() => onSocialAction('github')}
                    icon={Github}
                    iconSize={20}
                >
                    {social?.github}
                </Button>
            </div>
        </Safeguard>
    );
});

export default SocialLogins;
