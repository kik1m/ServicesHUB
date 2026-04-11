import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import { MessageSquare } from 'lucide-react';
import { useProfileData } from '../hooks/useProfileData';

// Import Modular Components
import ProfileHero from '../components/Profile/ProfileHero';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileTabs from '../components/Profile/ProfileTabs';
import ProfileCollections from '../components/Profile/ProfileCollections';
import ProfileAboutSidebar from '../components/Profile/ProfileAboutSidebar';
import ProfileMembershipSidebar from '../components/Profile/ProfileMembershipSidebar';

// Import Modular CSS
import styles from './Profile.module.css';

const Profile = () => {
    const {
        profile,
        user,
        loading,
        favorites,
        activeTab,
        setActiveTab,
        loadingFavorites,
        handleSignOut,
        totalFavorites
    } = useProfileData();

    useSEO({
        title: profile?.full_name ? `${profile.full_name}'s Profile` : 'Member Profile',
        description: `View the profile and favorite tools of ${profile?.full_name || 'a member'} on HUBly.`,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (loading) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.profileContainer}>
                    <SkeletonLoader height="200px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
                    <div className={styles.profileGridSlim}>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} />

                <ProfileHero profile={profile} user={user} handleSignOut={handleSignOut} />

                <div className={styles.profileGridSlim}>
                    {/* Main Content Area */}
                    <main className={styles.mainContent}>
                        <div className={styles.profileMainHeader}>
                            <ProfileTabs 
                                activeTab={activeTab} setActiveTab={setActiveTab} 
                                favoritesCount={totalFavorites} 
                            />
                            <ProfileStats favoritesCount={totalFavorites} />
                        </div>

                        {activeTab === 'favorites' && (
                            <ProfileCollections loadingFavorites={loadingFavorites} favorites={favorites} />
                        )}

                        {activeTab === 'reviews' && (
                            <div className={`glass-card ${styles.emptyStateCard} fade-in`}>
                                <MessageSquare size={64} className={styles.emptyStateIcon} />
                                <h4 className={styles.emptyStateTitle}>No reviews yet</h4>
                                <p className={styles.emptyStateText}>Your feedback helps the community discover the best tools.</p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar Area */}
                    <aside className={`${styles.profileSidebarAside} fade-in`}>
                        <ProfileAboutSidebar profile={profile} />
                        <ProfileMembershipSidebar profile={profile} />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Profile;
