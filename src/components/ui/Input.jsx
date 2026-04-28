import React from 'react';
import styles from './Input.module.css';

/**
 * Global UI Atom: Input / TextArea
 * Hardened for Elite standard with support for icons on both sides
 */
const Input = ({ 
    label, 
    error, 
    type = 'text', 
    icon: Icon,
    rightIcon: RightIcon,
    onRightIconClick,
    className = '',
    wrapperClassName = '',
    multiline = false,
    variant = 'pill', // 'pill' or 'naked'
    fieldClassName = '',
    isLoading, // Destructure isLoading to prevent DOM warning
    ...props 
}) => {
    const Component = multiline ? 'textarea' : 'input';
    
    return (
        <div className={`${styles.inputGroup} ${className}`}>
            {label && <label className={styles.label}>{label}</label>}
            
            <div className={`${styles.inputWrapper} ${styles[variant]} ${error ? styles.inputError : ''} ${wrapperClassName}`}>
                {Icon && (
                    <Icon size={18} className={styles.iconWrapper} />
                )}
                
                <Component 
                    type={multiline ? undefined : type}
                    className={`${styles.field} ${fieldClassName}`}
                    {...props}
                    value={props.value ?? ''}
                />

                {RightIcon && (
                    <button 
                        type="button" 
                        onClick={onRightIconClick}
                        className={`${styles.rightIconBtn} ${onRightIconClick ? styles.clickable : ''}`}
                    >
                        <RightIcon size={18} />
                    </button>
                )}
            </div>
            
            {error && <span className={styles.errorMessage}>{error}</span>}
        </div>
    );
};

export default Input;
// Force rebuild trigger: 2026-04-25-v2
