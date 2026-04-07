import React from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

const LoginForm = ({ 
    email, setEmail, 
    password, setPassword, 
    showPassword, setShowPassword, 
    handleAuth, 
    setForgotPasswordMode, 
    loading 
}) => {
    return (
        <form onSubmit={handleAuth} className="auth-form">
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
            <div className="input-group-slim">
                <div className="input-label-row">
                    <label><Lock size={14} /> Password</label>
                    <button 
                        type="button" 
                        onClick={() => setForgotPasswordMode(true)} 
                        className="text-link-slim" 
                        style={{ fontSize: '0.75rem' }}
                    >
                        Forgot?
                    </button>
                </div>
                <div className="password-input-wrapper">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="slim-input-field" 
                        placeholder="••••••••" 
                        required 
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)} 
                        className="visibility-toggle"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-auth-submit">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
                Sign In
            </button>
        </form>
    );
};

export default LoginForm;
