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
                            <h3 className={styles.settingsSectionTitle}>Account Security</h3>
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
        </Safeguard>
    );
});

export default SettingsSecurity;
