import React from 'react';

const ProfileTabs = ({ activeTab, setActiveTab, favoritesCount, reviewsCount = 0 }) => {
    return (
        <div className="profile-tabs-nav">
            <button
                onClick={() => setActiveTab('favorites')}
                className={`profile-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            >
                My Collection ({favoritesCount})
            </button>
            <button
                onClick={() => setActiveTab('reviews')}
                className={`profile-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            >
                My Reviews ({reviewsCount})
            </button>
        </div>
    );
};

export default ProfileTabs;
