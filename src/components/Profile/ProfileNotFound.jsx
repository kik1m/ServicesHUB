import React from 'react';
import { User } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './ProfileNotFound.module.css';

const ProfileNotFound = () => {
    return (
        <div className={styles.notFoundWrapper}>
            <User size={80} className={styles.icon} />
            <h2 className={styles.title}>Publisher not found</h2>
            <p className={styles.text}>The profile you are looking for does not exist or has been removed.</p>
            <Link to="/" className={`btn-primary ${styles.returnBtn}`}>
                Return Home
            </Link>
        </div>
    );
};

export default ProfileNotFound;
