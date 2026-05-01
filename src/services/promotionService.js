import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling all tool promotion and advertising logic.
 */
export const promotionService = {
    /**
     * Fetch a tools name by ID
     */
    async fetchToolName(toolId) {
        const { data, error } = await supabase
            .from('tools')
            .select('name')
            .eq('id', toolId)
            .single();
        
        if (error) throw error;
        return data?.name || '';
    },

    /**
     * Fetch all approved tools owned by a user
     */
    async fetchUserTools(userId) {
        const { data, error } = await supabase
            .from('tools')
            .select('id, name')
            .eq('user_id', userId)
            .eq('is_approved', true);
        
        if (error) throw error;
        return data || [];
    }
};
