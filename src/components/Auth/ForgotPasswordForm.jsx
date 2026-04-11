import React from 'react';
import { Mail, ArrowLeft, Send, Loader2 } from 'lucide-react';
import styles from './ForgotPasswordForm.module.css';

/**
 * ForgotPasswordForm - Handles the email submission for recovery
 */
const ForgotPasswordForm = ({ 
    email, setEmail, 
    handleForgotPassword, 
    setForgotPasswordMode, 
    loading 
}) => {
    return (
        <form onSubmit={handleForgotPassword} className={styles.form}>
            <div className={styles.inputGroup}>
                <label><Mail size={14} /> Recovery Email</label>
                <input 
                    type="email" 
                    placeholder="Enter your registered email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    required
                />
            </div>

            <button 
                type="submit" 
                className={`${styles.submitBtn} btn-primary`}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Recovery Link</>}
            </button>

            <button 
                type="button" 
                onClick={() => setForgotPasswordMode(false)}
                className={styles.textLink}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '5px',
                    width: '100%',
                    marginTop: '1rem'
                }}
            >
                <ArrowLeft size={16} /> Back to Sign In
            </button>
        </form>
    );
};

export default ForgotPasswordForm;
