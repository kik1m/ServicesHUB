'use client';
import React, { memo } from 'react';
import { CreditCard, Sparkles, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './SettingsBilling.module.css';

/**
 * SettingsBilling - Elite Hardened Card (Next.js Port)
 */
const SettingsBilling = memo(({ profile, isLoading, error, onRetry }) => {
    if (isLoading) {
        return (
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <div className={styles.billingStatusContainer}>
                        <Skeleton className={styles.skeletonIcon} />
                        <div className={styles.billingTextContent}>
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonDescLine1} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isPremium = profile?.is_premium;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <div className={styles.billingStatusContainer}>
                        <div className={`${styles.billingIconBox} ${isPremium ? styles.premiumActive : ''}`}>
                            {isPremium ? <Zap size={40} className={styles.glowIcon} /> : <CreditCard size={40} />}
                        </div>

                        <div className={styles.billingTextContent}>
                            <h2>
                                {isPremium ? "Premium Membership" : "Free Account"}
                            </h2>
                            
                            <p className={styles.billingDescription}>
                                {isPremium 
                                    ? "You have full access to all elite features and priority AI processing." 
                                    : "Upgrade to premium to unlock advanced AI tools, priority processing, and elite community badges."}
                            </p>

                            {!isPremium ? (
                                <Button 
                                    as="a"
                                    href="/premium" 
                                    className={styles.btnPremiumUpgrade}
                                    icon={Zap}
                                >
                                    Upgrade to Premium
                                </Button>
                            ) : (
                                <div className={styles.premiumStatusBadge}>
                                    <Zap size={16} /> Verified Premium
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default SettingsBilling;
