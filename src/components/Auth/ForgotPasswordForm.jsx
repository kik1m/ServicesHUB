import React, { useState, memo } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ForgotPasswordForm.module.css';
import { AUTH_UI_CONSTANTS } from '../../constants/authConstants';

/**
 * ForgotPasswordForm - Elite Autonomous Component
 * Rule #14: Data-Driven UI via constants
 * Rule #112: Zero inline styles
 */
const ForgotPasswordForm = memo(({ onSubmit, onBack, loading, isInitialLoading, error, onRetry }) => {
    const labels = AUTH_UI_CONSTANTS.forgotPassword.form;
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email);
    };

    if (isInitialLoading) {
        return (
            <div className={styles.formSkeleton}>
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonBtn} />
                <Skeleton className={styles.skeletonBack} />
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry} title={labels?.submitBtn}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="forgot-email"
                    label={<><Mail size={14} /> {labels?.emailLabel}</>}
                    type="email" 
                    placeholder={labels?.emailPlaceholder} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Button 
                    type="submit" 
                    className={styles.submitBtn}
                    isLoading={loading}
                    icon={Send}
                    iconSize={18}
                    variant="primary"
                    size="lg"
                >
                    {loading ? labels?.loadingBtn : labels?.submitBtn}
                </Button>

                <button 
                    type="button" 
                    onClick={onBack}
                    className={styles.backBtn}
                >
                    <ArrowLeft size={16} /> {labels?.backToLogin}
                </button>
            </form>
        </Safeguard>
    );
});

export default ForgotPasswordForm;
