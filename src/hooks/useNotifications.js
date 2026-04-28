import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useNotifications = (userId) => {
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async (uid) => {
        if (!uid) return;
        try {
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', uid)
                .eq('is_unread', true);

            setUnreadCount(count || 0);
        } catch (err) {
            console.error('Fetch unread count error:', err);
        }
    };

    useEffect(() => {
        let subscription;
        if (userId) {
            fetchUnreadCount(userId);

            subscription = supabase
                .channel(`public:notifications:${userId}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`
                }, () => {
                    fetchUnreadCount(userId);
                })
                .subscribe();

            const handleSync = () => fetchUnreadCount(userId);
            window.addEventListener('notifications-updated', handleSync);

            return () => {
                if (subscription) supabase.removeChannel(subscription);
                window.removeEventListener('notifications-updated', handleSync);
            };
        }
    }, [userId]);

    return { unreadCount, refreshCount: () => fetchUnreadCount(userId) };
};
