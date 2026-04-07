import React from 'react';
import { Share2, Check } from 'lucide-react';

const ProfileStatsCard = ({ toolCount, handleCopyLink, copied }) => {
    return (
        <div className="profile-stats-stack">
            <button
                onClick={handleCopyLink}
                className="share-trigger-btn"
            >
                {copied ? <Check size={18} color="#00e676" /> : <Share2 size={18} />}
                <span className="share-text">{copied ? 'Link Copied!' : 'Share Profile'}</span>
            </button>

            <div className="profile-stat-box">
                <div className="stat-value">{toolCount}</div>
                <div className="stat-label">Tools Created</div>
            </div>
        </div>
    );
};

export default ProfileStatsCard;
