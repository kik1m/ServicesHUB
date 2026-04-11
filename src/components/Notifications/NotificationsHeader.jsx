import React from 'react';
import { Bell } from 'lucide-react';
import styles from './NotificationsHeader.module.css';

const NotificationsHeader = ({ hasNotifications, onClearAll }) => {
    return (
        <div className={styles.headerRow}>
            <div className={styles.titleGroup}>
                <h1 className={styles.title}>Notifications</h1>
            </div>
            {hasNotifications && (
                <button 
                    onClick={onClearAll} 
                    className={styles.clearBtn}
                >
                    Clear All
                </button>
            )}
        </div>
    );
};

export default NotificationsHeader;
