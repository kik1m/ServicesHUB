'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';

/**
 * useResetPasswordData - Elite Logic Hook for Next.js Reset Password flow
 */
export const useResetPasswordData = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    
    const router = useRouter();
    const { showToast } = useToast();

    useEffect(() => {
        let isMounted = true;

        const checkRecoveryState = async () => {
            const isRecovery = window.location.hash.includes('type=recovery') || 
                              window.location.hash.includes('type=signup');
            
            const { data: { session } } = await supabase.auth.getSession();

            if (isMounted) {
                if (session || isRecovery) {
                    setInitialLoading(false);
                } else {
                    const timer = setTimeout(async () => {
                        const { data: { session: retrySession } } = await supabase.auth.getSession();
                        if (!retrySession && isMounted) {
                            showToast("Your reset link is invalid or expired.", 'error');
                            router.push('/auth');
                        } else if (isMounted) {
                            setInitialLoading(false);
                        }
                    }, 2000);
                    return () => clearTimeout(timer);
                }
            }
        };

        checkRecoveryState();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (isMounted && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
                setInitialLoading(false);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [router, showToast]);

    const handleReset = useCallback(async (e) => {
        if (e) e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast("Passwords do not match.", 'error');
            return;
        }
        if (password.length < 6) {
            showToast("Password must be at least 6 characters.", 'error');
            return;
        }

        setLoading(true);
        try {
            const { error: resetError } = await authService.updatePassword(password);
            if (resetError) throw resetError;

            setSuccess(true);
            showToast('Password updated successfully!', 'success');
            
            setTimeout(() => router.push('/auth'), 3000);
        } catch (err) {
            setError(err.message || 'Failed to update password');
            showToast(err.message || 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    }, [password, confirmPassword, router, showToast]);

    return {
        password, setPassword,
        confirmPassword, setConfirmPassword,
        loading, initialLoading, success, error,
        handleReset
    };
};
