import React, { useState, memo } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './LoginForm.module.css';
import { AUTH_UI_CONSTANTS } from '../../constants/authConstants';

/**
 * LoginForm - Elite Autonomous Component
 * Rule #14: Data-Driven via Constants
 * Rule #112: Zero inline styles
 */
const LoginForm = memo(({ onSubmit, onForgotPassword, loading, isInitialLoading, error, onRetry }) => {
    const labels = AUTH_UI_CONSTANTS.login.form;
    
    // Internal state management for cleaner orchestration
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
        <Safeguard error={error} onRetry={onRetry} title={labels?.submitBtn}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="login-email"
                    label={<><Mail size={14} /> {labels?.emailLabel}</>}
                    type="email" 
                    placeholder={labels?.emailPlaceholder} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className={styles.inputGroup}>
                    <div className={styles.labelRow}>
                        <label htmlFor="login-password">
                            <Lock size={14} /> {labels?.passwordLabel}
                        </label>
                        <button 
                            type="button"
                            onClick={onForgotPassword}
                            className={styles.textLink}
                        >
                            {labels?.forgotPassword}
                        </button>
                    </div>
                    <Input 
                        id="login-password"
                        type={showPassword ? "text" : "password"} 
                        placeholder={labels?.passwordPlaceholder} 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        rightIcon={showPassword ? EyeOff : Eye}
                        onRightIconClick={() => setShowPassword(!showPassword)}
                        className={styles.fullWidthInput}
                    />
                </div>

                <Button 
                    type="submit" 
                    className={styles.submitBtn}
                    isLoading={loading}
                    icon={LogIn}
                    iconSize={20}
                    variant="primary"
                    size="lg"
                >
                    {loading ? labels?.loadingBtn : labels?.submitBtn}
                </Button>
            </form>
        </Safeguard>
    );
});

export default LoginForm;
