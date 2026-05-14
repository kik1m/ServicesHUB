'use client';
import React, { useState, memo } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ForgotPasswordForm.module.css';

/**
 * ForgotPasswordForm - Elite Autonomous Component (Next.js Port)
 */
const ForgotPasswordForm = memo(({ onSubmit, onBack, loading, isInitialLoading, error, onRetry }) => {
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
        <Safeguard error={error} onRetry={onRetry}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="forgot-email"
                    label={<><Mail size={14} /> Recovery Email</>}
                    type="email" 
                    placeholder="name@example.com" 
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
                    {loading ? "Sending link..." : "Send Recovery Link"}
                </Button>

                <button 
                    type="button" 
                    onClick={onBack}
                    className={styles.backBtn}
                >
                    <ArrowLeft size={16} /> Back to Sign In
                </button>
            </form>
        </Safeguard>
    );
});

export default ForgotPasswordForm;
