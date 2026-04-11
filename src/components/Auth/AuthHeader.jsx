import React from 'react';
import Logo from '../Logo';
import styles from './AuthHeader.module.css';

/**
 * AuthHeader - Dynamic header for login/signup/forgot password
 */
const AuthHeader = ({ isLogin, forgotPasswordMode }) => {
    let title = isLogin ? "Welcome Back" : "Join the Universe";
    if (forgotPasswordMode) title = "Recover Access";

    return (
        <div className={styles.header}>
            <div className={styles.logoWrapper}>
                <Logo size={42} className={styles.centeredLogo} />
            </div>
            <h2 className={styles.title}>{title}</h2>
        </div>
    );
};

export default AuthHeader;
