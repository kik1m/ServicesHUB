import React from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './NotificationsListHeader.module.css';

/**
 * NotificationsListHeader - Standardized List Actions Component
 * Rule #16: Component Isolation
 * Rule #31: Component Resilience
 */
const NotificationsListHeader = ({ onClearAll, labels, error, onRetry }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.listHeader}>
                <h2 className={styles.listTitle}>Latest Activity</h2>
                <Button 
                    variant="ghost" 
                    size="small" 
                    onClick={onClearAll}
                    className={styles.clearBtn}
                >
                    <Trash2 size={14} /> {labels?.clearAll}
                </Button>
            </div>
        </Safeguard>
    );
};

export default NotificationsListHeader;
