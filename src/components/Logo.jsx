'use client';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Logo.module.css';

/**
 * 💎 Elite Logo Atom
 * Rule #1: Modular Styles (Rule #81)
 */
const Logo = ({ size = 32, className = '', onClick, hideText = false }) => {
    return (
        <Link 
            href="/" 
            className={`${styles.logo} ${className} ${hideText ? styles.iconOnly : ''}`} 
            onClick={onClick}
            style={{ 
                '--logo-size': `${size}px`, 
                '--logo-font-size': `${size * 0.7}px` 
            }}
        >
            <Image 
                src="/logo.png" 
                alt=""
                width={size}
                height={size}
                className={styles.image}
                priority
            />
            {!hideText && (
                <div className={styles.text}>
                    <span className={styles.white}>HUB</span>
                    <span className={styles.gradient}>ly</span>
                </div>
            )}
        </Link>
    );
};

export default Logo;


