import { useState, useEffect, useCallback } from 'react';
import { notificationsService } from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';

/**
 * Hook for managing notification data and side effects
 */
export const useNotificationsData = () => {
    const { user, loading: authLoading } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNotifications = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const { data, error: fetchError } = await notificationsService.fetchNotifications(user.id);
        
        if (fetchError) {
            setError(fetchError.message);
        } else {
            setNotifications(data || []);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        if (!authLoading) {
            loadNotifications();
        }
    }, [user, authLoading, loadNotifications]);

    // Function to sync notifications across the app (triggers navbar badge update)
    const syncNotifications = useCallback(() => {
        window.dispatchEvent(new CustomEvent('notifications-updated'));
    }, []);

    const markAsRead = async (id) => {
        const { error: updateError } = await notificationsService.markAsRead(id);
        if (!updateError) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_unread: false } : n));
            syncNotifications();
        } else {
            console.error('Failed to mark notification as read:', updateError);
        }
    };

    const clearAll = async () => {
        if (!user || notifications.length === 0) return;
        
        const { error: deleteError } = await notificationsService.clearAll(user.id);
        if (!deleteError) {
            setNotifications([]);
            syncNotifications();
        } else {
            console.error('Failed to clear notifications:', deleteError);
        }
    };

    return {
        user,
        notifications,
        loading: loading || authLoading,
        error,
        markAsRead,
        clearAll,
        refresh: loadNotifications
    };
};
