import React from 'react';
import PageHero from '../ui/PageHero';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './NotificationsHeader.module.css';
import { NOTIFICATIONS_UI_CONSTANTS } from '../../constants/notificationsConstants';

/**
 * NotificationsHero - Leverages the Unified Elite PageHero
 * Rule #19: Standardized platform headers
 * Rule #31: Component Resilience
 */
const NotificationsHeader = ({ isLoading, error, onRetry }) => {
    const labels = NOTIFICATIONS_UI_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <PageHero
                className={styles.heroSection}
                title={labels?.hero?.title}
                highlight={labels?.hero?.highlight}
                subtitle={labels?.hero?.subtitle}
                breadcrumbs={labels?.hero?.breadcrumbs}
                isLoading={isLoading}
            />
        </Safeguard>
    );
};

export default NotificationsHeader;




