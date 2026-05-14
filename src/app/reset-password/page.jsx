'use client';
import React, { memo } from 'react';
import { useResetPasswordData } from '../../hooks/useResetPasswordData';

// Import Global Components
import Safeguard from '../../components/ui/Safeguard';

// Import Modular Components
import ResetPasswordHero from '../../components/Auth/ResetPasswordHero';
import ResetPasswordForm from '../../components/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '../../components/Auth/ResetPasswordSuccess';

// Import Modular CSS
import styles from '../auth/Auth.module.css'; // Re-use auth wrapper styles

/**
 * ResetPassword Page - Elite Next.js Port
 * Rule #16: Pure Orchestration
 */
export default function ResetPasswordPage() {
    const {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading, initialLoading, success, error,
        handleReset
    } = useResetPasswordData();

    if (success) {
        return (
            <main className={styles.authWrapper}>
                <div className={styles.authCard}>
                    <ResetPasswordSuccess 
                        error={error}
                        onRetry={() => window.location.reload()}
                    />
                </div>
            </main>
        );
    }

    return (
        <main className={styles.authWrapper}>
            <Safeguard error={error} onRetry={handleReset} title="Reset Account Password">
                <div className={styles.authCard}>
                    <ResetPasswordHero 
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
                        error={error}
                        onRetry={handleReset}
                    />
                </div>
            </Safeguard>
        </main>
    );
}
