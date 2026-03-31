import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Lock, ArrowRight, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

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
                // If no session, it might be an invalid or expired link
                // But Supabase often needs a moment to process the hash
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
            showToast('Password updated successfully! 🔐', 'success');
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-card" style={{ maxWidth: '450px', width: '100%', padding: '4rem', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(0, 210, 255, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <CheckCircle size={40} color="var(--secondary)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Password Updated!</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Your new password has been set. Redirecting you to login...</p>
                    <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} />
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-card" style={{ maxWidth: '480px', width: '100%', padding: '3.5rem', position: 'relative' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div className="logo-icon" style={{ margin: '0 auto 1.5rem', width: 'fit-content', padding: '1rem' }}>
                        <ShieldCheck size={28} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.8rem' }}>Set <span className="gradient-text">New Password</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Enter your new secure password below.</p>
                </div>

                <form onSubmit={handleReset}>
                    <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>New Password</label>
                        <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                            <Lock className="search-icon" size={18} />
                            <input 
                                type="password" 
                                placeholder="Min 6 characters" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px' }} 
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirm Password</label>
                        <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                            <Lock className="search-icon" size={18} />
                            <input 
                                type="password" 
                                placeholder="Repeat password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px' }} 
                            />
                        </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', height: '56px' }} disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Update & Login <ArrowRight size={20} /></>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
