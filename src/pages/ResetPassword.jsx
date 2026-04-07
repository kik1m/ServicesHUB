import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

// Import Modular Components
import ResetPasswordHero from '../components/Auth/ResetPasswordHero';
import ResetPasswordForm from '../components/Auth/ResetPasswordForm';
import ResetPasswordSuccess from '../components/Auth/ResetPasswordSuccess';

// Import Modular CSS
import '../styles/pages/AuthPages.css';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    useEffect(() => {
        // Check if we have a session (Supabase automatically handles the hash/token from email)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, retry once to allow for hash processing
                setTimeout(async () => {
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (!retrySession) {
                        showToast('Invalid or expired reset link. Please request a new one.', 'error');
                        navigate('/auth');
                    }
                }, 1000);
            }
        };
        checkSession();
    }, [navigate, showToast]);

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
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Connection timeout! Please try again.')), 12000)
            );

            const { error } = await Promise.race([
                supabase.auth.updateUser({ password }),
                timeoutPromise
            ]);
            
            if (error) throw error;
            
            setSuccess(true);
            showToast('Password updated successfully!', 'success');
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return <ResetPasswordSuccess />;
    }

    return (
        <div className="page-wrapper auth-page-wrapper">
            <div className="glass-card auth-glass-card">
                
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
