import React, { memo } from 'react';
import useSEO from '../hooks/useSEO';
import { useResetPasswordData } from '../hooks/useResetPasswordData';
import { AUTH_UI_CONSTANTS } from '../constants/authConstants';

// Import Modular Components
import ResetPasswordHero from '../components/Auth/ResetPasswordHero';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '../components/Auth/ResetPasswordSuccess';

// Import Modular CSS
import styles from './ResetPassword.module.css';

/**
 * ResetPassword Page - Elite 10/10 Portal
 * Rule #16: Pure Orchestration
 */
const ResetPassword = () => {
    const {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading, initialLoading, success, error,
        handleReset
    } = useResetPasswordData();

    const content = AUTH_UI_CONSTANTS.resetPassword;

    // 1. Elite Account Recovery Security (v3.0)
    // Rule #34: Recovery flows MUST be invisible to search engines
    useSEO({ 
        title: 'Reset Password | HUBly',
        description: 'Securely reset your HUBly account password.',
        noindex: true, // Critical Security: Prevent indexing of recovery tokens
        robots: "noindex, nofollow, noarchive", 
        ogType: 'website',
        schema: null 
    });

    if (success) {
        return (
            <main className={styles.authWrapper}>
                <div className={styles.authCard}>
                    <ResetPasswordSuccess 
                        content={content?.success} 
                        isLoading={initialLoading} 
                        error={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className={styles.authWrapper}>
            <Safeguard error={error} onRetry={handleReset} title={content?.header?.title}>
                <div className={styles.authCard}>
                    <ResetPasswordHero 
                        content={content?.header}
                        isLoading={initialLoading} 
                        error={error}
                        onRetry={handleReset}
                    />
                    
                    <ResetPasswordForm 
                        password={password}
                        setPassword={setPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        loading={loading}
                        onSubmit={handleReset}
                        isLoading={initialLoading}
                        content={content?.form}
                        error={error}
                        onRetry={handleReset}
                    />
                </div>
            </Safeguard>
        </main>
    );
};

export default memo(ResetPassword);
