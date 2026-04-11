import React from 'react';
import { Ghost } from 'lucide-react';
import styles from './NotFoundHero.module.css';

const NotFoundHero = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.iconBox}>
                <Ghost size={40} color="white" />
            </div>
            
            <h1 className={styles.title404}>404</h1>
            <h2 className={styles.title}>Oops! Page Not Found</h2>
            <p className={styles.subtitle}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
        </div>
    );
};

export default NotFoundHero;
