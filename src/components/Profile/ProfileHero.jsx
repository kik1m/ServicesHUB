import React, { memo } from 'react';
import { ShieldCheck, Sparkles, Calendar, LayoutDashboard, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import { PROFILE_CONSTANTS } from '../../constants/profileConstants';
import styles from './ProfileHero.module.css';

/**
 * ProfileHero - Component 1/10
 * Rule #29: Pure View with Safeguard protection
 */
const ProfileHero = memo(({ profile, isLoading, error, onRetry, onSignOut, content }) => {
    const labels = content || PROFILE_CONSTANTS.HERO;

    return (
        <Safeguard error={error} onRetry={onRetry} title="Profile Access Error">
            <div className={`${styles.heroCard} fade-in`}>
                {!profile && !isLoading ? (
                    <EmptyState 
                        message="Profile Not Found" 
                        description="The requested profile could not be located."
                    />
                ) : (
                    <div className={styles.heroFlex}>
                        {/* Avatar Section */}
                        <div className={styles.avatarWrapper}>
                            <div className={styles.avatarBox}>
                                {isLoading ? (
                                    <Skeleton className={styles.skeletonAvatar} />
                                ) : (
                                    <SmartImage 
                                        src={profile?.avatar_url} 
                                        alt={profile?.full_name || 'Member'}
                                        className={styles.avatarImage}
                                    />
                                )}
                            </div>
                            {!isLoading && profile?.is_verified && (
                                <div className={styles.verificationMark}>
                                    <ShieldCheck size={18} color="#0099ff" />
                                </div>
                            )}
                        </div>

                        {/* Info Text Section */}
                        <div className={styles.infoStack}>
                            <div className={styles.titleRow}>
                                {isLoading ? (
                                    <Skeleton className={styles.skeletonName} />
                                ) : (
                                    <>
                                        <h1 className={styles.nameText}>{profile?.full_name || labels?.DEFAULT_NAME || 'Member'}</h1>
                                        {profile?.is_premium && <Sparkles size={20} className={styles.premiumIcon} />}
                                    </>
                                )}
                            </div>

                            <div className={styles.metaPillGroup}>
                                {isLoading ? (
                                    <>
                                        <Skeleton className={styles.skeletonPill} />
                                        <Skeleton className={styles.skeletonPillLarge} />
                                    </>
                                ) : (
                                    <>
                                        <span className={`${styles.pill} ${styles.role}`}>{profile?.role || labels?.DEFAULT_ROLE || 'Member'}</span>
                                        <span className={`${styles.pill} ${styles.date}`}>
                                            <Calendar size={12} /> Joined {profile?.joinYear || new Date().getFullYear()}
                                        </span>
                                    </>
                                )}
                            </div>
                            
                            {isLoading ? (
                                <div className={styles.skeletonMargin}>
                                    <Skeleton className={styles.skeletonBio} />
                                </div>
                            ) : (
                                profile?.bio && <span className={styles.pillBio}>{profile.bio}</span>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className={styles.quickActions}>
                            {isLoading ? (
                                <>
                                    <Skeleton className={styles.skeletonButton} />
                                    <Skeleton className={styles.skeletonButton} />
                                </>
                            ) : (
                                <>
                                    <Button 
                                        as={Link} 
                                        to="/dashboard" 
                                        variant="outline" 
                                        className={`${styles.btnAction} ${styles.secondary}`}
                                        icon={LayoutDashboard}
                                        iconSize={14}
                                    >
                                        {labels?.DASHBOARD || "Dashboard"}
                                    </Button>
                                    <Button 
                                        as={Link} 
                                        to={`/u/${profile?.id || profile?.slug}`} 
                                        variant="primary" 
                                        className={`${styles.btnAction} ${styles.primary}`}
                                        icon={ExternalLink}
                                        iconSize={14}
                                    >
                                        {labels?.VIEW_PUBLIC || "View Public"}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Safeguard>
    );
});

export default ProfileHero;
