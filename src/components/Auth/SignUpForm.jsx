import React, { useState, memo } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SignUpForm.module.css';
import { AUTH_UI_CONSTANTS } from '../../constants/authConstants';
import { useToast } from '../../context/ToastContext';

/**
 * SignUpForm - Elite Autonomous Component
 * Rule #14: Data-Driven UI via constants
 * Rule #112: Zero inline styles
 */
const SignUpForm = memo(({ onSubmit, loading, isInitialLoading, error, onRetry }) => {
    const labels = AUTH_UI_CONSTANTS.signup.form;
    const { showToast } = useToast();

    // Internal state management
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            showToast(AUTH_UI_CONSTANTS.validation.passwordsMatch, 'error');
            return;
        }

        onSubmit(email, password, fullName);
    };

    if (isInitialLoading) {
        return (
            <div className={styles.formSkeleton}>
                <Skeleton className={styles.skeletonInput} />
                <Skeleton className={styles.skeletonInput} />
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
                    id="signup-fullname"
                    label={<><User size={14} /> {labels?.nameLabel}</>}
                    placeholder={labels?.namePlaceholder} 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <Input 
                    id="signup-email"
                    label={<><Mail size={14} /> {labels?.emailLabel}</>}
                    type="email" 
                    placeholder={labels?.emailPlaceholder} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className={styles.inputGroup}>
                    <label htmlFor="signup-password">
                        <Lock size={14} /> {labels?.passwordLabel}
                    </label>
                    <Input 
                        id="signup-password"
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

                <Input 
                    id="signup-confirm"
                    label={<><Lock size={14} /> {labels?.confirmLabel}</>}
                    type={showPassword ? "text" : "password"} 
                    placeholder={labels?.confirmPlaceholder} 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <Button 
                    type="submit" 
                    className={styles.submitBtn}
                    isLoading={loading}
                    icon={Sparkles}
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

export default SignUpForm;
