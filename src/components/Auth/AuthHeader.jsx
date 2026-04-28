import React, { memo } from 'react';
import Logo from '../Logo';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AuthHeader.module.css';
import { AUTH_UI_CONSTANTS } from '../../constants/authConstants';

/**
 * AuthHeader - Elite Dynamic Header
 * Rule #14: Data-Driven UI via constants
 */
const AuthHeader = memo(({ isLogin, forgotPasswordMode, isLoading, error, onRetry }) => {
    const { login, signup, forgotPassword } = AUTH_UI_CONSTANTS;

    if (isLoading) {
        return (
            <div className={styles.header}>
                <div className={styles.logoWrapper}>
                    <Skeleton className={styles.skeletonLogo} />
                </div>
                <Skeleton className={styles.skeletonTitle} />
            </div>
        );
    }

    const config = forgotPasswordMode 
        ? forgotPassword?.header 
        : (isLogin ? login?.header : signup?.header);

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.header}>
                <div className={styles.logoWrapper}>
                    <Logo size={42} className={styles.centeredLogo} />
                </div>
                <h2 className={styles.title}>{config?.title}</h2>
                <p className={styles.subtitle}>{config?.subtitle}</p>
            </div>
        </Safeguard>
    );
});

export default AuthHeader;
