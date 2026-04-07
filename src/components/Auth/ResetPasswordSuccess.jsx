import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

const ResetPasswordSuccess = () => {
    return (
        <div className="auth-page-wrapper">
            <div className="glass-card auth-success-box">
                <div className="auth-success-icon-wrapper">
                    <CheckCircle size={40} color="var(--secondary)" />
                </div>
                <h1 className="auth-title">Password Updated!</h1>
                <p className="auth-subtitle" style={{ marginBottom: '2rem' }}>
                    Your new password has been set. Redirecting you to login...
                </p>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto' }} />
            </div>
        </div>
    );
};

export default ResetPasswordSuccess;
