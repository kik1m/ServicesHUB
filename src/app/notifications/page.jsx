'use client';
import React from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { useNotificationsData } from '@/hooks/useNotificationsData';

// Import Modular Components (Already migrated)
import NotificationsHeader from '@/components/Notifications/NotificationsHeader';
import NotificationsListHeader from '@/components/Notifications/NotificationsListHeader';
import NotificationCard from '@/components/Notifications/NotificationCard';
import NotificationsEmptyState from '@/components/Notifications/NotificationsEmptyState';
import Safeguard from '@/components/ui/Safeguard';
import Button from '@/components/ui/Button';

// Import Modular CSS
import styles from './page.module.css';
import { NOTIFICATIONS_UI_CONSTANTS } from '@/constants/notificationsConstants';

/**
 * Notifications Page - Elite 10/10 Standard (Next.js Port)
 * Rule #16: Pure Orchestration Pattern
 * Rule #34: Private Data Security (noindex)
 */
export default function NotificationsPage() {
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

    // Handle Unauthenticated State - Rule #14
    if (!user && !loading) {
        const authLabels = labels.auth;
        return (
            <main className={`page-wrapper ${styles.authRequired} fade-in`}>
                <div className={styles.authContent}>
                    <div className={styles.authIconCircle}>
                        <Bell size={48} />
                    </div>
                    <h2 className={styles.authTitle}>{authLabels.title}</h2>
                    <p className={styles.authDesc}>{authLabels.description}</p>
                    <Link href="/auth" className={styles.authBtn}>
                        <Button variant="primary" size="lg">{authLabels.button}</Button>
                    </Link>
                </div>
            </main>
        );
    }

    const handleClearAll = () => {
        if (typeof window !== 'undefined' && window.confirm(labels.actions.confirmClear)) {
            clearAll();
        }
    };

    return (
        <main className={`page-wrapper ${styles.notificationsView} fade-in`}>
            {/* Rule #34: SEO Invisibility handled via metadata export in layout or server wrapper */}
            
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

                <ul 
                    className={styles.notificationsList} 
                    aria-live="polite"
                >
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
                </ul>
            </div>
        </main>
    );
}
