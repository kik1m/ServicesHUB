import React from 'react';
import { ShieldCheck, CheckCircle2, TrendingUp, Star } from 'lucide-react';

const PromoteTrustFooter = () => {
    return (
        <footer className="promote-trust-footer">
            <div className="trust-icon-box">
                <ShieldCheck size={42} />
            </div>
            <h3>Secure Global Promotion</h3>
            <p className="trust-desc">
                Trusted by 500+ SaaS founders. Our payment processing is handled securely via <strong>Lemon Squeezy</strong>.
            </p>
            <div className="trust-tags-row">
                {[
                    { label: 'Lemon Squeezy', icon: <CheckCircle2 size={16} /> },
                    { label: 'Instant Activation', icon: <TrendingUp size={16} /> },
                    { label: 'Analytics Included', icon: <Star size={16} /> }
                ].map((tag, i) => (
                    <div key={i} className="trust-tag-item">
                        <span>{tag.icon}</span> {tag.label}
                    </div>
                ))}
            </div>
        </footer>
    );
};

export default PromoteTrustFooter;
