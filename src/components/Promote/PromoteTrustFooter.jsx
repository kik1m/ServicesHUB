import React, { memo } from 'react';
import { ShieldCheck, CheckCircle2, Lock, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './PromoteTrustFooter.module.css';

/**
 * PromoteTrustFooter - Slim Elite Trust Component
 * Rule #14: Constant-driven content SSOT
 * Rule #11.1: Zero-Shift Skeleton Standard
 */
const PromoteTrustFooter = ({ isLoading, error, onRetry, content }) => {
    if (isLoading) {
        return (
            <footer className={styles.trustFooter}>
                <div className={styles.skeletonContainer}>
                    <Skeleton width="60px" height="60px" borderRadius="18px" />
                    <Skeleton width="280px" height="24px" />
                    <div className={styles.skeletonBadges}>
                        <Skeleton width="120px" height="16px" borderRadius="100px" />
                        <Skeleton width="120px" height="16px" borderRadius="100px" />
                        <Skeleton width="120px" height="16px" borderRadius="100px" />
                    </div>
                </div>
            </footer>
        );
    }

    // Defensive Check - Rule #32
    if (!content) return null;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <footer className={styles.trustFooter}>
                <div className={styles.trustCard}>
                    <div className={styles.iconWrapper}>
                        <ShieldCheck size={36} className={styles.shieldIcon} />
                        <div className={styles.pulse} />
                    </div>
                    
                    <div className={styles.content}>
                        <h3 className={styles.title}>{content?.title}</h3>
                        <p className={styles.description}>
                            Transactions are encrypted and processed by <strong>Lemon Squeezy</strong>. 
                            We never store your credit card information.
                        </p>
                        
                        <div className={styles.badgesRow}>
                            <div className={`${styles.badgeItem} ${styles.badgeSecure}`}>
                                <CheckCircle2 size={14} /> 
                                <span>{content?.badges?.secure}</span>
                            </div>
                            <div className={`${styles.badgeItem} ${styles.badgeCompliance}`}>
                                <Lock size={14} /> 
                                <span>{content?.badges?.compliance}</span>
                            </div>
                            <div className={`${styles.badgeItem} ${styles.badgeGrowth}`}>
                                <Zap size={14} /> 
                                <span>{content?.badges?.growth}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </Safeguard>
    );
};

export default memo(PromoteTrustFooter);
