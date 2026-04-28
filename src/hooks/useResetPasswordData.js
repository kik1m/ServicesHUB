import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';
import { AUTH_UI_CONSTANTS } from '../constants/authConstants';

/**
 * useResetPasswordData - Elite Logic Hook for Reset Password flow
 * Rule #1: Isolation of business logic
 * Rule #32: Defensive session management
 */
export const useResetPasswordData = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { validation } = AUTH_UI_CONSTANTS;

    // 1. Session Validation Logic - Rule #32: Robust session detection
    useEffect(() => {
        let isMounted = true;

        const checkRecoveryState = async () => {
            // Check 1: Is there a recovery type in the URL hash? (Immediate detection)
            const isRecovery = window.location.hash.includes('type=recovery') || 
                              window.location.hash.includes('type=signup');
            
            // Check 2: Get current session
            const { data: { session } } = await supabase.auth.getSession();

            if (isMounted) {
                if (session || isRecovery) {
                    // We have a session or we are in the middle of parsing one
                    setInitialLoading(false);
                } else {
                    // No session and no recovery hash - wait a bit then redirect
                    const timer = setTimeout(async () => {
                        const { data: { session: retrySession } } = await supabase.auth.getSession();
                        if (!retrySession && isMounted) {
                            showToast(validation.invalidLink, 'error');
                            navigate('/auth');
                        } else if (isMounted) {
                            setInitialLoading(false);
                        }
                    }, 2000); // 2 second buffer for slow hash parsing
                    return () => clearTimeout(timer);
                }
            }
        };

        checkRecoveryState();

        // Check 3: Listen for auth state changes (Recovery Event)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (isMounted && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
                setInitialLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [navigate, showToast, validation.invalidLink]);

    // 2. Submission Logic - Rule #11: Pure business logic isolation
    const handleReset = useCallback(async (e) => {
        if (e) e.preventDefault();
        
        // Defensive checks
        if (password !== confirmPassword) {
            showToast(validation.passwordsMatch, 'error');
            return;
        }
        if (password.length < 6) {
            showToast(validation.passwordLength, 'error');
            return;
        }

        setLoading(true);
        try {
            const { error: resetError } = await authService.updatePassword(password);
            if (resetError) throw resetError;

            setSuccess(true);
            showToast('Password updated successfully!', 'success');
            
            // Auto-redirect after success
            const timer = setTimeout(() => navigate('/auth'), 3000);
            return () => clearTimeout(timer);
        } catch (err) {
            setError(err.message || 'Failed to update password');
            showToast(err.message || 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    }, [password, confirmPassword, navigate, showToast, validation]);

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        loading,
        initialLoading,
        success,
        error,
        handleReset
    };
};
