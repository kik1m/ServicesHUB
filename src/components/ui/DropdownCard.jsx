import React from 'react';
import styles from './DropdownCard.module.css';

/**
 * 💎 Elite Dropdown Card Atom
 * Rule #1: Shared UI Atom
 * Rule #2: Modular Styles
 */
const DropdownCard = ({ children, className = '' }) => {
    return (
        <div 
            className={`${styles.card} ${className}`} 
        >
            {children}
        </div>
    );
};

export default DropdownCard;
