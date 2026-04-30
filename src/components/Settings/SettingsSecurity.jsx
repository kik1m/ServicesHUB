import React, { memo } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Save } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SettingsSecurity.module.css';

/**
 * SettingsSecurity - Elite Hardened Card
 * Rule #18: Memoized for performance
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
    onRetry,
    content
}) => {
    // Standard Skeleton Loading - Rule #11
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
                <div className={styles.settingsActions}>
                    <Skeleton className={styles.skeletonButton} />
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
                            <h3 className={styles.settingsSectionTitle}>{content?.title}</h3>
                            <p className={styles.settingsSectionSubtitle}>{content?.subtitle}</p>
                        </div>
                    </div>
                    
                    <div className={styles.securityForm}>
                        {/* Unified Atomic Inputs with proper icon positioning */}
                        <Input 
                            label={content?.newPassword}
                            type={showNewPassword ? "text" : "password"}
                            value={passwords?.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            placeholder="••••••••"
                            className={styles.settingsInputGroup}
                            icon={Lock}
                            rightIcon={showNewPassword ? EyeOff : Eye}
                            onRightIconClick={() => setShowNewPassword(!showNewPassword)}
                        />
                        
                        <Input 
                            label={content?.confirmPassword}
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwords?.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            placeholder="••••••••"
                            className={styles.settingsInputGroup}
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
                        {content?.saveBtn}
                    </Button>
                </div>
            </form>
        </Safeguard>
    );
});

export default SettingsSecurity;
