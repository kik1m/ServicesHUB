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

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'auth' });

    const footerText = isLogin ? AUTH_UI_CONSTANTS.login.footer : AUTH_UI_CONSTANTS.signup.footer;

    return (
        <div className={styles.authWrapper}>
            <Safeguard title="Authentication Service Interrupted">
                <div className={styles.authCard}>
                    <AuthHeader 
                        isLogin={isLogin} 
                        forgotPasswordMode={forgotPasswordMode} 
                        isLoading={isInitialLoading} 
                        error={error}
                        onRetry={() => toggleAuthMode()}
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
                                    onRetry={() => handleLogin()}
                                />
                            ) : (
                                <SignUpForm 
                                    onSubmit={handleSignUp}
                                    loading={loading}
                                    isInitialLoading={isInitialLoading}
                                    error={error}
                                    onRetry={() => handleSignUp()}
                                />
                            )}

                            <SocialLogins 
                                onSocialAction={handleSocialLogin} 
                                isLoading={isInitialLoading} 
                                error={error}
                                onRetry={() => handleSocialLogin()}
                            />

                            <p className={styles.authFooter}>
                                {footerText.text}
                                <button 
                                    onClick={toggleAuthMode} 
                                    className={styles.switchBtn}
                                >
                                    {footerText.action}
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </Safeguard>
        </div>
    );
};

export default Auth;
