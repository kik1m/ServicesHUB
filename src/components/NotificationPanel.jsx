import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, Rss, Circle, Loader2, AlertTriangle, Clock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import styles from './NotificationPanel.module.css';
import Button from './ui/Button';
import DropdownCard from './ui/DropdownCard';

/**
 * 🔔 Elite Notification Panel
 * Rule #1: Logic Isolation
 * Rule #2: Modular Styles (Rule #81)
 */
const NotificationPanel = ({ onClose, className = '' }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();

        let subscription;
        const setupSubscription = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                subscription = supabase
                    .channel('public:notifications_panel')
                    .on('postgres_changes', { 
                        event: 'INSERT', 
                        schema: 'public', 
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    }, (payload) => {
                        setNotifications(prev => [payload.new, ...prev].slice(0, 5));
                    })
                    .subscribe();
            }
        };

        setupSubscription();

        return () => {
            if (subscription) {
                supabase.removeChannel(subscription);
            }
        };
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            setNotifications(data || []);
        }
        setLoading(false);
    };

    const markAllRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('notifications')
                .update({ is_unread: false })
                .eq('user_id', user.id);
            setNotifications(notifications.map(n => ({ ...n, is_unread: false })));
            
            // Dispatch sync event
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'approval': return <CheckCircle size={16} color="#00C853" />;
            case 'rejection': return <AlertTriangle size={16} color="#FF5252" />;
            case 'pending': return <Clock size={16} color="#FFD700" />;
            case 'blog': return <Rss size={16} color="var(--primary)" />;
            default: return <Info size={16} color="var(--text-muted)" />;
        }
    };

    return (
        <DropdownCard className={`${styles.panel} ${className}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Notifications</h3>
                <button onClick={markAllRead} className={styles.markAllBtn}>
                    Mark all read
                </button>
            </div>

            <div className={styles.list}>
                {loading ? (
                    <div className={styles.loaderWrapper}>
                        <Loader2 className="animate-spin" size={24} color="var(--primary)" />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className={styles.item}>
                            <div className={styles.iconWrapper}>{getIcon(notif.type)}</div>
                            <div className={styles.itemContent}>
                                <h4>{notif.title}</h4>
                                <p>{notif.message}</p>
                                <span className={styles.itemTime}>
                                    {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {notif.is_unread && (
                                <Circle 
                                    size={8} 
                                    fill="var(--secondary)" 
                                    color="var(--secondary)" 
                                    className={styles.unreadDot} 
                                />
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        No new notifications
                    </div>
                )}
            </div>
            
            <Button 
                variant="primary"
                size="sm"
                onClick={() => { navigate('/notifications'); onClose(); }}
                className={styles.viewAll}
            >
                View all notifications
            </Button>
        </DropdownCard>
    );
};

export default NotificationPanel;


