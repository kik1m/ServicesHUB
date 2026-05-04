import React, { useMemo } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import { useProfileData } from '../hooks/useProfileData';
import { getCurrentUrl } from '../utils/getCurrentUrl';

// Import Global Components
import ProfileHero from '../components/Profile/ProfileHero';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileTabs from '../components/Profile/ProfileTabs';
import ProfileCollections from '../components/Profile/ProfileCollections';
import ProfileAboutSidebar from '../components/Profile/ProfileAboutSidebar';
import ProfileMembershipSidebar from '../components/Profile/ProfileMembershipSidebar';
import ProfileReviewsEmpty from '../components/Profile/ProfileReviewsEmpty';
import Safeguard from '../components/ui/Safeguard';

// Import Modular CSS
import styles from './Profile.module.css';
import { PROFILE_UI_CONSTANTS } from '../constants/profileConstants';

/**
 * Profile Page Orchestrator (Elite v2.1 Standard)
 * Rule #16: Stable Coordinator Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Profile = () => {
    const {
        profile,
        user,
        loading,
        favoritesData,
        activeTab,
        setActiveTab,
        handleSignOut,
        totalFavorites,
        refetch
    } = useProfileData();

    // 1. Elite Privacy-First SEO Hardening (v3.0)
    // Rule #34: Private Dashboards MUST be hidden from all search engines
    useSEO({ 
        title: 'User Dashboard | HUBly',
        description: 'Private member area for managing tools, favorites and account settings.',
        noindex: true, // Critical Security: Hide from Google
        ogType: 'website',
        schema: null // Privacy: No structured data for private profiles
    });

    const isReviewsTab = activeTab === 'reviews';

    const TAB_RESOURCES = useMemo(() => ({
        favorites: (
            <ProfileCollections 
                isLoading={favoritesData?.isLoading} 
                favorites={favoritesData?.items?.filter(Boolean) ?? []} 
                error={favoritesData?.error}
                onRetry={refetch}
                content={PROFILE_UI_CONSTANTS.dashboard.collections}
            />
        ),
        reviews: (
            <ProfileReviewsEmpty 
                isActive={isReviewsTab} 
                content={PROFILE_UI_CONSTANTS.dashboard.reviews}
            />
        )
    }), [
        favoritesData?.isLoading, 
        favoritesData?.items, 
        favoritesData?.error, 
        isReviewsTab,
        refetch
    ]);

    const activeTabView = TAB_RESOURCES[activeTab] || null;

    return (
        <div className={styles.profilePage}>
            <div className={styles.profileContainer}>
                <Breadcrumbs 
                    items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} 
                    isLoading={loading && !profile}
                />

                <ProfileHero 
                    profile={profile} 
                    user={user} 
                    onSignOut={handleSignOut} 
                    isLoading={loading}
                    error={favoritesData?.error}
                    onRetry={refetch}
                    content={PROFILE_UI_CONSTANTS.dashboard.hero}
                />

                <div className={styles.profileGridSlim}>
                    <main className={styles.mainContent}>
                        <div className={styles.profileMainHeader}>
                            <ProfileTabs 
                                activeTab={activeTab} 
                                onTabChange={setActiveTab} 
                                favoritesCount={totalFavorites} 
                                isLoading={loading}
                                content={PROFILE_UI_CONSTANTS.dashboard.tabs}
                            />
                            <ProfileStats 
                                favoritesCount={totalFavorites} 
                                reviewsCount={profile?.reviews_count || 0}
                                isLoading={loading}
                                error={favoritesData?.error}
                                content={PROFILE_UI_CONSTANTS.dashboard.stats}
                            />
                        </div>

                        <div className={styles.tabRenderArea}>
                            {activeTabView}
                        </div>
                    </main>

                    <aside className={styles.profileSidebarAside}>
                        <ProfileAboutSidebar 
                            profile={profile} 
                            isLoading={loading}
                            content={PROFILE_UI_CONSTANTS.about}
                        />
                        <ProfileMembershipSidebar 
                            profile={profile} 
                            isLoading={loading}
                            content={PROFILE_UI_CONSTANTS.dashboard.membership}
                        />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Profile;
