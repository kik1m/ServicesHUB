import React from 'react';
import { Mail, Loader2 } from 'lucide-react';

const ForgotPasswordForm = ({ email, setEmail, handleForgotPassword, setForgotPasswordMode, loading }) => {
    return (
        <form onSubmit={handleForgotPassword} className="auth-form fade-in">
            <div className="input-group-slim">
                <label><Mail size={14} /> Email Address</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="slim-input-field" 
                    placeholder="name@company.com" 
                    required 
                />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn-auth-submit">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Link'}
            </button>
            <button 
                type="button" 
                onClick={() => setForgotPasswordMode(false)} 
                className="text-link-slim auth-switch-text"
                style={{ width: '100%', textAlign: 'center' }}
            >
                Back to Login
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
