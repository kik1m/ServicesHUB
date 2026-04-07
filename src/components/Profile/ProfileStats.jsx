import React from 'react';
import { Heart, Star, MessageSquare } from 'lucide-react';

const ProfileStats = ({ favoritesCount, reviewsCount = 0 }) => {
    return (
        <div className="profile-stats-container fade-in">
            <div className="profile-stat-box-modern">
                <div className="stat-icon-wrapper heart">
                    <Heart size={18} fill="currentColor" />
                </div>
                <div className="stat-content">
                    <span className="stat-number">{favoritesCount}</span>
                    <span className="stat-label">Saved</span>
                </div>
            </div>

            <div className="stat-vertical-line"></div>

            <div className="profile-stat-box-modern">
                <div className="stat-icon-wrapper star">
                    <MessageSquare size={18} fill="currentColor" />
                </div>
                <div className="stat-content">
                    <span className="stat-number">{reviewsCount}</span>
                    <span className="stat-label">Reviews</span>
                </div>
            </div>
        </div>
    );
};

export default ProfileStats;
