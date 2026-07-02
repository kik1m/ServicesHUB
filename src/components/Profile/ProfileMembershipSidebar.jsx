import React, { memo } from 'react';
import { ShieldCheck, Zap, Settings } from 'lucide-react';
import Link from 'next/link';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileMembershipSidebar.module.css';

/**
 * ProfileMembershipSidebar - Elite v2.2 (Compact)
 * Optimized size and centered settings button per USER request.
 */
const ProfileMembershipSidebar = memo(({ profile, isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="Membership Service Offline">
            <div className={`${styles.sidebarCard} ${styles.compactCard}`}>
                <div className={styles.sidebarTitle}>
                    <ShieldCheck size={20} />
                    <h3>{content?.TITLE || "Membership"}</h3>
                </div>

                <div className={`${styles.membershipCardContent} ${profile?.is_premium ? styles.premium : ''}`}>
                    <div className={styles.iconBox}>
                        <Zap size={20} className={profile?.is_premium ? styles.premiumIcon : ''} />
                    </div>
                    <div className={styles.membershipInfo}>
                        {isLoading ? (
                            <>
                                <Skeleton className={styles.skeletonPlanTitle} />
                                <Skeleton className={styles.skeletonPlanDesc} />
                            </>
                        ) : (
                            <>
                                <div className={styles.membershipTitle}>
                                    {profile?.is_premium ? (
                                        profile?.subscription_tier === 'elite' ? 'Elite Member' : 'Pro Member'
                                    ) : (content?.FREE_LABEL || "Free Member")}
                                </div>
                                <p>{profile?.is_premium ? "Active Monthly Subscription" : "Standard Access"}</p>
                            </>
                        )}
                    </div>
                </div>

                <div className={styles.actionArea}>
                    {!profile?.is_premium && !isLoading && (
                        <Button 
                            as={Link} 
                            href="/premium" 
                            variant="primary" 
                            fullWidth 
                            className={styles.upgradeBtn}
                        >
                            {content?.UPGRADE_BTN || "Upgrade Now"}
                        </Button>
                    )}

                    {profile?.is_premium && !isLoading && (
                        <div className={`${styles.premiumStatusBadge} ${profile.subscription_tier === 'elite' ? styles.eliteBadge : ''}`}>
                            {profile.subscription_tier === 'elite' ? 'ELITE SUPREME ACCESS' : 'PRO ACCESS ACTIVE'}
                        </div>
                    )}
                </div>

                <div className={styles.centeredFooter}>
                    <Button 
                        as={Link} 
                        href="/settings" 
                        variant="ghost" 
                        size="sm" 
                        className={styles.settingsBtnCentered}
                        icon={Settings}
                    >
                        Account Settings
                    </Button>
                </div>
            </div>
        </Safeguard>
    );
});

export default ProfileMembershipSidebar;
