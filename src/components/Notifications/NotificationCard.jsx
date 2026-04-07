import React from 'react';
import { CheckCircle, Clock, Rss, Bell, AlertTriangle } from 'lucide-react';

const NotificationCard = ({ notif, onMarkRead }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'approval': return <CheckCircle size={24} color="#00C853" />;
            case 'rejection': return <AlertTriangle size={24} color="#FF5252" />;
            case 'pending': return <Clock size={24} color="#FFD700" />;
            case 'blog': return <Rss size={24} color="var(--primary)" />;
            default: return <Bell size={24} color="var(--text-muted)" />;
        }
    };

    return (
        <div className={`glass-card notification-card ${notif.is_unread ? 'unread' : 'read'}`}>
            <div className="notification-icon-box">
                {getIcon(notif.type)}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h3 className="notification-title">
                        {notif.is_unread && <div className="unread-dot"></div>}
                        {notif.title}
                    </h3>
                    <span className="notification-time">
                        {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                </div>
                <p className="notification-message">{notif.message}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    {notif.is_unread && (
                        <button 
                            onClick={onMarkRead} 
                            className="btn-mark-read"
                            style={{ fontWeight: '600', fontSize: '0.9rem' }}
                        >
                            Mark as read
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationCard;
