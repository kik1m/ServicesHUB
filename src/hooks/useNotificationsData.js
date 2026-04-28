import { useState, useEffect, useCallback, useMemo } from 'react';
import { notificationsService } from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NOTIFICATIONS_UI_CONSTANTS } from '../constants/notificationsConstants';
import { supabase } from '../lib/supabaseClient';

/**
 * useNotificationsData - Elite Logic Hook
 * Rule #1: Business Logic Isolation
 * Rule #13: Defensive Data Operations
 */
export const useNotificationsData = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const labels = NOTIFICATIONS_UI_CONSTANTS.actions;

    const loadNotifications = useCallback(async (silent = false) => {
        if (!user) {
            setLoading(false);
            return;
        }

        if (!silent) setLoading(true);
        const { data, error: fetchError } = await notificationsService.fetchNotifications(user.id);
        
        if (fetchError) {
            setError(fetchError.message);
        } else {
            setNotifications(data || []);
        }
        setLoading(false);
    }, [user]);

    // Real-time Subscription - Rule #112 (Live Experience)
    useEffect(() => {
        if (!user) return;

        // Load initial data
        loadNotifications();

        // Subscribe to changes
        const channel = supabase
            .channel(`notifications-${user.id}`)
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                () => {
                    loadNotifications(true); // Silent refresh on change
                    window.dispatchEvent(new CustomEvent('notifications-updated'));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, loadNotifications]);

    const markAsRead = async (id) => {
        const { error: updateError } = await notificationsService.markAsRead(id);
        if (!updateError) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_unread: false } : n));
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        }
    };

    const clearAll = async () => {
        if (!user || notifications.length === 0) return;
        
        const { error: deleteError } = await notificationsService.clearAll(user.id);
        if (!deleteError) {
            setNotifications([]);
            showToast(labels.successClear, 'success');
            window.dispatchEvent(new CustomEvent('notifications-updated'));
        } else {
            showToast(labels.errorClear, 'error');
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
