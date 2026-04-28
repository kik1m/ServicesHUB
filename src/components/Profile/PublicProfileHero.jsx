import React, { memo } from 'react';
import { ShieldCheck, Calendar, Globe, Twitter, Github, Linkedin, Share2, Check, LayoutGrid } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './PublicProfileHero.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * PublicProfileHero - Elite Standard Component
 * Rule #29: Pure View with Safeguard protection
 * Rule #32: Defensive Programming
 */
const PublicProfileHero = memo(({ profile, toolCount, handleCopyLink, copied, isLoading, error, onRetry }) => {
    const labels = PROFILE_UI_CONSTANTS.public.hero;

    return (
        <Safeguard error={error} onRetry={onRetry} title="Identity Load Failed">
            <div className={`${styles.publicHeroCard} fade-in`}>
                <div className={styles.etherealGlow}></div>

                <div className={styles.heroFlexLayout}>
                    {/* 1. Profile Core Identity Section */}
                    <div className={styles.identityColumn}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatarGlow}></div>
                            <div className={styles.avatarBox}>
                                {isLoading ? (
                                    <Skeleton className={styles.skeletonAvatar} />
                                ) : (
                                    <SmartImage 
                                        src={profile?.avatar_url} 
                                        alt={profile?.full_name} 
                                        fallbackText={profile?.full_name?.charAt(0).toUpperCase()}
                                    />
                                )}
                            </div>
                            {!isLoading && profile?.is_verified && (
                                <div className={styles.verificationBadge}>
                                    <ShieldCheck size={18} />
                                </div>
                            )}
                        </div>

                        <div className={styles.contentStack}>
                            <div className={styles.nameBadgesRow}>
                                {isLoading ? (
                                    <Skeleton className={styles.skeletonName} />
                                ) : (
                                    <>
                                        <h1 className={styles.userName}>{profile?.full_name}</h1>
                                        <span className={`${styles.pill} ${styles.rolePill}`}>
                                            {profile?.role || labels?.defaultRole}
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className={styles.metaInfoRow}>
                                {isLoading ? (
                                    <>
                                        <Skeleton className={styles.skeletonMeta} />
                                        <Skeleton className={styles.skeletonMeta} />
                                    </>
                                ) : (
                                    <>
                                        <span className={styles.metaItem}>
                                            <Calendar size={14} /> {labels?.joined} {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2026'}
                                        </span>
                                        {profile?.website && (
                                            <a href={profile?.website} target="_blank" rel="noopener noreferrer" className={`${styles.metaItem} ${styles.webLink}`}>
                                                <Globe size={14} /> {labels?.website}
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={styles.bioStatement}>
                                {isLoading ? (
                                    <>
                                        <Skeleton className={styles.skeletonBioLine1} />
                                        <Skeleton className={styles.skeletonBioLine2} />
                                    </>
                                ) : (
                                    profile?.bio || labels?.defaultBio
                                )}
                            </div>

                            <div className={styles.socialMinimalRow}>
                                {isLoading ? (
                                    Array.from({ length: 2 }).map((_, i) => (
                                        <Skeleton key={`public-hero-social-${i}`} className={styles.skeletonSocialIcon} />
                                    ))
                                ) : (
                                    <>
                                        {profile?.twitter && <a href={`https://twitter.com/${profile?.twitter}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Twitter"><Twitter size={16} /></a>}
                                        {profile?.github && <a href={`https://github.com/${profile?.github}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Github"><Github size={16} /></a>}
                                        {profile?.linkedin && <a href={`https://linkedin.com/in/${profile?.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="LinkedIn"><Linkedin size={16} /></a>}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Actions & Minimal Stats Section */}
                    <div className={styles.actionsAnalyticsHub}>
                        <div className={styles.statMinimalPill}>
                            <LayoutGrid size={18} className="gradient-text-icon" />
                            <span className={styles.statValue}>
                                {isLoading ? <Skeleton className={styles.skeletonStatValue} /> : (toolCount ?? 0)}
                            </span>
                            <span className={styles.statLabel}>{labels?.statsLabel}</span>
                        </div>

                        <Button 
                            onClick={handleCopyLink} 
                            className={`${styles.shareBtn} ${copied ? styles.copied : ''}`}
                            icon={copied ? Check : Share2}
                            variant={copied ? "success" : "white"}
                            size="md"
                            disabled={isLoading}
                        >
                            {copied ? labels?.copiedBtn : labels?.shareBtn}
                        </Button>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default PublicProfileHero;
