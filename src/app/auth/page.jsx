'use client';
import React from 'react';
import { useAuthLogic } from '../../hooks/useAuthLogic';

// Import Global Components
import Safeguard from '../../components/ui/Safeguard';

// Import Modular Components
import AuthHeader from '../../components/Auth/AuthHeader';
import LoginForm from '../../components/Auth/LoginForm';
import SignUpForm from '../../components/Auth/SignUpForm';
import ForgotPasswordForm from '../../components/Auth/ForgotPasswordForm';
import SocialLogins from '../../components/Auth/SocialLogins';

// Import Styles
import styles from './Auth.module.css';

/**
 * Auth Page - Elite Next.js Port
 * 1:1 Parity with Vite Implementation
 */
export default function AuthPage() {
    const {
        isLogin,
        forgotPasswordMode, setForgotPasswordMode,
        loading,
        error,
        isInitialLoading,
        handleLogin,
        handleSignUp,
        handleForgotPassword,
        handleSocialLogin,
        toggleAuthMode,
        lastAttemptedEmail,
        handleResendVerification,
        handleSendPasswordSetup,
        resendLoading,
        setupLoading
    } = useAuthLogic();

    return (
        <div className={styles.authWrapper}>
            <Safeguard 
                title="Authentication Service Interrupted" 
                onRetry={() => window.location.reload()}
            >
                <main className={styles.authCard}>
                    <AuthHeader 
                        isLogin={isLogin} 
                        forgotPasswordMode={forgotPasswordMode} 
                        isLoading={isInitialLoading} 
                        error={error}
                        onRetry={toggleAuthMode}
                        lastAttemptedEmail={lastAttemptedEmail}
                        onResendVerification={handleResendVerification}
                        onSendPasswordSetup={handleSendPasswordSetup}
                        resendLoading={resendLoading}
                        setupLoading={setupLoading}
                    />

                    {forgotPasswordMode ? (
                        <ForgotPasswordForm 
                            onSubmit={handleForgotPassword} 
                            onBack={() => setForgotPasswordMode(false)} 
                            loading={loading}
                            isInitialLoading={isInitialLoading}
                            error={error}
                            onRetry={() => setForgotPasswordMode(false)}
                        />
                    ) : (
                        <div className={styles.authContent}>
                            {isLogin ? (
                                <LoginForm 
                                    onSubmit={handleLogin}
                                    onForgotPassword={() => setForgotPasswordMode(true)}
                                    loading={loading}
                                    isInitialLoading={isInitialLoading}
                                    error={error}
                                    onRetry={handleLogin}
                                />
                            ) : (
                                <SignUpForm 
                                    onSubmit={handleSignUp}
                                    loading={loading}
                                    isInitialLoading={isInitialLoading}
                                    error={error}
                                    onRetry={handleSignUp}
                                />
                            )}

                            <SocialLogins 
                                onSocialAction={handleSocialLogin} 
                                isLoading={isInitialLoading} 
                                error={error}
                                onRetry={() => window.location.reload()}
                            />

                            <p className={styles.authFooter}>
                                {isLogin ? "Don't have an account?" : "Already have an account?"}
                                <button 
                                    onClick={toggleAuthMode} 
                                    className={styles.switchBtn}
                                    aria-label="Switch between login and sign up modes"
                                >
                                    {isLogin ? "Create Account" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    )}
                </main>
            </Safeguard>
        </div>
    );
}
