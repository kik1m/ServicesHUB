import { supabase } from '../lib/supabaseClient';

/**
 * Sends a persistent notification to a user.
 * @param {string} userId - UUID of the user.
 * @param {string} title - Title of the notification.
 * @param {string} message - Detailed message.
 * @param {string} type - 'info', 'success', 'warning', 'error', 'approval', 'blog', etc.
 */
export const sendNotification = async (userId, title, message, type = 'info') => {
    if (!userId) return;

    try {
        const { error } = await supabase
            .from('notifications')
            .insert([{
                user_id: userId,
                title,
                content: message,
                type,
                is_unread: true
            }]);
        
        if (error) throw error;
    } catch (err) {
        console.error('Failed to send notification:', err);
    }
};
