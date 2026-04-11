import React from 'react';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import styles from './ResetPasswordForm.module.css';

/**
 * ResetPasswordForm - Form for setting a new password
 */
const ResetPasswordForm = ({ 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword, 
    loading, 
    onSubmit 
}) => {
    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label><Lock size={14} /> New Password</label>
                <input 
                    type="password" 
                    placeholder="Min 6 characters" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.inputField}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <label><Lock size={14} /> Confirm Password</label>
                <input 
                    type="password" 
                    placeholder="Repeat password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.inputField}
                    required
                />
            </div>

            <button 
                type="submit" 
                className={`${styles.submitBtn} btn-primary`}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <>Update & Login <ArrowRight size={20} /></>}
            </button>
        </form>
    );
};

export default ResetPasswordForm;
