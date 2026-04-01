import React, { useState, useEffect } from 'react';
import { CheckCircle, Info, Rss, Circle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const NotificationPanel = ({ onClose }) => {
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
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'approval': return <CheckCircle size={16} color="var(--secondary)" />;
            case 'blog': return <Rss size={16} color="var(--primary)" />;
            default: return <Info size={16} color="var(--text-muted)" />;
        }
    };

    return (
        <div className="notification-dropdown glass-card shadow-lg" style={{
            position: 'absolute', top: '80px', right: '0px', width: '320px',
            maxHeight: '450px', overflowY: 'auto', zIndex: 10001,
            padding: '1.25rem', animation: 'slideUp 0.3s ease',
            background: 'rgba(15, 15, 18, 0.98)', backdropFilter: 'blur(40px)',
            border: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Notifications</h3>
                <button 
                    onClick={markAllRead}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '700' }}
                >
                    Mark all read
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '1rem' }}><Loader2 className="animate-spin" size={24} color="var(--primary)" /></div>
                ) : notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className="notification-item" style={{
                            padding: '1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border)', transition: '0.2s', cursor: 'pointer',
                            display: 'flex', gap: '12px', position: 'relative'
                        }}>
                            <div style={{ marginTop: '3px' }}>{getIcon(notif.type)}</div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{notif.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{notif.message}</p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                                    {new Date(notif.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            {notif.is_unread && (
                                <Circle size={8} fill="var(--secondary)" color="var(--secondary)" style={{ position: 'absolute', top: '15px', right: '15px' }} />
                            )}
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        No new notifications
                    </div>
                )}
            </div>
            
            <Link 
                to="/notifications"
                onClick={onClose}
                className="btn-primary" 
                style={{ width: '100%', marginTop: '1.25rem', padding: '10px', fontSize: '0.85rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}
            >
                View all notifications
            </Link>
        </div>
    );
};

export default NotificationPanel;
