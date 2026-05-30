'use client';
import React, { memo } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Save } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SettingsSecurity.module.css';

/**
 * SettingsSecurity - Elite Hardened Card (Next.js Port)
 */
const SettingsSecurity = memo(({ 
    passwords, 
    setPasswords, 
    handlePasswordUpdate, 
    showNewPassword, 
    setShowNewPassword,
    showConfirmPassword, 
    setShowConfirmPassword,
    handleDeleteAIMemory,
    saving,
    isLoading,
    error,
    onRetry
}) => {

    if (isLoading) {
        return (
            <div className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <Skeleton className={styles.skeletonTitle} />
                    <Skeleton className={styles.skeletonSubtitle} />
                    <div className={styles.securityForm}>
                        <Skeleton className={styles.skeletonInput} />
                        <Skeleton className={styles.skeletonInput} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <form onSubmit={handlePasswordUpdate} className={styles.fadeIn}>
                <div className={styles.settingsCard}>
                    <div className={styles.securityHeader}>
                        <ShieldCheck size={32} className={styles.securityIcon} />
                        <div>
                            <h2 className={styles.settingsSectionTitle}>Account Security</h2>
                            <p className={styles.settingsSectionSubtitle}>Update your password to keep your account secure.</p>
                        </div>
                    </div>
                    
                    <div className={styles.securityForm}>
                        <Input 
                            label="New Password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwords?.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            placeholder="Min 6 characters"
                            icon={Lock}
                            rightIcon={showNewPassword ? EyeOff : Eye}
                            onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                        />
                        
                        <Input 
                            label="Confirm New Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwords?.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            placeholder="Repeat new password"
                            icon={Lock}
                            rightIcon={showConfirmPassword ? EyeOff : Eye}
                            onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                </div>

                <div className={styles.settingsActions}>
                    <Button 
                        type="submit" 
                        isLoading={saving} 
                        className={styles.btnSettingsSave}
                        icon={Save}
                    >
                        Update Password
                    </Button>
                </div>
            </form>

            {/* AI Data & Privacy Section (GDPR Compliance) */}
            <div className={`${styles.fadeIn} ${styles.privacySection}`} style={{ marginTop: '30px' }}>
                <div className={styles.settingsCard} style={{ borderColor: '#ef4444' }}>
                    <div className={styles.securityHeader}>
                        <ShieldCheck size={32} className={styles.securityIcon} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }} />
                        <div>
                            <h2 className={styles.settingsSectionTitle} style={{ color: '#ef4444' }}>AI Data & Privacy (GDPR)</h2>
                            <p className={styles.settingsSectionSubtitle}>Manage what HUBly AI remembers about you and your projects.</p>
                        </div>
                    </div>
                    
                    <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div>
                                <h4 style={{ color: '#e2e8f0', margin: '0 0 8px 0', fontSize: '1rem' }}>Delete AI Long-Term Memory</h4>
                                <p style={{ color: '#94a3b8', margin: '0', fontSize: '0.9rem', maxWidth: '500px', lineHeight: '1.5' }}>
                                    Permanently erase all context, project details, and preferences that HUBly AI has learned about you over time. This action cannot be reversed.
                                </p>
                            </div>
                            <Button 
                                type="button" 
                                variant="outline" 
                                icon={Save} 
                                onClick={handleDeleteAIMemory}
                                style={{ borderColor: 'rgba(239, 68, 68, 0.5)', color: '#ef4444' }}
                                disabled={saving}
                            >
                                Delete AI Memory
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
});

export default SettingsSecurity;
