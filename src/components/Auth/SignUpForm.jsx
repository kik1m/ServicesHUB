import React from 'react';
import { Mail, Lock, Eye, EyeOff, User, Sparkles, Loader2 } from 'lucide-react';
import styles from './SignUpForm.module.css';

/**
 * SignUpForm - Scoped component for the registration step
 */
const SignUpForm = ({
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    showPassword, setShowPassword,
    handleAuth,
    loading
}) => {
    return (
        <form onSubmit={handleAuth} className={styles.form}>
            <div className={styles.inputGroup}>
                <label><User size={14} /> Full Name</label>
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    className={styles.inputField}
                    required
                />
            </div>

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
                <label><Lock size={14} /> Create Password</label>
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

            <div className={styles.inputGroup}>
                <label><Lock size={14} /> Confirm Password</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
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
                {loading ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={20} /> Create Account</>}
            </button>
        </form>
    );
};

export default SignUpForm;
