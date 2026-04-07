import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

// Import Modular Components
import AuthHeader from '../components/Auth/AuthHeader';
import LoginForm from '../components/Auth/LoginForm';
import SignUpForm from '../components/Auth/SignUpForm';
import ForgotPasswordForm from '../components/Auth/ForgotPasswordForm';
import SocialLogins from '../components/Auth/SocialLogins';

// Import Modular CSS
import '../styles/Pages/Auth.css';

const Auth = () => {
    const { user, loading: authLoading } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useSEO({
        title: isLogin ? "Login - HUBly" : "Join HUBly",
        description: "Access the ultimate directory for modern AI and SaaS tools.",
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isLogin && password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            setLoading(false);
            return;
        }

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                navigate('/dashboard');
            } else {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        emailRedirectTo: `${window.location.origin}/dashboard`
                    }
                });
                if (signUpError) throw signUpError;

                if (signUpData.user) {
                    await supabase.from('profiles').upsert({ id: signUpData.user.id, full_name: fullName, role: 'user' });
                }

                showToast('Account created! Welcome to HUBly.', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (error) throw error;
            showToast('Reset link sent!', 'success');
        } catch (err) {
            setError(err.message);
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: { redirectTo: window.location.origin + '/dashboard' }
            });
            if (error) throw error;
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    return (
        <div className="auth-slim-wrapper">
            <div className="auth-card-slim">
                <AuthHeader isLogin={isLogin} forgotPasswordMode={forgotPasswordMode} />

                {forgotPasswordMode ? (
                    <ForgotPasswordForm 
                        email={email} setEmail={setEmail} 
                        handleForgotPassword={handleForgotPassword} 
                        setForgotPasswordMode={setForgotPasswordMode} 
                        loading={loading}
                    />
                ) : (
                    <div className="auth-main-content">
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

                        <p className="auth-switch-text">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button 
                                onClick={() => setIsLogin(!isLogin)} 
                                className="text-link-slim"
                                style={{ marginLeft: '8px' }}
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
