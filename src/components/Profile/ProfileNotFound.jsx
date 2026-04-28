import React, { memo } from 'react';
import { User } from 'lucide-react';
import Button from '../ui/Button';
import styles from './ProfileNotFound.module.css';
import { PROFILE_UI_CONSTANTS } from '../../constants/profileConstants';

/**
 * ProfileNotFound - Elite Component
 * Rule #14: Data-Driven UI via centralized constants
 * Rule #5: Atomic UI Components
 */
const ProfileNotFound = memo(() => {
    const labels = PROFILE_UI_CONSTANTS.public.notFound;

    return (
        <div className={styles.notFoundWrapper}>
            <div className={styles.iconBox}>
                <User size={80} />
            </div>
            <h2 className={styles.title}>{labels?.title}</h2>
            <p className={styles.text}>{labels?.text}</p>
            <Button 
                to="/" 
                variant="primary" 
                size="lg"
                className={styles.returnBtn}
            >
                {labels?.returnHome}
            </Button>
        </div>
    );
});

export default ProfileNotFound;
