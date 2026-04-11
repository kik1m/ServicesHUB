import React from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import { useNotificationsData } from '../hooks/useNotificationsData';

// Import Modular Components
import NotificationsHeader from '../components/Notifications/NotificationsHeader';
import NotificationCard from '../components/Notifications/NotificationCard';
import NotificationsEmptyState from '../components/Notifications/NotificationsEmptyState';

// Import Modular CSS
import styles from './Notifications.module.css';

const Notifications = () => {
    const { 
        user, 
        notifications, 
        loading, 
        error, 
        markAsRead, 
        clearAll 
    } = useNotificationsData();

    useSEO({
        title: "Notifications | ServicesHUB Activity",
        description: "Stay updated with your tool submissions, approval status, and account activity.",
    });

    // Handle Unauthenticated State
    if (!user && !loading) {
        return (
            <div className={`page-wrapper ${styles.authRequired}`}>
                <Bell size={64} className={styles.authIcon} />
                <h2 className={styles.authTitle}>Please sign in to view notifications</h2>
                <Link to="/auth" className={`btn-primary ${styles.authBtn}`}>Sign In</Link>
            </div>
        );
    }

    const handleClearAll = () => {
        if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
            clearAll();
        }
    };

    return (
        <div className={`page-wrapper ${styles.notificationsView}`}>
            <div className={styles.container}>
                
                <NotificationsHeader 
                    hasNotifications={notifications.length > 0}
                    onClearAll={handleClearAll}
                />

                <div className={styles.notificationsList}>
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className={styles.skeletonCard} style={{ 
                                padding: '1.5rem', 
                                display: 'flex', 
                                gap: '20px', 
                                background: 'rgba(255,255,255,0.02)',
                                borderRadius: '20px',
                                border: '1px solid var(--border)'
                            }}>
                                <SkeletonLoader type="avatar" width="44px" height="44px" borderRadius="12px" />
                                <div style={{ flex: 1 }}>
                                    <SkeletonLoader type="title" width="40%" height="20px" style={{ marginBottom: '10px' }} />
                                    <SkeletonLoader type="text" height="40px" />
                                </div>
                            </div>
                        ))
                    ) : notifications.length > 0 ? (
                        notifications.map(notif => (
                            <NotificationCard 
                                key={notif.id}
                                notif={notif}
                                onMarkRead={() => markAsRead(notif.id)}
                            />
                        ))
                    ) : (
                        <NotificationsEmptyState />
                    )}

                    {error && (
                        <div style={{ textAlign: 'center', color: '#ff4444', marginTop: '2rem' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
