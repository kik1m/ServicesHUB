import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';
import styles from './ErrorState.module.css';

/**
 * Unified UI Atom: ErrorState - Elite Standard
 * Optimized for both full-page critical errors and section-level isolated failures.
 */
const ErrorState = ({ 
    title = 'Something went wrong', 
    message, 
    onRetry,
    fullPage = false,
    icon: Icon = AlertCircle,
    className = ''
}) => {
    return (
        <div className={`${styles.errorWrapper} ${fullPage ? styles.fullPage : styles.section} ${className}`}>
            <div className={styles.errorContent}>
                <div className={styles.errorIcon}>
                    <Icon size={fullPage ? 64 : 48} />
                </div>
                <h3 className={styles.errorTitle}>{title}</h3>
                {message && <p className={styles.errorMessage}>{message}</p>}
                
                {onRetry && (
                    <Button 
                        variant="outline" 
                        onClick={onRetry}
                        icon={RotateCcw}
                        className={styles.retryBtn}
                    >
                        Try Again
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorState;
