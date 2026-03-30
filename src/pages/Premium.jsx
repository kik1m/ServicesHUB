import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Star, Sparkles, Rocket, ArrowRight, Loader2, Award } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';

const Premium = () => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);

    const handleUpgrade = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.post('/api/create-checkout-session', {
                userId: user.id,
                itemType: 'account_premium',
                planName: 'Lifetime Premium',
                priceAmount: 120
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error('Upgrade error:', err);
            showToast('Failed to initiate checkout. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-wrapper premium-page">
            <header className="page-header hero-section" style={{ minHeight: '50vh', paddingBottom: '50px' }}>
                <div className="hero-content">
                    <div className="badge" style={{ background: 'linear-gradient(90deg, #FFD700, #FFA500)', color: 'black' }}>LIFETIME ACCESS</div>
                    <h1 className="hero-title">Unlock the <span className="gradient-text">Full Potential</span> of AI</h1>
                    <p className="hero-subtitle">Elevate your experience with exclusive features, unlimited submissions, and priority visibility.</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '1000px', marginTop: '-100px', zIndex: 10, position: 'relative' }}>
                <div className="glass-card premium-hero-card" style={{
                    padding: '2.5rem',
                    borderRadius: '40px',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    background: 'var(--bg-card)',
                    boxShadow: '0 20px 80px rgba(255, 215, 0, 0.1)',
                    backdropFilter: 'blur(20px)',
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    gap: '2rem',
                    alignItems: 'center',
                    maxWidth: '100%',
                    margin: '0 auto'
                }}>
                    <div className="premium-details">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                            <div className="prop-icon-bg" style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                                <Award size={32} color="#FFD700" />
                            </div>
                            <h2 style={{ fontSize: '2.2rem', fontWeight: '900' }}>Premium Membership</h2>
                        </div>

                        <ul className="premium-features" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(0, 255, 170, 0.1)', padding: '5px', borderRadius: '50%' }}>
                                    <CheckCircle2 size={20} color="#00ffaa" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'white', fontSize: '1.1rem' }}>Unlimited Tool Submissions</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lift the 2-tool limit and grow your portfolio without bounds.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(0, 255, 170, 0.1)', padding: '5px', borderRadius: '50%' }}>
                                    <CheckCircle2 size={20} color="#00ffaa" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'white', fontSize: '1.1rem' }}>Premium Verification Badge</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>A golden diamond badge next to your profile for ultimate trust.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(0, 255, 170, 0.1)', padding: '5px', borderRadius: '50%' }}>
                                    <CheckCircle2 size={20} color="#00ffaa" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'white', fontSize: '1.1rem' }}>Priority Support</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get your tools reviewed and approved faster by our expert team.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                                <div style={{ background: 'rgba(0, 255, 170, 0.1)', padding: '5px', borderRadius: '50%' }}>
                                    <CheckCircle2 size={20} color="#00ffaa" />
                                </div>
                                <div>
                                    <strong style={{ display: 'block', color: 'white', fontSize: '1.1rem' }}>Advanced Analytics</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Deeper insights into how your tools are performing globally.</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="premium-pricing" style={{
                        background: 'rgba(var(--primary-rgb), 0.05)',
                        padding: '2rem',
                        borderRadius: '30px',
                        border: '1px solid var(--border)',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>One-Time Payment</p>
                        <div style={{ marginBottom: '2.5rem' }}>
                            <span style={{ fontSize: '4.5rem', fontWeight: '900', color: 'white' }}>$120</span>
                            <span style={{ color: 'var(--text-muted)', display: 'block' }}>Lifetime Access</span>
                        </div>

                        {user?.is_premium ? (
                            <div style={{ padding: '15px', background: 'rgba(0, 255, 170, 0.1)', color: '#00ffaa', borderRadius: '15px', fontWeight: '700' }}>
                                Account Already Premium 💎
                            </div>
                        ) : (
                            <button
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    fontSize: '1.1rem',
                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                    color: 'black',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px'
                                }}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <>Get Lifetime Access <ArrowRight size={20} /></>}
                            </button>
                        )}
                        <p style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Secure payment via Stripe. No hidden fees.</p>
                    </div>
                </div>

                {/* FAQ Section */}
                <div style={{ marginTop: '6rem', textAlign: 'center' }}>
                    <h2 style={{ marginBottom: '4rem' }}>Frequently Asked Questions</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', textAlign: 'left' }}>
                        <div>
                            <h4 style={{ marginBottom: '15px', color: 'white' }}>Is it really a one-time payment?</h4>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Yes! Once you pay the $120, your account is upgraded forever. You will never be charged again for account-level premium features.</p>
                        </div>
                        <div>
                            <h4 style={{ marginBottom: '15px', color: 'white' }}>Can I still promote my tools?</h4>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>Yes. Tool promotions (Featured/Enterprise) are separate and apply to specific tools to give them maximum visibility on the homepage.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Premium;
