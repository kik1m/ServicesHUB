import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                navigate('/dashboard');
            } else {
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (signUpError) throw signUpError;

                // Create profile entry
                if (signUpData.user) {
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .insert([
                            { id: signUpData.user.id, full_name: fullName, role: 'user' }
                        ]);
                    if (profileError) console.error('Error creating profile:', profileError);
                }
                
                alert('Success! Please check your email for confirmation.');
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-wrapper auth-page" style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '120px 5% 60px',
            background: 'radial-gradient(circle at 50% 50%, rgba(0, 136, 204, 0.08) 0%, transparent 70%)'
        }}>
            <div className="glass-card auth-card-premium" style={{ 
                width: '100%', 
                maxWidth: '480px', 
                padding: '3.5rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    position: 'absolute', 
                    top: '-50px', 
                    right: '-50px', 
                    width: '150px', 
                    height: '150px', 
                    background: 'var(--primary)', 
                    filter: 'blur(100px)', 
                    opacity: 0.1,
                    zIndex: 0
                }}></div>

                <div className="section-header" style={{ marginBottom: '3rem', position: 'relative', zIndex: 1 }}>
                    <div className="logo-icon" style={{ margin: '0 auto 1.5rem', width: 'fit-content', padding: '1rem' }}>
                        <Lock size={28} />
                    </div>
                    <h1 className="section-title" style={{ fontSize: '2.2rem', marginBottom: '0.8rem' }}>
                        {isLogin ? (
                            <>Welcome <span className="gradient-text">Back</span></>
                        ) : (
                            <>Join <span className="gradient-text">ServicesHUB</span></>
                        )}
                    </h1>
                    <p className="section-desc" style={{ fontSize: '1rem' }}>
                        {isLogin ? 'Manage your tools and profile.' : 'Discover the future of AI tools today.'}
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        padding: '1rem', 
                        background: 'rgba(255, 80, 80, 0.1)', 
                        border: '1px solid rgba(255, 80, 80, 0.2)', 
                        borderRadius: '12px', 
                        color: '#ff5050', 
                        marginBottom: '2rem',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleAuth} style={{ position: 'relative', zIndex: 1 }}>
                    {!isLogin && (
                        <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                            <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                                <User className="search-icon" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Full Name" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px' }} 
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group" style={{ marginBottom: '1.2rem' }}>
                        <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                            <Mail className="search-icon" size={18} />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px' }} 
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ marginBottom: '2rem' }}>
                        <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                            <Lock className="search-icon" size={18} />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px' }} 
                            />
                        </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>{isLogin ? 'Login Now' : 'Create Account'} <ArrowRight size={20} /></>
                        )}
                    </button>
                </form>

                <div className="social-auth" style={{ marginTop: '2.5rem', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: 'rgba(255,255,255,0.2)', marginBottom: '2rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'currentColor' }}></div>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>OR</span>
                        <div style={{ flex: 1, height: '1px', background: 'currentColor' }}></div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button 
                            className="icon-btn" 
                            onClick={() => handleSocialLogin('google')}
                            style={{ flex: 1, height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <Chrome size={20} /> Google
                        </button>
                        <button 
                            className="icon-btn" 
                            onClick={() => handleSocialLogin('github')}
                            style={{ flex: 1, height: '54px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.02)' }}
                        >
                            <Github size={20} /> Github
                        </button>
                    </div>
                </div>

                <p style={{ marginTop: '2.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', position: 'relative', zIndex: 1 }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '800', cursor: 'pointer', marginLeft: '8px', fontSize: '0.95rem' }}
                    >
                        {isLogin ? 'Join Free' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
