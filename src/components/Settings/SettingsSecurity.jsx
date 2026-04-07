import React from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';

const SettingsSecurity = ({ 
    passwords, 
    setPasswords, 
    handlePasswordUpdate, 
    showNewPassword, 
    setShowNewPassword, 
    showConfirmPassword, 
    setShowConfirmPassword, 
    saving 
}) => {
    return (
        <form onSubmit={handlePasswordUpdate} className="fade-in">
            <div className="settings-card">
                <h3 className="settings-section-title">Safety & Privacy</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="settings-input-group">
                        <label className="settings-label">New Password</label>
                        <div className="settings-input-wrapper">
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                className="settings-input"
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                placeholder="Minimum 6 characters"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="visibility-toggle"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="settings-input-group">
                        <label className="settings-label">Confirm New Password</label>
                        <div className="settings-input-wrapper">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className="settings-input"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                placeholder="Re-type new password"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="visibility-toggle"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className="security-info-box">
                        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <p>
                            Use a strong password. We recommend a mix of letters, numbers, and symbols to keep your account safe.
                        </p>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" disabled={saving} className="btn-primary btn-settings-save">
                        {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SettingsSecurity;
