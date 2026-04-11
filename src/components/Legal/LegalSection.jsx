import React from 'react';
import styles from './LegalSection.module.css';

const LegalSection = ({ icon: Icon, number, title, children }) => {
    return (
        <div className={styles.unit}>
            <h2 className={styles.header}>
                <span className="gradient-text">{number}.</span>
                {Icon && <Icon size={24} color="var(--primary)" />}
                {title}
            </h2>
            <div className={styles.titleText}>
                {children}
            </div>
        </div>
    );
};

export default LegalSection;
