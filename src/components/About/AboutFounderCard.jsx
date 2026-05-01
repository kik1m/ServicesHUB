import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import styles from './AboutFounderCard.module.css';

/**
 * AboutFounderCard - Elite Standalone Component
 * Rule #14: Component modularity
 * Rule #112: Zero inline styles
 */
const AboutFounderCard = () => {
    return (
        <div className={`${styles.founderCard} glass-card`}>
            <div className={styles.avatarWrapper}>
                <img src="/logo.png" alt="HUBly Logo" className={styles.avatar} />
            </div>
            
            <div className={styles.nameContainer}>
                <h3 className={styles.name}>Karim Mahmoud</h3>
                <CheckCircle2 size={22} className={styles.verifiedBadge} strokeWidth={2.5} />
            </div>
            
            <div className={styles.title}>Founder & CEO</div>
            
            <div className={styles.divider}></div>
            
            <p className={styles.bio}>
                Architecting the ultimate discovery engine to connect creators and seekers through AI-powered curation.
            </p>
        </div>
    );
};

export default AboutFounderCard;
