import React from 'react';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

const ResetPasswordForm = ({ 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword, 
    loading, 
    onSubmit 
}) => {
    return (
        <form onSubmit={onSubmit}>
            <div className="auth-input-group">
                <label className="auth-input-label">New Password</label>
                <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                    <Lock className="search-icon" size={18} />
                    <input 
                        type="password" 
                        placeholder="Min 6 characters" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px', outline: 'none' }} 
                    />
                </div>
            </div>

            <div className="auth-input-group" style={{ marginBottom: '2.5rem' }}>
                <label className="auth-input-label">Confirm Password</label>
                <div className="nav-search-wrapper" style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.03)' }}>
                    <Lock className="search-icon" size={18} />
                    <input 
                        type="password" 
                        placeholder="Repeat password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', paddingLeft: '10px', outline: 'none' }} 
                    />
                </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', height: '56px' }} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Update & Login <ArrowRight size={20} /></>}
            </button>
        </form>
    );
};

export default ResetPasswordForm;
