import React from 'react';
import styles from './ProfileTabs.module.css';

const ProfileTabs = ({ activeTab, setActiveTab, favoritesCount, reviewsCount = 0 }) => {
    return (
        <div className={styles.tabsNav}>
            <button
                onClick={() => setActiveTab('favorites')}
                className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
            >
                My Collection ({favoritesCount})
            </button>
            <button
                onClick={() => setActiveTab('reviews')}
                className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.active : ''}`}
            >
                My Reviews ({reviewsCount})
            </button>
        </div>
    );
};

export default ProfileTabs;
