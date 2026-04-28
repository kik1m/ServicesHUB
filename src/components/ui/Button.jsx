import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

/**
 * Global UI Atom: Button
 * Supports variants: primary, secondary, outline, text, ghost, danger
 */
const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    disabled = false, 
    icon: Icon,
    iconPosition = 'left',
    iconSize = 18,
    className = '',
    as: Component = 'button',
    onClick,
    ...props 
}) => {
    const buttonClasses = `
        ${styles.btn} 
        ${styles[variant]} 
        ${styles[size]} 
        ${className}
    `.trim();

    // Determine the final component type
    // If it's a button, we add the 'type' attribute
    const isButton = Component === 'button';

    return (
        <Component
            className={buttonClasses}
            disabled={disabled || isLoading}
            onClick={onClick}
            {...(isButton ? { type: props.type || 'button' } : {})}
            {...props}
        >
            {isLoading && <Loader2 size={18} className={styles.spinner} />}
            
            {!isLoading && Icon && iconPosition === 'left' && <Icon size={iconSize} />}
            
            {children}
            
            {!isLoading && Icon && iconPosition === 'right' && <Icon size={iconSize} />}
        </Component>
    );
};

export default Button;




