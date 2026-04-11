import { Bell, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import styles from './NotificationCard.module.css';

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

const NotificationCard = ({ notif, onMarkRead }) => {
    // Determine icon based on type (optional enhancement)
    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} />;
            case 'warning': return <AlertTriangle size={20} />;
            case 'info': return <Info size={20} />;
            default: return <Bell size={20} />;
        }
    };

    const timeAgo = formatTimeAgo(notif.created_at);

    return (
        <div className={`${styles.card} ${notif.is_unread ? styles.unread : styles.read}`}>
            <div className={styles.iconBox}>
                {getIcon(notif.type)}
            </div>
            
            <div className={styles.contentBox}>
                <div className={styles.headerLine}>
                    <h3 className={styles.title}>
                        {notif.title}
                        {notif.is_unread && <div className={styles.unreadDot} />}
                    </h3>
                    <span className={styles.time}>{timeAgo}</span>
                </div>
                
                <p className={styles.message}>{notif.message}</p>
                
                {notif.is_unread && (
                    <button 
                        onClick={onMarkRead} 
                        className={styles.markReadBtn}
                    >
                        Mark as read
                    </button>
                )}
            </div>
        </div>
    );
};

export default NotificationCard;
