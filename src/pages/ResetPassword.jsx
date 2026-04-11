import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { supabase } from '../lib/supabaseClient';

// Import Modular Components
import ResetPasswordHero from '../components/Auth/ResetPasswordHero';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '../components/Auth/ResetPasswordSuccess';

// Import Modular CSS
import styles from './ResetPassword.module.css';

/**
 * ResetPassword Page - Secure password update portal
 */
const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();
    const { showToast } = useToast();

    /**
     * Session validation
     */
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Buffer for hash processing
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (!retrySession) {
                        showToast('Invalid or expired reset link.', 'error');
                        navigate('/auth');
                    }
                }, 1000);
            }
        };
        checkSession();
    }, [navigate, showToast]);

    /**
     * Submission logic
     */
    const handleReset = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match!', 'error');
            return;
        }
        if (password.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }

        setLoading(true);
        try {
            await authService.updatePassword(password);
            setSuccess(true);
            showToast('Password updated successfully!', 'success');
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            showToast(err.message || 'Failed to update password', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (success) return <ResetPasswordSuccess />;

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authCard}>
                <ResetPasswordHero />
                <ResetPasswordForm 
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    loading={loading}
                    onSubmit={handleReset}
                />
            </div>
        </div>
    );
};

export default ResetPassword;
