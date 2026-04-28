import React, { memo } from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Star } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import styles from './PromoteTrustFooter.module.css';

/**
 * PromoteTrustFooter - Slim Elite Trust Component
 * Rule #14: Constant-driven content SSOT
 * Rule #11.1: Zero-Shift Skeleton Standard
 */
const PromoteTrustFooter = ({ isLoading, content }) => {
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
        <footer className={styles.trustFooter}>
            <div className={styles.iconWrapper}>
                <ShieldCheck size={32} />
            </div>
            
            <h3 className={styles.title}>{content.title}</h3>
            
            <div className={styles.badgesRow}>
                <div className={`${styles.badgeItem} ${styles.badgeSecure}`}>
                    <CheckCircle2 size={16} /> 
                    <span>{content.badges?.secure || 'Secure Payments'}</span>
                </div>
                <div className={`${styles.badgeItem} ${styles.badgeGrowth}`}>
                    <TrendingUp size={16} /> 
                    <span>{content.badges?.growth || 'Instant Growth'}</span>
                </div>
                <div className={`${styles.badgeItem} ${styles.badgeSupport}`}>
                    <Star size={16} /> 
                    <span>{content.badges?.support || 'Elite Support'}</span>
                </div>
            </div>
        </footer>
    );
};

export default memo(PromoteTrustFooter);
