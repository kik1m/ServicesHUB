import React from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useNotificationsData } from '../hooks/useNotificationsData';

// Import Modular Components
import NotificationsHeader from '../components/Notifications/NotificationsHeader';
import NotificationsListHeader from '../components/Notifications/NotificationsListHeader';
import NotificationCard from '../components/Notifications/NotificationCard';
import NotificationsEmptyState from '../components/Notifications/NotificationsEmptyState';
import Safeguard from '../components/ui/Safeguard';
import Button from '../components/ui/Button';

// Import Modular CSS
import styles from './Notifications.module.css';
import { NOTIFICATIONS_UI_CONSTANTS } from '../constants/notificationsConstants';

/**
 * Notifications Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Notifications = () => {
    const { 
        user, 
        notifications, 
        loading, 
        error, 
        markAsRead, 
        clearAll,
        refresh
    } = useNotificationsData();

    const labels = NOTIFICATIONS_UI_CONSTANTS;

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'notifications' });

    // Handle Unauthenticated State - Rule #14
    if (!user && !loading) {
        const authLabels = labels.auth;
        return (
            <div className={`page-wrapper ${styles.authRequired} fade-in`}>
                <div className={styles.authContent}>
                    <div className={styles.authIconCircle}>
                        <Bell size={48} />
                    </div>
                    <h2 className={styles.authTitle}>{authLabels.title}</h2>
                    <p className={styles.authDesc}>{authLabels.description}</p>
                    <Link to="/auth">
                        <Button variant="primary" size="large">{authLabels.button}</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleClearAll = () => {
        if (window.confirm(labels.actions.confirmClear)) {
            clearAll();
        }
    };

    return (
        <div className={`page-wrapper ${styles.notificationsView} fade-in`}>
            <NotificationsHeader 
                isLoading={loading && notifications.length === 0}
            />

            <div className={styles.container}>
                    {notifications.length > 0 && !loading && (
                        <NotificationsListHeader 
                            onClearAll={handleClearAll}
                            labels={labels.actions}
                            error={error}
                            onRetry={refresh}
                        />
                    )}

                    <div className={styles.notificationsList}>
                        {loading && notifications.length === 0 ? (
                            [1, 2, 3, 4].map(i => (
                                <NotificationCard key={i} isLoading={true} />
                            ))
                        ) : notifications.length > 0 ? (
                            notifications.map(notif => (
                                <NotificationCard 
                                    key={notif.id}
                                    notif={notif}
                                    onMarkRead={() => markAsRead(notif.id)}
                                    error={error}
                                    onRetry={refresh}
                                />
                            ))
                        ) : (
                            <NotificationsEmptyState 
                                error={error}
                                onRetry={refresh}
                            />
                        )}
                    </div>
            </div>
        </div>
    );
};

export default Notifications;
