'use client';
import React, { useState, memo } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './LoginForm.module.css';

/**
 * LoginForm - Elite Autonomous Component (Next.js Port)
 */
const LoginForm = memo(({ onSubmit, onForgotPassword, loading, isInitialLoading, error, onRetry }) => {
    
    // Internal state management
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email, password);
    };

    if (isInitialLoading) {
        return (
            <div className={styles.formSkeleton}>
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonBtn} />
            </div>
        );
    }

    return (
        <Safeguard>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="login-email"
                    label={<><Mail size={14} /> Email Address</>}
                    type="email" 
                    placeholder="name@company.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className={styles.inputGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="login-password">
                            <Lock size={14} /> Password
                        </label>
                        <button 
                            type="button"
                            onClick={onForgotPassword}
                            className={styles.textLink}
                        >
                            Forgot Password?
                        </button>
                    </div>
                    <Input 
                        id="login-password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        rightIcon={showPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        className={styles.fullWidthInput}
                    />
                </div>

                {error && (
                    <div className={styles.inlineError}>
                        {error}
                    </div>
                )}

                <Button 
                    type="submit" 
                    className={styles.submitBtn}
                    isLoading={loading}
                    icon={LogIn}
                    iconSize={20}
                    variant="primary"
                    size="lg"
                >
                    {loading ? "Authenticating..." : "Sign In to HUBly"}
                </Button>
            </form>
        </Safeguard>
    );
});

export default LoginForm;
