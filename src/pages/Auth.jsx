import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuthLogic } from '../hooks/useAuthLogic';

// Import Modular Components
import AuthHeader from '../components/Auth/AuthHeader';
import LoginForm from '../components/Auth/LoginForm';
import SignUpForm from '../components/Auth/SignUpForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import SocialLogins from '../components/Auth/SocialLogins';

// Import Modular CSS
import styles from './Auth.module.css';

/**
 * Auth Page - Login & Registration Portal
 */
const Auth = () => {
    const {
        isLogin,
        forgotPasswordMode, setForgotPasswordMode,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        fullName, setFullName,
        showPassword, setShowPassword,
        loading,
        handleAuth,
        handleForgotPassword,
        handleSocialLogin,
        toggleAuthMode
    } = useAuthLogic();

    return (
        <div className={styles.authWrapper}>
            <Helmet>
                <title>{isLogin ? "Login - HUBly" : "Join HUBly"}</title>
                <meta name="description" content="Access the ultimate directory for modern AI and SaaS tools." />
            </Helmet>

            <div className={styles.authCard}>
                <AuthHeader isLogin={isLogin} forgotPasswordMode={forgotPasswordMode} />

                {forgotPasswordMode ? (
                    <ForgotPasswordForm 
                        email={email} 
                        setEmail={setEmail} 
                        handleForgotPassword={handleForgotPassword} 
                        setForgotPasswordMode={setForgotPasswordMode} 
                        loading={loading}
                    />
                ) : (
                    <div className={styles.authContent}>
                        {isLogin ? (
                            <LoginForm 
                                email={email} setEmail={setEmail}
                                password={password} setPassword={setPassword}
                                showPassword={showPassword} setShowPassword={setShowPassword}
                                handleAuth={handleAuth}
                                setForgotPasswordMode={setForgotPasswordMode}
                                loading={loading}
                            />
                        ) : (
                            <SignUpForm 
                                fullName={fullName} setFullName={setFullName}
                                email={email} setEmail={setEmail}
                                password={password} setPassword={setPassword}
                                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                showPassword={showPassword} setShowPassword={setShowPassword}
                                handleAuth={handleAuth}
                                loading={loading}
                            />
                        )}

                        <SocialLogins handleSocialLogin={handleSocialLogin} />

                        <p className={styles.authFooter}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={toggleAuthMode} 
                                className={styles.switchBtn}
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
