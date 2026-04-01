import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCircle, Rss, ArrowLeft, Trash2, AlertTriangle } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link } from 'react-router-dom';

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
        } catch (err) {
            console.error('Clear all error:', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'approval': return <CheckCircle size={24} color="#00C853" />;
            case 'rejection': return <AlertTriangle size={24} color="#FF5252" />;
            case 'blog': return <Rss size={24} color="var(--primary)" />;
            default: return <Bell size={24} color="var(--text-muted)" />;
        }
    };

    if (!user && !loading) {
        return (
            <div className="notifications-page" style={{ padding: '120px 5%', textAlign: 'center' }}>
                <Bell size={64} style={{ opacity: 0.1, marginBottom: '2rem' }} />
                <h2>Please sign in to view notifications</h2>
                <Link to="/auth" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>Sign In</Link>
            </div>
        );
    }

    return (
        <div className="notifications-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to="/dashboard" style={{ color: 'var(--text-muted)' }}><ArrowLeft size={24} /></Link>
                        <h1>Notifications</h1>
                    </div>
                    {notifications.length > 0 && (
                        <button onClick={clearAll} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(255,82,82,0.1)', border: '1px solid rgba(255,82,82,0.2)', color: '#FF5252', borderRadius: '10px', cursor: 'pointer' }}>
                            <Trash2 size={18} /> Clear All
                        </button>
                    )}
                </div>

                <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {loading ? (
                        [1,2,3,4].map(i => (
                            <div key={i} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '20px', border: '1px solid var(--border)' }}>
                                <SkeletonLoader type="avatar" width="44px" height="44px" borderRadius="12px" />
                                <div style={{ flex: 1 }}>
                                    <SkeletonLoader type="title" width="40%" height="20px" style={{ marginBottom: '10px' }} />
                                    <SkeletonLoader type="text" height="40px" />
                                </div>
                            </div>
                        ))
                    ) : notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div key={notif.id} className="glass-card" style={{ 
                                padding: '1.5rem', display: 'flex', gap: '20px', 
                                border: notif.is_unread ? '1px solid var(--primary)' : '1px solid var(--border)',
                                position: 'relative',
                                background: notif.is_unread ? 'rgba(0,136,204,0.05)' : 'rgba(255,255,255,0.02)'
                            }}>
                                <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', height: 'fit-content' }}>
                                    {getIcon(notif.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {notif.is_unread && <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', flexShrink: 0 }}></div>}
                                            {notif.title}
                                        </h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(notif.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{notif.message}</p>
                                    <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                        {notif.is_unread && (
                                            <button onClick={() => markAsRead(notif.id)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}>
                                                Mark as read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>
                            <Bell size={64} style={{ margin: '0 auto 1.5rem' }} />
                            <h3>No notifications yet</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
