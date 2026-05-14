import { supabase } from '../lib/supabaseClient';

/**
 * Service for notification-related database operations
 */
export const notificationsService = {
    /**
     * Fetch all notifications for a specific user
     * @param {string} userId - UUID of the user
     */
    async fetchNotifications(userId) {
        if (!userId) return { data: [], error: null };
        
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        
        return { data, error };
    },

    /**
     * Mark a specific notification as read
     * @param {string} id - Notification UUID
     */
    async markAsRead(id) {
        const { error } = await supabase
            .from('notifications')
            .update({ is_unread: false })
            .eq('id', id);
        
        return { error };
    },

    /**
     * Delete all notifications for a specific user
     * @param {string} userId - User UUID
     */
    async clearAll(userId) {
        if (!userId) return { error: new Error('User ID is required') };
        
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('user_id', userId);
        
        return { error };
    }
};
