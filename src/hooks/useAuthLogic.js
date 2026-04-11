import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';

/**
 * useAuthLogic Hook - Handles the state and logic for Auth & Registration
 */
export const useAuthLogic = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // UI & Navigation States
    const [isLogin, setIsLogin] = useState(true);
    const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
    
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // Status States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Redirect if already logged in
     */
    useEffect(() => {
        if (!authLoading && user) {
            navigate('/dashboard');
        }
    }, [user, authLoading, navigate]);

    /**
     * Handlers
     */
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
                await authService.signIn(email, password);
                navigate('/dashboard');
            } else {
                await authService.signUp(email, password, fullName);
                showToast('Welcome to HUBly! Account created.', 'success');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.message || 'Authentication failed';
            setError(msg);
            showToast(msg, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
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
    };

    const handleSocialLogin = async (provider) => {
        try {
            await authService.signInWithSocial(provider);
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        setError(null);
    };

    return {
        // States
        isLogin, setIsLogin,
        forgotPasswordMode, setForgotPasswordMode,
        email, setEmail,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        fullName, setFullName,
        showPassword, setShowPassword,
        loading, error,
        
        // Handlers
        handleAuth,
        handleForgotPassword,
        handleSocialLogin,
        toggleAuthMode
    };
};
