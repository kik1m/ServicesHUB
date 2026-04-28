import React from 'react';
import { useParams } from 'react-router-dom';
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

    const {
        profile,
        tools,
        isLoading,
        error,
        notFound,
        copied,
        handleCopyLink,
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
                        handleCopyLink={handleCopyLink} 
                        copied={copied} 
                        isLoading={isLoading}
                        error={error}
                        onRetry={refetch}
                    />

                    <ProfilePortfolio 
                        tools={tools} 
                        isLoading={isLoading}
                        error={error}
                        onRetry={refetch}
                    />
            </div>
        </div>
    );
};

export default PublicProfile;
