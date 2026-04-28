import React from 'react';
import styles from './SectionHeader.module.css';

/**
 * Shared UI Atom: SectionHeader
 * Unifies h2, description, and optional actions/links for page sections.
 */
const SectionHeader = ({ 
    title, 
    subtitle, 
    description, 
    align = 'left', 
    children, 
    className = '' 
}) => {
    const containerClasses = `
        ${styles.headerRow} 
        ${align === 'center' ? styles.center : ''} 
        ${className}
    `.trim();

    return (
        <div className={containerClasses}>
            <div className={styles.textGroup}>
                <h2 className={styles.title}>
                    {title} {subtitle && <span className={styles.gradientText}>{subtitle}</span>}
                </h2>
                {description && <p className={styles.description}>{description}</p>}
            </div>
            {children && <div className={styles.actions}>{children}</div>}
        </div>
    );
};

export default SectionHeader;
