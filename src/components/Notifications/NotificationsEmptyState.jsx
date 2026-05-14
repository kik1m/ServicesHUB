import React from 'react';
import { BellOff } from 'lucide-react';
import Safeguard from '../ui/Safeguard';
import styles from './NotificationsEmptyState.module.css';

import { NOTIFICATIONS_UI_CONSTANTS } from '../../constants/notificationsConstants';

/**
 * NotificationsEmptyState - Atomic UI Component
 * Rule #31: Component Resilience
 */
const NotificationsEmptyState = ({ error, onRetry }) => {
    const labels = NOTIFICATIONS_UI_CONSTANTS.empty;
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.emptyState}>
                <BellOff size={64} className={styles.icon} />
                <h2 className={styles.title}>{labels?.title}</h2>
                <p className={styles.subtitle}>{labels?.description}</p>
            </div>
        </Safeguard>
    );
};

export default NotificationsEmptyState;




