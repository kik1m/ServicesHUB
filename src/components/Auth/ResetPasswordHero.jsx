import React from 'react';
import { ShieldCheck } from 'lucide-react';

const ResetPasswordHero = () => {
    return (
        <div className="auth-header-group">
            <div className="shield-icon-wrapper">
                <ShieldCheck size={28} />
            </div>
            <h1 className="auth-title">
                Set <span className="gradient-text">New Password</span>
            </h1>
            <p className="auth-subtitle">Enter your new secure password below.</p>
        </div>
    );
};

export default ResetPasswordHero;
