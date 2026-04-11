import React from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import styles from './LoginForm.module.css';

/**
 * LoginForm - Scoped component for the login step
 */
const LoginForm = ({ 
    email, setEmail, 
    password, setPassword, 
    showPassword, setShowPassword, 
    handleAuth, 
    setForgotPasswordMode, 
    loading 
}) => {
    return (
        <form onSubmit={handleAuth} className={styles.form}>
            <div className={styles.inputGroup}>
                <label><Mail size={14} /> Email Address</label>
                <input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.inputField}
                    required
                />
            </div>

            <div className={styles.inputGroup}>
                <div className={styles.labelRow}>
                    <label><Lock size={14} /> Password</label>
                    <button 
                        type="button"
                        onClick={() => setForgotPasswordMode(true)}
                        className={styles.textLink}
                        style={{ fontSize: '0.75rem' }}
                    >
                        Forgot?
                    </button>
                </div>
                <div className={styles.passwordWrapper}>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles.inputField}
                        required
                    />
                    <button 
                        type="button" 
                        className={styles.visibilityToggle}
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button 
                type="submit" 
                className={`${styles.submitBtn} btn-primary`}
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /> Sign In</>}
            </button>
        </form>
    );
};

export default LoginForm;
