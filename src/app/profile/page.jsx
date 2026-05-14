'use client';
import React, { useMemo } from 'react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useProfileData } from '../../hooks/useProfileData';

// Import Global Components
import ProfileHero from '../../components/Profile/ProfileHero';
import ProfileStats from '../../components/Profile/ProfileStats';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import ProfileCollections from '../../components/Profile/ProfileCollections';
import ProfileAboutSidebar from '../../components/Profile/ProfileAboutSidebar';
import ProfileMembershipSidebar from '../../components/Profile/ProfileMembershipSidebar';
import ProfileReviewsEmpty from '../../components/Profile/ProfileReviewsEmpty';
import Safeguard from '../../components/ui/Safeguard';

// Import Modular CSS
import styles from './Profile.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * Profile Page Orchestrator (Next.js Client Version)
 */
export default function ProfilePage() {
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

    // Handle initial loading state to prevent flicker
    if (loading && !profile) {
        return (
            <div className={styles.profilePage}>
                <div className={styles.profileContainer}>
                    <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} isLoading={true} />
                    <div className={styles.heroSkeleton}>
                        {/* Hero Skeleton will be handled by ProfileHero internally or via its loading prop */}
                    </div>
                </div>
            </div>
        );
    }

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
}
