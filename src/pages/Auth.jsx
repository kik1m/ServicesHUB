import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, LayoutGrid, Loader2, Eye, EyeOff, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import useSEO from '../hooks/useSEO';

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
        title: isLogin ? "Login - ServicesHUB" : "Join ServicesHUB",
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

                showToast('Account created! Welcome to ServicesHUB.', 'success');
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
        <div className="auth-slim-wrapper" style={{ 
            minHeight: '90vh', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', padding: '40px 20px', position: 'relative' 
        }}>
            <div className="auth-card-slim" style={{ 
                width: '100%', maxWidth: '420px', background: 'rgba(255,255,255,0.02)', 
                backdropFilter: 'blur(20px)', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.05)',
                padding: '3rem 2.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                position: 'relative', zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        width: '64px', height: '64px', background: 'var(--gradient)', 
                        borderRadius: '18px', display: 'flex', alignItems: 'center', 
                        justifyContent: 'center', margin: '0 auto 1.5rem'
                    }}>
                        <LayoutGrid size={32} color="black" />
                    </div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'white' }}>
                        {forgotPasswordMode ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Join the Future')}
                    </h1>
                </div>

                {forgotPasswordMode ? (
                    <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div className="input-group-slim">
                            <label><Mail size={14} /> Email Address</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="slim-input-field" placeholder="name@company.com" required />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '14px', width: '100%' }}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
                        </button>
                        <button type="button" onClick={() => setForgotPasswordMode(false)} className="text-link-slim" style={{ textAlign: 'center', marginTop: '0.5rem' }}>
                            Back to Login
                        </button>
                    </form>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {!isLogin && (
                                <div className="input-group-slim">
                                    <label><User size={14} /> Full Name</label>
                                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="slim-input-field" placeholder="John Doe" required />
                                </div>
                            )}
                            <div className="input-group-slim">
                                <label><Mail size={14} /> Email Address</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="slim-input-field" placeholder="name@company.com" required />
                            </div>
                            <div className="input-group-slim">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label><Lock size={14} /> Password</label>
                                    {isLogin && <button type="button" onClick={() => setForgotPasswordMode(true)} className="text-link-slim" style={{ fontSize: '0.75rem' }}>Forgot?</button>}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="slim-input-field" placeholder="••••••••" required />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="input-group-slim">
                                    <label><ShieldCheck size={14} /> Confirm Password</label>
                                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="slim-input-field" placeholder="••••••••" required />
                                </div>
                            )}

                            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '15px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </button>
                        </form>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <button onClick={() => handleSocialLogin('google')} className="social-btn-slim">
                                <Chrome size={18} /> Google
                            </button>
                            <button onClick={() => handleSocialLogin('github')} className="social-btn-slim">
                                <Github size={18} /> Github
                            </button>
                        </div>

                        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={() => setIsLogin(!isLogin)} style={{ marginLeft: '8px', color: 'var(--primary)', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .input-group-slim { display: flex; flex-direction: column; gap: 8px; }
                .input-group-slim label { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
                .slim-input-field {
                    width: 100%; padding: 12px 16px; border-radius: 14px;
                    background: rgba(255,255,255,0.03); border: 1px solid var(--border);
                    color: white; font-size: 0.95rem; transition: 0.2s;
                }
                .slim-input-field:focus { border-color: var(--primary); background: rgba(0, 255, 170, 0.05); outline: none; }
                .text-link-slim { background: none; border: none; color: var(--primary); cursor: pointer; font-weight: 600; }
                .social-btn-slim {
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 12px; border-radius: 14px; background: rgba(255,255,255,0.03);
                    border: 1px solid var(--border); color: white; font-size: 0.9rem; font-weight: 600;
                    cursor: pointer; transition: 0.3s;
                }
                .social-btn-slim:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.2); }
            `}} />
        </div>
    );
};

export default Auth;
