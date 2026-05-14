'use client';
import React, { memo } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './ResetPasswordSuccess.module.css';

/**
 * ResetPasswordSuccess - Elite feedback component (Next.js Port)
 */
const ResetPasswordSuccess = memo(({ error, onRetry }) => {
    const router = useRouter();

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.successContainer}>
                <div className={styles.iconWrapper}>
                    <CheckCircle2 size={48} className={styles.successIcon} />
                </div>
                
                <h2 className={styles.title}>Password Updated!</h2>
                <p className={styles.subtitle}>Your account security has been restored. You can now sign in with your new credentials.</p>

                <Button 
                    onClick={() => router.push('/auth')} 
                    variant="primary" 
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className={styles.actionBtn}
                >
                    Proceed to Sign In
                </Button>
            </div>
        </Safeguard>
    );
});

export default ResetPasswordSuccess;
