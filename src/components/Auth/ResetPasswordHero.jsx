import React from 'react';
import { ShieldCheck } from 'lucide-react';
import styles from './ResetPasswordHero.module.css';

/**
 * ResetPasswordHero - Header for the reset password page
 */
const ResetPasswordHero = () => {
    return (
        <div className={styles.headerGroup}>
            <div className={styles.shieldWrapper}>
                <ShieldCheck size={28} />
            </div>
            <h1 className={styles.title}>
                Set <span className="gradient-text">New Password</span>
            </h1>
            <p className={styles.subtitle}>Enter your new secure password below.</p>
        </div>
    );
};

export default ResetPasswordHero;
