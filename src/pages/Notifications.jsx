import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link } from 'react-router-dom';

// Import Modular Components
import NotificationsHeader from '../components/Notifications/NotificationsHeader';
import NotificationCard from '../components/Notifications/NotificationCard';
import NotificationsEmptyState from '../components/Notifications/NotificationsEmptyState';

// Import Modular CSS
import '../styles/Pages/Notifications.css';

const Notifications = () => {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (user) fetchNotifications(user.id);
        else setLoading(false);
    }, [user, authLoading]);

    const fetchNotifications = async (userId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setNotifications(data || []);
        } catch (err) {
            console.error('Fetch notifications error:', err);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ is_unread: false })
                .eq('id', id);
            
            if (error) throw error;
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_unread: false } : n));
            
            // Dispatch sync event
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (err) {
            console.error('Mark read error:', err);
        }
    };

    const clearAll = async () => {
        if (!user || notifications.length === 0) return;
        if (!window.confirm('Clear all notifications?')) return;

        try {
            const { error } = await supabase
                .from('notifications')
                .delete()
                .eq('user_id', user.id);
            
            if (error) throw error;
            setNotifications([]);
            
            // Dispatch sync event
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } catch (err) {
            console.error('Clear all error:', err);
        }
    };

    if (!user && !loading) {
        return (
            <div className="notifications-page" style={{ padding: '120px 5%', textAlign: 'center' }}>
                <Bell size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                <h2>Please sign in to view notifications</h2>
                <Link to="/auth" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block', textDecoration: 'none' }}>Sign In</Link>
            </div>
        );
    }

    return (
        <div className="notifications-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                <NotificationsHeader 
                    hasNotifications={notifications.length > 0}
                    onClearAll={clearAll}
                />

                <div className="notifications-list">
                    {loading ? (
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card notification-card" style={{ border: '1px solid var(--border)' }}>
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
                </div>
            </div>
        </div>
    );
};

export default Notifications;
