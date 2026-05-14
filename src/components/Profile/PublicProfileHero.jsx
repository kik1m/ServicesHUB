import React, { memo, useMemo, useState } from 'react';
import { Sparkles, Calendar, Globe, Twitter, Github, Linkedin, Share2, Check, LayoutGrid, Heart, Users, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import SocialListModal from './SocialListModal';
import styles from './PublicProfileHero.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * PublicProfileHero - Elite Standard Component
 * Rule #29: Pure View with Safeguard protection
 * Rule #32: Defensive Programming
 */
const PublicProfileHero = React.memo(({ profile, toolCount, favCount, isFollowing, isOwner, onFollow, handleCopyLink, copied, isLoading, error, onRetry }) => {
    const labels = PROFILE_UI_CONSTANTS.public.hero;
    const [socialModal, setSocialModal] = useState({ isOpen: false, type: 'followers', title: '' });
    const [isHoveringFollow, setIsHoveringFollow] = useState(false);

    // Elite Date Formatting Logic
    const formattedJoinDate = React.useMemo(() => {
        // Primary source: created_at from DB
        // Secondary source: joinYear from sanitized service data
        const rawDate = profile?.created_at || (profile?.joinYear ? `${profile.joinYear}-01-01` : null);
        
        if (!rawDate && !isLoading) {
            // Final Fallback for new accounts without timestamp yet
            const now = new Date();
            const month = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
            const year = now.getFullYear();
            return `${month} ${year}`;
        }

        if (!rawDate) return null;

        const date = new Date(rawDate);
        const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
        const year = date.getFullYear();
        return `${month} ${year}`;
    }, [profile?.created_at, profile?.joinYear, isLoading]);

    const openSocialModal = (type) => {
        setSocialModal({
            isOpen: true,
            type,
            title: type === 'followers' ? 'Followers' : 'Following'
        });
    };

    return (
        <Safeguard error={error} onRetry={onRetry} title="Identity Load Failed">
            <div className={`${styles.publicHeroCard} fade-in`}>
                <div className={styles.etherealGlow}></div>

                <div className={styles.heroFlexLayout}>
                    {/* 1. Profile Core Identity Section */}
                    <div className={styles.identityColumn}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatarGlow}></div>
                            <div className={`${styles.avatarBox} ${isLoading ? styles.loadingBox : ''}`}>
                                {isLoading ? (
                                    <Skeleton width="140px" height="140px" borderRadius="32px" />
                                ) : (
                                    <SmartImage 
                                        src={profile?.avatar_url} 
                                        alt={profile?.full_name} 
                                        fallbackText={profile?.full_name?.charAt(0).toUpperCase()}
                                    />
                                )}
                            </div>
                            {!isLoading && (profile?.is_verified || profile?.is_premium || profile?.role?.toLowerCase() === 'admin') && (
                                <div className={`${styles.verificationBadge} ${profile?.role?.toLowerCase() === 'admin' ? styles.adminBadgeGlow : ''}`}>
                                    <Sparkles size={16} fill="currentColor" />
                                </div>
                            )}
                        </div>

                        <div className={styles.contentStack}>
                            <div className={styles.mainIdentityInfo}>
                                <div className={styles.nameBadgesRow}>
                                    {isLoading ? (
                                        <Skeleton width="220px" height="32px" borderRadius="8px" />
                                    ) : (
                                        <>
                                            <h1 className={styles.userName}>{profile?.full_name}</h1>
                                            {(profile?.role?.toLowerCase() === 'admin' || profile?.is_verified) && (
                                                <Sparkles size={22} className={styles.nameSparkle} fill="#ffcc00" />
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className={styles.identityBadgesRow}>
                                    {isLoading ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Skeleton width="80px" height="26px" borderRadius="100px" />
                                            <Skeleton width="110px" height="26px" borderRadius="100px" />
                                        </div>
                                    ) : (
                                        <>
                                            <span className={`${styles.rolePill} ${profile?.role?.toLowerCase() === 'admin' ? styles.adminPill : ''}`}>
                                                {profile?.role?.toUpperCase() || 'MEMBER'}
                                            </span>
                                            <span className={styles.datePill}>
                                                <Calendar size={12} /> JOINED {formattedJoinDate || 'RECENTLY'}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.statsAndBio}>
                                <div className={styles.socialCountsRow}>
                                    {isLoading ? (
                                        <Skeleton width="160px" height="20px" />
                                    ) : (
                                        <>
                                            <div 
                                                className={`${styles.socialStat} ${!isLoading ? styles.clickableStat : ''}`}
                                                onClick={() => !isLoading && openSocialModal('followers')}
                                            >
                                                <span className={styles.socialCount}>{profile?.followers_count || 0}</span>
                                                <span className={styles.socialLabel}>Followers</span>
                                            </div>
                                            <div className={styles.dividerSmall}></div>
                                            <div 
                                                className={`${styles.socialStat} ${!isLoading ? styles.clickableStat : ''}`}
                                                onClick={() => !isLoading && openSocialModal('following')}
                                            >
                                                <span className={styles.socialCount}>{profile?.following_count || 0}</span>
                                                <span className={styles.socialLabel}>Following</span>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className={styles.bioStatement}>
                                    {isLoading ? (
                                        <Skeleton width="100%" height="20px" count={2} />
                                    ) : (
                                        profile?.bio || labels?.defaultBio
                                    )}
                                </div>
                            </div>

                            <div className={styles.socialMinimalRow}>
                                {isLoading ? (
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Skeleton circle width="32px" height="32px" />
                                        <Skeleton circle width="32px" height="32px" />
                                    </div>
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
                        <div className={styles.statFlexGroup}>
                            <div className={styles.statMinimalPill}>
                                <LayoutGrid size={18} className="gradient-text-icon" />
                                <span className={styles.statValue}>
                                    {isLoading ? <Skeleton width="24px" height="20px" /> : (toolCount ?? 0)}
                                </span>
                                <span className={styles.statLabel}>Published</span>
                            </div>
                            <div className={styles.statMinimalPill}>
                                <Heart size={18} className={styles.favIcon} />
                                <span className={styles.statValue}>
                                    {isLoading ? <Skeleton width="24px" height="20px" /> : (favCount ?? 0)}
                                </span>
                                <span className={styles.statLabel}>Favorites</span>
                            </div>
                        </div>

                        <div className={styles.buttonActionRow}>
                            {isLoading ? (
                                <>
                                    <Skeleton width="140px" height="48px" borderRadius="16px" />
                                    <Skeleton width="140px" height="48px" borderRadius="16px" />
                                </>
                            ) : (
                                <>
                                    {!isOwner && (
                                        <Button 
                                            onClick={onFollow} 
                                            onMouseEnter={() => setIsHoveringFollow(true)}
                                            onMouseLeave={() => setIsHoveringFollow(false)}
                                            className={`${styles.followBtn} ${isFollowing ? styles.following : ''}`}
                                            variant={isFollowing ? (isHoveringFollow ? "error" : "outline") : "primary"}
                                            icon={isFollowing ? (isHoveringFollow ? UserMinus : UserCheck) : UserPlus}
                                            size="md"
                                        >
                                            {isFollowing ? (isHoveringFollow ? 'Unfollow' : 'Following') : 'Follow'}
                                        </Button>
                                    )}

                                    <Button 
                                        onClick={handleCopyLink} 
                                        className={`${styles.shareBtn} ${copied ? styles.copied : ''} ${isOwner ? styles.fullWidthBtn : ''}`}
                                        icon={copied ? Check : Share2}
                                        variant={copied ? "success" : "white"}
                                        size="md"
                                    >
                                        {copied ? labels?.copiedBtn : labels?.shareBtn}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Social Lists Modal */}
                <SocialListModal 
                    isOpen={socialModal.isOpen}
                    onClose={() => setSocialModal(prev => ({ ...prev, isOpen: false }))}
                    userId={profile?.id}
                    type={socialModal.type}
                    title={socialModal.title}
                />
            </div>
        </Safeguard>
    );
});

export default PublicProfileHero;
