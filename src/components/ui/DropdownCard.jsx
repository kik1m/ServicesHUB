import React from 'react';
import styles from './DropdownCard.module.css';

/**
 * 💎 Elite Dropdown Card Atom
 * Rule #1: Shared UI Atom
 * Rule #2: Modular Styles
 */
const DropdownCard = ({ children, className = '', style = {} }) => {
    return (
        <div 
            className={`${styles.card} ${className}`} 
            style={style}
        >
            {children}
        </div>
    );
};

export default DropdownCard;
