import React from 'react';
import { Mail, Lock, User, UserPlus, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';

const SignUpForm = ({ 
    fullName, setFullName, 
    email, setEmail, 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    showPassword, setShowPassword, 
    handleAuth, 
    loading 
}) => {
    return (
        <form onSubmit={handleAuth} className="auth-form">
            <div className="input-group-slim">
                <label><User size={14} /> Full Name</label>
                <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    className="slim-input-field" 
                    placeholder="John Doe" 
                    required 
                />
            </div>
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
                <label><Lock size={14} /> Password</label>
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
            <div className="input-group-slim">
                <label><ShieldCheck size={14} /> Confirm Password</label>
                <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="slim-input-field" 
                    placeholder="••••••••" 
                    required 
                />
            </div>

            <button type="submit" disabled={loading} className="btn-primary btn-auth-submit">
                {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                Create Account
            </button>
        </form>
    );
};

export default SignUpForm;
