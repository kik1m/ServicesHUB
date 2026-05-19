'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';

/**
 * useAuthLogic - Elite Coordinator Hook (Next.js Version)
 */
export const useAuthLogic = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastAttemptedEmail, setLastAttemptedEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [setupLoading, setSetupLoading] = useState(false);

    // Guard: Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        setLastAttemptedEmail(email);
        try {
            await authService.signIn(email, password);
            router.push('/dashboard');
        } catch (err) {
            const msg = err.message || 'Authentication failed';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    const handleResendVerification = useCallback(async () => {
        if (!lastAttemptedEmail) return;
        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: lastAttemptedEmail
            });
            if (error) throw error;
            showToast('Verification email resent successfully! Please check your spam folder too.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to resend verification email.', 'error');
        } finally {
            setResendLoading(false);
        }
    }, [lastAttemptedEmail, showToast]);

    const handleSendPasswordSetup = useCallback(async () => {
        if (!lastAttemptedEmail) return;
        setSetupLoading(true);
        try {
            await authService.resetPassword(lastAttemptedEmail);
            showToast('Password setup/recovery link sent successfully! Please check your email.', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to send password setup link.', 'error');
        } finally {
            setSetupLoading(false);
        }
    }, [lastAttemptedEmail, showToast]);

    const handleSignUp = useCallback(async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            await authService.signUp(email, password, fullName);
            
            // Vite Parity: Redirect to dashboard after sign up.
            showToast('Account created! Welcome to HUBly.', 'success');
            router.push('/dashboard');
            
        } catch (err) {
            const msg = err.message || 'Registration failed. Please check your details.';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [router, showToast]);

    const handleForgotPassword = useCallback(async (email) => {
        setLoading(true);
        setError(null);
        try {
            await authService.resetPassword(email);
            showToast('Recovery link sent to your email!', 'success');
        } catch (err) {
            const msg = err.message || 'Failed to send recovery link';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const handleSocialLogin = useCallback(async (provider) => {
        try {
            console.log(`Triggering Social Login for: ${provider}`);
            await authService.signInWithSocial(provider);
        } catch (err) {
            console.error(`Social Login Error (${provider}):`, err);
            const msg = err.message || 'Social login failed. Please try again.';
            setError(msg);
            showToast(msg, 'error');
        }
    }, [showToast]);

    const toggleAuthMode = () => {
        setIsLogin(prev => !prev);
        setError(null);
        setForgotPasswordMode(false);
    };

    return {
        isLogin,
        forgotPasswordMode,
        setForgotPasswordMode,
        loading,
        error,
        isInitialLoading: authLoading,
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
    };
};
