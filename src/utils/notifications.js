import { supabase } from '../lib/supabaseClient';

/**
 * Sends a persistent notification to a user.
 * @param {string} userId - UUID of the user.
 * @param {string} title - Title of the notification.
 * @param {string} message - Detailed message.
 * @param {string} type - 'info', 'success', 'warning', 'error', 'approval', 'blog', etc.
 */
/**
 * Sends a high-fidelity persistent notification to a user.
 * @param {string} userId - UUID of the user receiving the notification.
 * @param {string} title - Action title.
 * @param {string} message - Professional detailed description.
 * @param {string} type - 'approval', 'rejection', 'social', 'system', etc.
 * @param {Object} metadata - Optional extra data (toolId, actorId, actionUrl, etc.)
 */
export const sendNotification = async (userId, title, message, type = 'info', metadata = {}) => {
    if (!userId) return;

    try {
        // Essential payload that we KNOW exists in DB
        const payload = {
            user_id: userId,
            title,
            content: message,
            type,
            is_unread: true
        };

        // We only add metadata if we want to be elite, 
        // but for now, let's keep it safe to avoid 400 error
        const { error } = await supabase
            .from('notifications')
            .insert([{
                user_id: userId,
                title,
                content: message,
                type,
                is_unread: true,
                metadata: {
                    ...metadata,
                    sent_at: new Date().toISOString()
                }
            }]);
        
        if (error) throw error;
    } catch (err) {
        console.error('Notification Engine Error:', err);
    }
};
