import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '../services/notificationsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { NOTIFICATIONS_UI_CONSTANTS } from '../constants/notificationsConstants';
import { supabase } from '../lib/supabaseClient';

/**
 * 🚀 Elite Logic Hook: useNotificationsData (React Query + Realtime)
 * Rule #1: Business Logic Isolation
 * Rule #13: Defensive Data Operations
 */
export const useNotificationsData = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const labels = NOTIFICATIONS_UI_CONSTANTS.actions;

    const { data: notifications = [], isLoading, error: queryError, refetch } = useQuery({
        queryKey: ['notifications', user?.id],
        queryFn: async () => {
            const { data, error } = await notificationsService.fetchNotifications(user.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5 // 5 minutes cache
    });

    const error = queryError ? queryError.message : null;

    // Real-time Subscription - Rule #112 (Live Experience)
    useEffect(() => {
        if (!user) return;

        // Subscribe to changes
        const channel = supabase
            .channel(`notifications-${user.id}`)
            .on(
                'postgres_changes', 
                { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
                () => {
                    refetch(); // Background silent refresh on change
                    window.dispatchEvent(new CustomEvent('notifications-updated'));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, refetch]);

    const markAsRead = async (id) => {
        // Optimistic UI
        queryClient.setQueryData(['notifications', user?.id], prev => 
            (prev || []).map(n => n.id === id ? { ...n, is_unread: false } : n)
        );
        window.dispatchEvent(new CustomEvent('notifications-updated'));

        const { error: updateError } = await notificationsService.markAsRead(id);
        if (updateError) {
            // Revert on error
            refetch();
        }
    };

    const clearAll = async () => {
        if (!user || notifications.length === 0) return;
        
        // Optimistic UI
        queryClient.setQueryData(['notifications', user.id], []);
        window.dispatchEvent(new CustomEvent('notifications-updated'));

        const { error: deleteError } = await notificationsService.clearAll(user.id);
        if (!deleteError) {
            showToast(labels.successClear, 'success');
        } else {
            // Revert on error
            refetch();
            showToast(labels.errorClear, 'error');
        }
    };

    return {
        user,
        notifications,
        loading: isLoading || authLoading,
        error,
        markAsRead,
        clearAll,
        refresh: refetch
    };
};
