'use client';
import React, { memo, useState } from 'react';
import { Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ResetPasswordForm.module.css';

/**
 * ResetPasswordForm - Elite Form component (Next.js Port)
 */
const ResetPasswordForm = memo(({ 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, onSubmit, isLoading, error, onRetry 
}) => {
    const [showPassword, setShowPassword] = useState(false);

    if (isLoading) {
        return (
            <div className={styles.formSkeleton}>
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonBtn} />
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="reset-password"
                    label={<><Lock size={14} /> New Password</>}
                    type={showPassword ? "text" : "password"} 
                    placeholder="Min 6 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <Input 
                    id="reset-confirm"
                    label={<><Lock size={14} /> Confirm New Password</>}
                    type={showPassword ? "text" : "password"} 
                    placeholder="Repeat new password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    rightIcon={showPassword ? EyeOff : Eye}
                    onRightIconClick={() => setShowPassword(!showPassword)}
                />

                <Button 
                    type="submit" 
                    className={styles.submitBtn}
                    isLoading={loading}
                    icon={ArrowRight}
                    iconPosition="right"
                    iconSize={20}
                    variant="primary"
                    size="lg"
                >
                    {loading ? "Updating..." : "Update Password"}
                </Button>
            </form>
        </Safeguard>
    );
});

export default ResetPasswordForm;
