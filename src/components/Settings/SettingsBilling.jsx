import React, { memo } from 'react';
import { CreditCard, Sparkles } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import styles from './SettingsBilling.module.css';

/**
 * SettingsBilling - Elite Hardened Card
 * Rule #18: Memoized
 */
const SettingsBilling = memo(({ profile, isLoading, content }) => {
    if (isLoading) {
        return (
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <div className={styles.billingStatusContainer}>
                        <Skeleton className={styles.skeletonIcon} />
                        <div className={styles.billingTextContent}>
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonDescLine1} />
                            <Skeleton className={styles.skeletonDescLine2} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isPremium = profile?.is_premium;

    return (
        <div className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <div className={styles.billingStatusContainer}>
                    <div className={`${styles.billingIconBox} ${isPremium ? styles.premiumActive : ''}`}>
                        {isPremium ? <Sparkles size={40} className={styles.glowIcon} /> : <CreditCard size={40} />}
                    </div>

                    <div className={styles.billingTextContent}>
                        <h3>
                            {isPremium ? content.premiumActiveTitle : content.title}
                        </h3>
                        
                        <p className={styles.billingDescription}>
                            {isPremium ? content.premiumActiveDesc : content.freeDesc}
                        </p>

                        {!isPremium ? (
                            <Button 
                                as="a"
                                href="/premium" 
                                className={styles.btnPremiumUpgrade}
                                icon={Sparkles}
                            >
                                {content.upgradeBtn}
                            </Button>
                        ) : (
                            <div className={styles.premiumStatusBadge}>
                                <Sparkles size={16} /> {content.verifiedBadge}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SettingsBilling;
