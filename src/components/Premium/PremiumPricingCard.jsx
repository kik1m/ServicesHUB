import React from 'react';
import { Award, Rocket, Star, Zap, Globe, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

const PremiumPricingCard = ({ user, loading, onUpgrade }) => {
    const perks = [
        { title: 'Unlimited Tool Submissions', desc: 'List your innovations without bounds.', icon: <Rocket size={16} /> },
        { title: 'Golden Verification Badge', desc: 'Diamond status on profile and every tool.', icon: <Star size={16} /> },
        { title: 'Priority Support & Review', desc: 'Jump to the front of the queue.', icon: <Zap size={16} /> },
        { title: 'Performance Insights', desc: 'Advanced analytics in your dashboard.', icon: <Globe size={16} /> }
    ];

    return (
        <section className="premium-main-card-container">
            <div className="gold-mesh-glow"></div>

            <div className="premium-glass-panel">
                {/* Features Column */}
                <div className="premium-features-col">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '12px',
                            background: 'rgba(255, 215, 0, 0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Award size={24} color="#FFD700" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>Membership Perks</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Scale with Diamond status.</p>
                        </div>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                        {perks.map((item, i) => (
                            <li key={i} className="premium-feature-item">
                                <div className="feature-icon-box">
                                    {item.icon}
                                </div>
                                <div className="feature-content">
                                    <strong style={{ display: 'block', fontSize: '1rem', color: 'white', marginBottom: '2px' }}>{item.title}</strong>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Pricing Column */}
                <div className="premium-pricing-col">
                    <div className="pricing-tag-badge">LIFETIME DEAL</div>
                    
                    <div className="pricing-amount-row">
                        <span className="currency">$</span>
                        <span className="amount">120</span>
                        <span className="period">ONE-TIME</span>
                    </div>

                    <div style={{ width: '100%', marginBottom: '2rem' }}>
                        {user?.is_premium ? (
                            <div className="premium-badge-status">
                                ALREADY A PREMIUM MEMBER
                            </div>
                        ) : (
                            <button
                                onClick={onUpgrade}
                                disabled={loading}
                                className="btn-premium-checkout"
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
    );
};

export default PremiumPricingCard;
