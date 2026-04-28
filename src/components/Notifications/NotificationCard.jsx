import React, { memo } from 'react';
import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './NotificationCard.module.css';
import { NOTIFICATIONS_UI_CONSTANTS } from '../../constants/notificationsConstants';

const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

/**
 * NotificationCard - Atomic UI Component
 * Rule #31: Component Resilience
 */
const NotificationCard = memo(({ notif, onMarkRead, isLoading, error, onRetry }) => {
    const labels = NOTIFICATIONS_UI_CONSTANTS.actions;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.skeletonCard}>
                    <div className={styles.iconBox}>
                        <Skeleton className={styles.skeletonIcon} />
                    </div>
                    <div className={styles.contentBox}>
                        <div className={styles.headerLine}>
                            <Skeleton className={styles.skeletonTitle} />
                            <Skeleton className={styles.skeletonTime} />
                        </div>
                        <div className={styles.skeletonBody}>
                            <Skeleton className={styles.skeletonLine} />
                            <Skeleton className={styles.skeletonLineShort} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className={`${styles.card} ${notif?.is_unread ? styles.unread : styles.read}`}>
                    <div className={styles.iconBox}>
                        {(() => {
                            switch (notif?.type) {
                                case 'success': return <CheckCircle size={20} />;
                                case 'warning': return <AlertTriangle size={20} />;
                                case 'info': return <Info size={20} />;
                                default: return <Bell size={20} />;
                            }
                        })()}
                    </div>
                    
                    <div className={styles.contentBox}>
                        <div className={styles.headerLine}>
                            <h3 className={styles.title}>
                                {notif?.title}
                                {notif?.is_unread && <div className={styles.unreadDot} />}
                            </h3>
                            <span className={styles.time}>{formatTimeAgo(notif?.created_at)}</span>
                        </div>
                        
                        <p className={styles.message}>{notif?.message}</p>
                        
                        {notif?.is_unread && (
                            <Button 
                                variant="ghost"
                                size="small"
                                onClick={onMarkRead} 
                                className={styles.markReadBtn}
                            >
                                {labels?.markAsRead}
                            </Button>
                        )}
                    </div>
                </div>
            )}
        </Safeguard>
    );
});

export default NotificationCard;




