import React from 'react';
import { Share2, Check } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileStatsCard.module.css';

const ProfileStatsCard = ({ toolCount, handleCopyLink, copied, isLoading, error, onRetry, content }) => {
    const labels = content || {
        share: 'Share Profile',
        copied: 'Link Copied!',
        toolsCreated: 'Tools Created'
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.statsStack}>
                    <Skeleton className={styles.skeletonBtn} />
                    <div className={styles.statBox}>
                        <Skeleton className={styles.skeletonValue} />
                        <Skeleton className={styles.skeletonLabel} />
                    </div>
                </div>
            ) : (
                <div className={styles.statsStack}>
                    <Button
                        variant="ghost"
                        onClick={handleCopyLink}
                        className={styles.shareTriggerBtn}
                        icon={copied ? Check : Share2}
                        iconSize={18}
                        iconColor={copied ? "var(--success)" : undefined}
                    >
                        {copied ? labels?.copied : labels?.share}
                    </Button>

                    <div className={styles.statBox}>
                        <div className={styles.statValue}>{toolCount ?? 0}</div>
                        <div className={styles.statLabel}>{labels?.toolsCreated}</div>
                    </div>
                </div>
            )}
        </Safeguard>
    );
};

export default ProfileStatsCard;




