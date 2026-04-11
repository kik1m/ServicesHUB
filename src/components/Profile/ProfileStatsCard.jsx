import React from 'react';
import { Share2, Check } from 'lucide-react';
import styles from './ProfileStatsCard.module.css';

const ProfileStatsCard = ({ toolCount, handleCopyLink, copied }) => {
    return (
        <div className={styles.statsStack}>
            <button
                onClick={handleCopyLink}
                className={styles.shareTriggerBtn}
            >
                {copied ? <Check size={18} color="#00e676" /> : <Share2 size={18} />}
                <span className={styles.shareText}>
                    {copied ? 'Link Copied!' : 'Share Profile'}
                </span>
            </button>

            <div className={styles.statBox}>
                <div className={styles.statValue}>{toolCount}</div>
                <div className={styles.statLabel}>Tools Created</div>
            </div>
        </div>
    );
};

export default ProfileStatsCard;
