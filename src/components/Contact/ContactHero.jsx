import React from 'react';
import styles from './ContactHero.module.css';

const ContactHero = () => {
    return (
        <header className={styles.heroSection}>
            <div className={styles.heroContent}>
                <div className={styles.badge}>GET IN TOUCH</div>
                <h1 className={styles.title}>How can we <span className="gradient-text">help you?</span></h1>
                <p className={styles.subtitle}>Have a question about a tool, a partnership inquiry, or just want to say hi? We&apos;re all ears.</p>
            </div>
        </header>
    );
};

export default ContactHero;
