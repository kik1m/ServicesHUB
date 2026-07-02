import React, { memo } from 'react';
import { ShieldCheck, Sparkles, Zap, Calendar, LayoutDashboard, ExternalLink } from 'lucide-react';
import Link from 'next/link';
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
                            <div className={`${styles.avatarBox} ${isLoading ? styles.loadingBox : ''}`}>
                                {isLoading ? (
                                    <Skeleton width="100px" height="100px" borderRadius="24px" />
                                ) : (
                                    <SmartImage 
                                        src={profile?.avatar_url} 
                                        alt={profile?.full_name || 'Member'}
                                        className={styles.avatarImage}
                                        fallbackText={profile?.full_name?.charAt(0)}
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
                                    <Skeleton width="180px" height="32px" borderRadius="8px" />
                                ) : (
                                    <>
                                        <h1 className={styles.nameText}>{profile?.full_name || labels?.DEFAULT_NAME || 'Member'}</h1>
                                        {(profile?.is_premium || profile?.role?.toLowerCase() === 'admin') && <Zap size={20} className={styles.premiumIcon} />}
                                    </>
                                )}
                            </div>

                            <div className={styles.metaPillGroup}>
                                {isLoading ? (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Skeleton width="70px" height="26px" borderRadius="100px" />
                                        <Skeleton width="100px" height="26px" borderRadius="100px" />
                                    </div>
                                ) : (
                                    <>
                                        <span className={`${styles.pill} ${styles.role}`}>{profile?.role || labels?.DEFAULT_ROLE || 'Member'}</span>
                                        <span className={`${styles.pill} ${styles.date}`}>
                                            <Calendar size={12} /> Joined {profile?.joinYear || new Date().getFullYear()}
                                        </span>
                                    </>
                                )}
                            </div>
                            
                            <div className={styles.bioContainer}>
                                {isLoading ? (
                                    <Skeleton width="240px" height="18px" borderRadius="4px" />
                                ) : (
                                    profile?.bio && <span className={styles.pillBio}>{profile.bio}</span>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={styles.quickActions}>
                            {isLoading ? (
                                <>
                                    <Skeleton width="136px" height="48px" borderRadius="16px" />
                                    <Skeleton width="136px" height="48px" borderRadius="16px" />
                                </>
                            ) : (
                                <>
                                    <Button 
                                        as={Link} 
                                        href="/dashboard" 
                                        variant="outline" 
                                        className={`${styles.btnAction} ${styles.secondary}`}
                                        icon={LayoutDashboard}
                                        iconSize={14}
                                    >
                                        {labels?.DASHBOARD || "Dashboard"}
                                    </Button>
                                    <Button 
                                        as={Link} 
                                        href={`/u/${profile?.id}`} 
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
