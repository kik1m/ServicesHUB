import React from 'react';
import { CreditCard, Sparkles } from 'lucide-react';
import styles from './SettingsBilling.module.css';

const SettingsBilling = ({ profile }) => {
    const isPremium = profile.is_premium;

    return (
        <div className={styles.fadeIn}>
            <div className={`${styles.settingsCard} ${styles.billingStatusContainer}`}>
                <div className={`${styles.billingIconBox} ${isPremium ? styles.premiumActive : ''}`}>
                    {isPremium ? <Sparkles size={40} className={styles.glowIcon} /> : <CreditCard size={40} />}
                </div>

                <div className={styles.billingTextContent}>
                    <h3>
                        {isPremium ? 'Premium Subscription Active' : 'Subscription Plan'}
                    </h3>
                    
                    <p className={styles.billingDescription}>
                        {isPremium ? (
                            <>
                                You are currently on the <span className={styles.premiumTextGlow}>Premium</span> plan. 
                                Enjoy full access to professional tools, featured listings, and priority support.
                            </>
                        ) : (
                            <>
                                You are currently on the <span className={styles.freeTextHighlight}>Free</span> plan. 
                                Upgrade to unlock premium features and increase your visibility.
                            </>
                        )}
                    </p>

                    {!isPremium ? (
                        <a href="/premium" className={styles.btnPremiumUpgrade}>
                            <Sparkles size={18} /> Upgrade Account
                        </a>
                    ) : (
                        <div className={styles.premiumStatusBadge}>
                            <Sparkles size={16} /> Verified Premium Member
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsBilling;
