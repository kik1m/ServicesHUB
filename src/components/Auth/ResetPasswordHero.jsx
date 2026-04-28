import React, { memo } from 'react';
import Logo from '../Logo';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ResetPasswordHero.module.css';

/**
 * ResetPasswordHero - Elite Header component
 * Rule #11: Visual consistency with Auth module
 */
const ResetPasswordHero = memo(({ content, isLoading, error, onRetry }) => {
    if (isLoading) {
        return (
            <div className={styles.headerGroup}>
                <div className={styles.logoWrapper}>
                    <Skeleton className={styles.skeletonLogo} />
                </div>
                <Skeleton className={styles.skeletonTitle} />
                <Skeleton className={styles.skeletonSubtitle} />
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.headerGroup}>
                <div className={styles.logoWrapper}>
                    <Logo size={42} className={styles.centeredLogo} />
                </div>
                <h1 className={styles.title}>
                    {content?.title?.split('New Password')[0]}
                    <span className="gradient-text">New Password</span>
                </h1>
                <p className={styles.subtitle}>{content?.subtitle}</p>
            </div>
        </Safeguard>
    );
});

export default ResetPasswordHero;
