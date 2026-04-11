import React from 'react';
import { Github, Chrome } from 'lucide-react';
import styles from './SocialLogins.module.css';

/**
 * SocialLogins - Handles OAuth providers (Google, Github)
 */
const SocialLogins = ({ handleSocialLogin }) => {
    return (
        <div className={styles.socialGrid}>
            <button 
                type="button" 
                className={styles.socialBtn}
                onClick={() => handleSocialLogin('google')}
            >
                <Chrome size={20} /> Google
            </button>
            <button 
                type="button" 
                className={styles.socialBtn}
                onClick={() => handleSocialLogin('github')}
            >
                <Github size={20} /> Github
            </button>
        </div>
    );
};

export default SocialLogins;
