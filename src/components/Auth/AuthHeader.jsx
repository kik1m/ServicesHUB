'use client';
import React, { memo } from 'react';
import Logo from '../Logo';
import Skeleton from '../ui/Skeleton';
import styles from './AuthHeader.module.css';

/**
 * AuthHeader - Elite Dynamic Header
 * Optimized for centered hero layout and perfect branding scale
 */
const AuthHeader = memo(({ 
    isLogin, 
    forgotPasswordMode, 
    isLoading, 
    error,
    lastAttemptedEmail,
    onResendVerification,
    onSendPasswordSetup,
    resendLoading,
    setupLoading
}) => {
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
                <div className={styles.errorAlertContainer}>
                    <div className={styles.errorAlert}>
                        <span>{error}</span>
                    </div>
                    {lastAttemptedEmail && isLogin && error.includes('Invalid credentials') && (
                        <div className={styles.errorActionBox}>
                            <p className={styles.errorActionText}>
                                Logging in with <strong>{lastAttemptedEmail}</strong>? Choose an option:
                            </p>
                            <div className={styles.errorActionButtons}>
                                <button 
                                    className={styles.errorActionBtn} 
                                    onClick={onSendPasswordSetup}
                                    disabled={setupLoading || resendLoading}
                                    type="button"
                                >
                                    {setupLoading ? "Sending Link..." : "Setup Password (Google OAuth users)"}
                                </button>
                                <button 
                                    className={styles.errorActionBtn} 
                                    onClick={onResendVerification}
                                    disabled={setupLoading || resendLoading}
                                    type="button"
                                >
                                    {resendLoading ? "Resending..." : "Resend Email Verification Link"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
});

export default AuthHeader;
