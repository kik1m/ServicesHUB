import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import styles from './ResetPasswordSuccess.module.css';

/**
 * ResetPasswordSuccess - Feedback component for a successful password change
 */
const ResetPasswordSuccess = () => {
    return (
        <div className={styles.pageWrapper}>
            <div className={`glass-card ${styles.successBox}`}>
                <div className={styles.successIconWrapper}>
                    <CheckCircle size={48} color="#00ff88" />
                </div>
                <h1 className={styles.title}>Password Updated!</h1>
                <p className={styles.subtitle} style={{ marginBottom: '2rem' }}>
                    Your new password has been set. Redirecting you to login...
                </p>
                <Loader2 className="animate-spin" size={24} style={{ margin: '0 auto', color: '#00ff88' }} />
            </div>
        </div>
    );
};

export default ResetPasswordSuccess;
