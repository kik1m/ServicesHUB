import React from 'react';
import { CreditCard, Sparkles } from 'lucide-react';

const SettingsBilling = ({ profile }) => {
    const isPremium = profile.is_premium;

    return (
        <div className="fade-in">
            <div className="settings-card billing-status-container">
                <div className={`billing-icon-box ${isPremium ? 'premium-active' : ''}`}>
                    {isPremium ? <Sparkles size={40} className="glow-icon" /> : <CreditCard size={40} />}
                </div>

                <div className="billing-text-content">
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px', color: 'white' }}>
                        {isPremium ? 'Premium Subscription Active' : 'Subscription Plan'}
                    </h3>
                    
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
                        {isPremium ? (
                            <>
                                You are currently on the <span className="premium-text-glow">Premium</span> plan. 
                                Enjoy full access to professional tools, featured listings, and priority support.
                            </>
                        ) : (
                            <>
                                You are currently on the <span style={{ color: 'white', fontWeight: '700' }}>Free</span> plan. 
                                Upgrade to unlock premium features and increase your visibility.
                            </>
                        )}
                    </p>

                    {!isPremium ? (
                        <a href="/premium" className="btn-premium-upgrade">
                            <Sparkles size={18} /> Upgrade Account
                        </a>
                    ) : (
                        <div className="premium-status-badge">
                            <Sparkles size={16} /> Verified Premium Member
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsBilling;
