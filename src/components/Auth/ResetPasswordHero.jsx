'use client';
import React, { memo } from 'react';
import Logo from '../Logo';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ResetPasswordHero.module.css';

/**
 * ResetPasswordHero - Elite Header component (Next.js Port)
 */
const ResetPasswordHero = memo(({ isLoading, error, onRetry }) => {
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
                    <Logo size="lg" />
                </div>
                <h1 className={styles.title}>
                    Set a <span className="gradient-text">New Password</span>
                </h1>
                <p className={styles.subtitle}>Please choose a secure password for your account.</p>
            </div>
        </Safeguard>
    );
});

export default ResetPasswordHero;
