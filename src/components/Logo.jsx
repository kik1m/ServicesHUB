import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

/**
 * 💎 Elite Logo Atom
 * Rule #1: Modular Styles (Rule #81)
 */
const Logo = ({ size = 32, className = '', onClick }) => {
    return (
        <Link 
            to="/" 
            className={`${styles.logo} ${className}`} 
            onClick={onClick}
        >
            <img 
                src="/logo.png" 
                alt="HUBly" 
                className={styles.image}
                style={{ height: `${size}px` }} 
            />
            <div className={styles.text} style={{ fontSize: `${size * 0.7}px` }}>
                <span className={styles.white}>HUB</span>
                <span className={styles.gradient}>ly</span>
            </div>
        </Link>
    );
};

export default Logo;


