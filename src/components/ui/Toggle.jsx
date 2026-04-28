import React from 'react';
import styles from './Toggle.module.css';

/**
 * Toggle Component - Atomic UI Element
 */
const Toggle = ({ checked, onChange, disabled = false, ariaLabel = 'Toggle' }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={ariaLabel}
            disabled={disabled}
            className={`${styles.toggle} ${checked ? styles.checked : ''}`}
            onClick={() => !disabled && onChange && onChange(!checked)}
        >
            <span className={styles.handle} />
        </button>
    );
};

export default Toggle;
