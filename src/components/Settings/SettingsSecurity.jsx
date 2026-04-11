import React from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import styles from './SettingsSecurity.module.css';

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
        <form onSubmit={handlePasswordUpdate} className={styles.fadeIn}>
            <div className={styles.settingsCard}>
                <h3 className={styles.settingsSectionTitle}>Safety & Privacy</h3>
                <div className={styles.settingsContent}>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>New Password</label>
                        <div className={styles.settingsInputWrapper}>
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                className={styles.settingsInput}
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                placeholder="Minimum 6 characters"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className={styles.visibilityToggle}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className={styles.settingsInputGroup}>
                        <label className={styles.settingsLabel}>Confirm New Password</label>
                        <div className={styles.settingsInputWrapper}>
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                className={styles.settingsInput}
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                placeholder="Re-type new password"
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className={styles.visibilityToggle}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    <div className={styles.securityInfoBox}>
                        <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <p>
                            Use a strong password. We recommend a mix of letters, numbers, and symbols to keep your account safe.
                        </p>
                    </div>
                </div>

                <div className={styles.settingsActions}>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SettingsSecurity;
