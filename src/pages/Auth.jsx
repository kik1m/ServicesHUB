import React from 'react';
import useSEO from '../hooks/useSEO';
import { useAuthLogic } from '../hooks/useAuthLogic';

// Import Global Components
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import AuthHeader from '../components/Auth/AuthHeader';
import LoginForm from '../components/Auth/LoginForm';
import SignUpForm from '../components/Auth/SignUpForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import SocialLogins from '../components/Auth/SocialLogins';

// Import Constants & Styles
import { AUTH_UI_CONSTANTS } from '../constants/authConstants';
import styles from './Auth.module.css';

/**
 * Auth Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Auth = () => {
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
        toggleAuthMode
    } = useAuthLogic();

    // 1. Elite Auth Security & UX Hardening (v3.0)
    // Rule #34: Auth flows must be invisible to search engines
    useSEO({ 
        pageKey: 'auth',
        entityId: 'auth',
        entityType: 'page',
        title: forgotPasswordMode 
            ? 'Reset Password | HUBly' 
            : isLogin 
            ? 'Login | Access Your HUBly Account' 
            : 'Sign Up | Join the HUBly Community',
        description: 'Secure access to the HUBly platform. Manage your AI tools, collections, and professional profile.',
        noindex: true, // Critical: Prevent indexing of sensitive flows
        robots: "noindex, nofollow", 
        ogType: 'website',
        schema: null
    });

    const authMode = isLogin ? 'login' : 'signup';
    const footerText = AUTH_UI_CONSTANTS[authMode].footer;

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
                                onRetry={() => window.location.reload()} // Reset state via reload on social failure
                            />

                            <p className={styles.authFooter}>
                                {footerText.text}
                                <button 
                                    onClick={toggleAuthMode} 
                                    className={styles.switchBtn}
                                    aria-label="Switch between login and sign up modes"
                                >
                                    {footerText.action}
                                </button>
                            </p>
                        </div>
                    )}
                </main>
            </Safeguard>
        </div>
    );
};

export default Auth;
