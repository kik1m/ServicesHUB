'use client';
import React, { memo } from 'react';
import Logo from '../Logo';
import Skeleton from '../ui/Skeleton';
import styles from './AuthHeader.module.css';

/**
 * AuthHeader - Elite Dynamic Header
 * Optimized for centered hero layout and perfect branding scale
 */
const AuthHeader = memo(({ isLogin, forgotPasswordMode, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className={styles.headerSkeleton}>
                <div className={styles.skeletonLogoWrapper}>
                    <Skeleton className={styles.skeletonLogo} />
                </div>
                <Skeleton className={styles.skeletonTitle} />
                <Skeleton className={styles.skeletonSubtitle} />
            </div>
        );
    }

    return (
        <header className={styles.header}>
            <div className={styles.logoWrapper}>
                <Logo size={42} className={styles.authLogo} />
            </div>
            
            <h1 className={styles.title}>
                {forgotPasswordMode 
                    ? "Reset Password" 
                    : isLogin 
                    ? "Welcome Back" 
                    : "Create Account"}
            </h1>
            
            <p className={styles.subtitle}>
                {forgotPasswordMode 
                    ? "Enter your email to receive a recovery link" 
                    : isLogin 
                    ? "Log in to access your professional dashboard" 
                    : "Join thousands of experts using HUBly every day"}
            </p>

            {error && (
                <div className={styles.errorAlert}>
                    <span>{error}</span>
                </div>
            )}
        </header>
    );
});

export default AuthHeader;
