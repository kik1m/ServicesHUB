import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

/**
 * useAuthLogic - Elite Coordinator Hook
 * Rule #1: Logic Isolation
 */
export const useAuthLogic = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await authService.signIn(email, password);
            navigate('/dashboard');
        } catch (err) {
            const msg = err.message || 'Authentication failed';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, showToast]);

    const handleSignUp = useCallback(async (email, password, fullName) => {
        setLoading(true);
        setError(null);
        try {
            await authService.signUp(email, password, fullName);
            showToast('Account created! Welcome to ServicesHUB.', 'success');
            navigate('/dashboard');
        } catch (err) {
            const msg = err.message || 'Registration failed';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    }, [navigate, showToast]);

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
