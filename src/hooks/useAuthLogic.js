'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

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

    // Guard: Redirect if already logged in
    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
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

    const handleSignUp = useCallback(async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.signUp(email, password, fullName);
            
            // Check if email confirmation is required by Supabase (no session returned)
            if (data?.user && !data?.session) {
                showToast('Account created! Please check your email to verify your account.', 'success');
                setIsLogin(true); // Switch to login form so they can log in after verifying
            } else {
                showToast('Account created! Welcome to HUBly.', 'success');
                router.push('/dashboard');
            }
        } catch (err) {
            const msg = err.message || 'Registration failed';
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
            await authService.signInWithSocial(provider);
        } catch (err) {
            showToast(err.message, 'error');
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
        toggleAuthMode
    };
};
