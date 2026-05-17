'use client';
import React, { useState, memo } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './SignUpForm.module.css';
import { useToast } from '../../context/ToastContext';

/**
 * SignUpForm - Elite Autonomous Component (Next.js Port)
 */
const SignUpForm = memo(({ onSubmit, loading, isInitialLoading, error, onRetry }) => {
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
            showToast("Passwords do not match. Please verify.", 'error');
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
        <Safeguard>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input 
                    id="signup-fullname"
                    label={<><User size={14} /> Full Name</>}
                    placeholder="John Doe" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />

                <Input 
                    id="signup-email"
                    label={<><Mail size={14} /> Email Address</>}
                    type="email" 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className={styles.inputGroup}>
                    <label htmlFor="signup-password" className={styles.fieldLabel}>
                        <Lock size={14} /> Create Password
                    </label>
                    <Input 
                        id="signup-password"
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

                <Input 
                    id="signup-confirm"
                    label={<><Lock size={14} /> Confirm Password</>}
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
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
                    {loading ? "Creating Account..." : "Join the Community"}
                </Button>
            </form>
        </Safeguard>
    );
});

export default SignUpForm;
