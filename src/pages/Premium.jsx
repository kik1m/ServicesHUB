import React from 'react';
import { 
    CheckCircle2, Award, Loader2, ArrowRight, Sparkles, 
    Gem, ShieldCheck, Zap, Globe, Star, HelpCircle, CreditCard, Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';

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
        <div className="premium-view-wrapper" style={{ padding: '60px 5% 80px' }}>
            <div className="container" style={{ maxWidth: '1000px' }}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Premium' }]} />

                {/* Header Section */}
                <header className="premium-custom-header" style={{ textAlign: 'center', marginBottom: '3.5rem', marginTop: '1.5rem' }}>
                    <div className="premium-diamond-badge">
                        <Gem size={12} style={{ marginRight: '6px' }} />
                        DIAMOND ACCESS
                    </div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: '900', marginBottom: '1rem', lineHeight: '1.1' }}>
                        Unlock the <span className="gold-gradient-text">Full Potential</span>
                    </h1>
                    <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>
                        Join the most exclusive tier of ServicesHUB. One-time investment for a lifetime of growth.
                    </p>
                </header>

                {/* Main Offer Card */}
                <section className="premium-main-card-container" style={{ position: 'relative', zIndex: 10 }}>
                    {/* Golden Glow Accents */}
                    <div className="gold-mesh-glow"></div>
                    
                    <div className="premium-glass-panel" style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 0.7fr',
                        gap: '0',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        border: '1px solid rgba(255, 215, 0, 0.2)',
                        boxShadow: '0 25px 80px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(30px)',
                        background: 'rgba(255, 255, 255, 0.02)'
                    }}>
                        {/* Features Column */}
                        <div style={{ padding: '2.5rem', borderRight: '1px solid rgba(255, 215, 0, 0.1)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                                <div style={{ 
                                    width: '44px', height: '44px', borderRadius: '12px', 
                                    background: 'rgba(255, 215, 0, 0.1)', display: 'flex', 
                                    alignItems: 'center', justifyContent: 'center' 
                                }}>
                                    <Award size={24} color="#FFD700" />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '1px' }}>Membership Perks</h2>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Scale with Diamond status.</p>
                                </div>
                            </div>

                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                                {[
                                    { title: 'Unlimited Tool Submissions', desc: 'List your innovations without bounds.', icon: <Rocket size={16} /> },
                                    { title: 'Golden Verification Badge', desc: 'Diamond status on profile and every tool.', icon: <Star size={16} /> },
                                    { title: 'Priority Support & Review', desc: 'Jump to the front of the queue.', icon: <Zap size={16} /> },
                                    { title: 'Performance Insights', desc: 'Advanced analytics in your dashboard.', icon: <Globe size={16} /> }
                                ].map((item, i) => (
                                    <li key={i} style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ 
                                            width: '28px', height: '28px', borderRadius: '8px', 
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            color: '#FFD700'
                                        }}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <strong style={{ display: 'block', fontSize: '1rem', color: 'white', marginBottom: '2px' }}>{item.title}</strong>
                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Pricing Column */}
                        <div style={{ 
                            padding: '2.5rem', 
                            background: 'rgba(255, 215, 0, 0.02)', 
                            display: 'flex', flexDirection: 'column', 
                            justifyContent: 'center', alignItems: 'center',
                            textAlign: 'center'
                        }}>
                            <div className="pricing-tag-badge">LIFETIME DEAL</div>
                            <div style={{ margin: '1.5rem 0' }}>
                                <span style={{ fontSize: '1.2rem', fontWeight: '700', verticalAlign: 'top', marginRight: '2px' }}>$</span>
                                <span style={{ fontSize: '4.5rem', fontWeight: '1000', color: 'white', letterSpacing: '-2px' }}>120</span>
                                <span style={{ color: 'var(--text-muted)', display: 'block', fontWeight: '700', marginTop: '-8px', fontSize: '0.8rem' }}>ONE-TIME</span>
                            </div>

                            <div style={{ width: '100%', marginBottom: '2rem' }}>
                                {user?.is_premium ? (
                                    <div className="premium-badge-status" style={{ background: 'var(--gradient)', color: 'white', padding: '12px 30px', borderRadius: '14px', fontWeight: '900', fontSize: '0.9rem', boxShadow: '0 10px 20px rgba(0, 210, 255, 0.2)' }}>
                                        ALREADY A PREMIUM MEMBER
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleUpgrade}
                                        disabled={loading}
                                        className="btn-premium-checkout"
                                        style={{
                                            width: '100%',
                                            padding: '18px',
                                            borderRadius: '18px',
                                            fontSize: '1.1rem',
                                            fontWeight: '900',
                                            background: 'linear-gradient(90deg, #FFB800, #FFD700)',
                                            color: '#000',
                                            border: 'none',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            boxShadow: '0 10px 30px rgba(255, 184, 0, 0.3)'
                                        }}
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <>Get Access Now <ArrowRight size={20} /></>}
                                    </button>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                <ShieldCheck size={16} color="#00ffaa" />
                                <span>Secure payments via <strong>Lemon Squeezy</strong></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section style={{ marginTop: '7rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '900' }}>Common Questions</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {[
                            { q: 'Is it really a one-time payment?', a: 'Yes. No recurring monthly fees. Once you pay $120, your account is upgraded for life.' },
                            { q: 'How does tool promotion work?', a: 'Tool promotions are separate. Premium membership gives you the status and limits, while Promotions (Featured) boost specific tools.' },
                            { q: 'Can I get a refund?', a: 'Due to the digital nature of the services and instant activation, we usually do not offer refunds once the membership is active.' },
                            { q: 'Is it personal or business?', a: 'You can use it for both! Whether you are an individual creator or a startup building multiple tools.' }
                        ].map((item, i) => (
                            <div key={i} className="glass-card" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <HelpCircle size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                                    <div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '10px', color: 'white' }}>{item.q}</h4>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{item.a}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .premium-view-wrapper {
                    min-height: 100vh;
                }
                .premium-diamond-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 6px 16px;
                    background: rgba(255, 215, 0, 0.1);
                    color: #FFD700;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    margin-bottom: 1.5rem;
                    border: 1px solid rgba(255, 215, 0, 0.2);
                }
                .gold-gradient-text {
                    background: linear-gradient(90deg, #FFB800 0%, #FFF7AD 50%, #FFB800 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .pricing-tag-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    background: #FFD700;
                    color: black;
                    border-radius: 6px;
                    font-size: 0.7rem;
                    font-weight: 900;
                    letter-spacing: 1px;
                }
                .gold-mesh-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(255, 215, 0, 0.08) 0%, transparent 70%);
                    z-index: -1;
                    filter: blur(40px);
                }
                .btn-premium-checkout:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(255, 184, 0, 0.4);
                }
                @media (max-width: 900px) {
                    .premium-glass-panel {
                        grid-template-columns: 1fr !important;
                    }
                    .premium-custom-header h1 {
                        font-size: 2.5rem !important;
                    }
                }
            `}} />
        </div>
    );
};

export default Premium;
