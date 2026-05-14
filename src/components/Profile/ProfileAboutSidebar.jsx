import React, { memo } from 'react';
import { Twitter, Github, Linkedin, User } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileAboutSidebar.module.css';

/**
 * ProfileAboutSidebar - Elite v2.2 (Simplified)
 * Removed Identity & Reach per USER request.
 * Focused on Bio and Social Presence.
 */
const ProfileAboutSidebar = memo(({ profile, isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="About Service Offline">
            <div className={styles.sidebarCard}>
                <div className={styles.sidebarTitle}>
                    <User size={20} />
                    <h3>{content?.TITLE || "About"}</h3>
                </div>

                {/* Bio Section - Primary Focus */}
                {!isLoading && profile?.bio ? (
                    <p className={styles.bioText}>{profile?.bio}</p>
                ) : !isLoading && (
                    <p className={styles.bioTextEmpty}>No bio information available.</p>
                )}

                {isLoading && <Skeleton className={styles.skeletonBio} />}

                <span className={styles.sidebarSubtitle}>Social Presence</span>
                <div className={styles.socialLinksGrid}>
                    {isLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className={styles.socialBoxSlim} />
                        ))
                    ) : (
                        <>
                            {profile?.social_twitter && (
                                <a href={profile?.social_twitter} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Twitter size={18} /></a>
                            )}
                            {profile?.social_github && (
                                <a href={profile?.social_github} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Github size={18} /></a>
                            )}
                            {profile?.social_linkedin && (
                                <a href={profile?.social_linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialBoxSlim}><Linkedin size={18} /></a>
                            )}
                            {!profile?.social_twitter && !profile?.social_github && !profile?.social_linkedin && (
                                <p className={styles.noSocials}>No social links connected</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Safeguard>
    );
});

export default ProfileAboutSidebar;
