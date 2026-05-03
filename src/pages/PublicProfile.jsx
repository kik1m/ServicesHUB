import React from 'react';
import { useParams } from 'react-router-dom';
import { Heart, LayoutGrid } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { usePublicProfileData } from '../hooks/usePublicProfileData';
import Breadcrumbs from '../components/Breadcrumbs';

// Import Modular Components
import PublicProfileHero from '../components/Profile/PublicProfileHero';
import ProfilePortfolio from '../components/Profile/ProfilePortfolio';
import ProfileNotFound from '../components/Profile/ProfileNotFound';
import Safeguard from '../components/ui/Safeguard';

// Import Constants & Styles
import { PROFILE_UI_CONSTANTS } from '../constants/profileConstants';
import styles from './PublicProfile.module.css';

/**
 * PublicProfile Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const PublicProfile = () => {
    const { id } = useParams();
    const constants = PROFILE_UI_CONSTANTS.public;
    const [activeTab, setActiveTab] = React.useState('published'); // 'published' | 'favorites'

    const {
        profile,
        tools,
        favorites,
        isFollowing,
        isOwner,
        isLoading,
        error,
        notFound,
        copied,
        handleCopyLink,
        handleFollow,
        refetch
    } = usePublicProfileData(id);

    // 1. SEO Hardening (v2.0)
    useSEO({
        title: profile?.full_name ? `${profile.full_name}'s Profile` : 'Member Profile',
        description: profile?.bio || `View ${profile?.full_name || 'this member'}'s curated tools and contributions on HUBly.`,
        image: profile?.avatar_url
    });

    if (notFound && !isLoading) {
        return <ProfileNotFound />;
    }

    return (
        <div className={styles.publicProfileView}>
            <div className={styles.publicContainer}>
                <Breadcrumbs 
                    items={constants.breadcrumbs(profile?.full_name)} 
                    isLoading={isLoading}
                />

                <PublicProfileHero 
                    profile={profile} 
                    toolCount={tools.length} 
                    favCount={favorites.length}
                    isFollowing={isFollowing}
                    isOwner={isOwner}
                    onFollow={handleFollow}
                    handleCopyLink={handleCopyLink} 
                    copied={copied} 
                    isLoading={isLoading}
                    error={error}
                    onRetry={refetch}
                />

                <div className={styles.publicContentGrid}>
                    <div className={styles.tabsHeaderRow}>
                        <div className={styles.tabsNav}>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'published' ? styles.active : ''}`}
                                onClick={() => setActiveTab('published')}
                            >
                                Published Tools ({tools.length})
                            </button>
                            <button 
                                className={`${styles.tabBtn} ${activeTab === 'favorites' ? styles.active : ''}`}
                                onClick={() => setActiveTab('favorites')}
                            >
                                Favorite Collection ({favorites.length})
                            </button>
                        </div>

                        <div className={styles.statsQuickLook}>
                            <div className={styles.quickStat}>
                                <div className={styles.statIconBox}>
                                    <LayoutGrid size={16} />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNum}>{tools.length}</span>
                                    <span className={styles.statLabel}>PUBLISHED</span>
                                </div>
                            </div>
                            <div className={styles.quickStat}>
                                <div className={styles.statIconBox} style={{ background: 'rgba(255, 71, 87, 0.1)', color: '#ff4757' }}>
                                    <Heart size={16} fill="currentColor" />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statNum}>{favorites.length}</span>
                                    <span className={styles.statLabel}>SAVED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.tabContentArea}>
                        {activeTab === 'published' ? (
                            <div className="fade-in">
                                <ProfilePortfolio 
                                    tools={tools} 
                                    isLoading={isLoading}
                                    error={error}
                                    onRetry={refetch}
                                />
                            </div>
                        ) : (
                            <div className="fade-in">
                                <ProfilePortfolio 
                                    tools={favorites} 
                                    isLoading={isLoading}
                                    content={{ emptyMessage: "No favorites saved yet" }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
