import React from 'react';
import { BellOff } from 'lucide-react';
import styles from './NotificationsEmptyState.module.css';

const NotificationsEmptyState = () => {
    return (
        <div className={styles.emptyState}>
            <BellOff size={64} className={styles.icon} />
            <h3 className={styles.title}>All caught up!</h3>
            <p className={styles.subtitle}>You don't have any notifications at the moment. We'll let you know when something happens.</p>
        </div>
    );
};

export default NotificationsEmptyState;
