import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling all tool promotion and advertising logic.
 */
export const promotionService = {
    /**
     * Fetch a tool's name by its ID.
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
     * Check if a tool already has an active promotion plan.
     * NOTE: Requires a 'tool_promotions' table in Supabase.
     * Falls back to false if the table doesn't exist yet (PGRST205).
     */
    async fetchActivePlan(toolId) {
        const { data, error } = await supabase
            .from('tool_promotions')
            .select('id')
            .eq('tool_id', toolId)
            .eq('status', 'active')
            .single();

        // PGRST116 = no rows returned → tool has no active plan (normal case)
        // PGRST205 = table not found → treat as no active plan until table is created
        if (error && error.code !== 'PGRST116' && error.code !== 'PGRST205') {
            throw error;
        }
        return !!data;
    },

    /**
     * Fetch all approved tools owned by a specific user.
     */
    async fetchUserTools(userId) {
        const { data, error } = await supabase
            .from('tools')
            .select('id, name')
            .eq('user_id', userId)
            .eq('is_approved', true);
        if (error) throw error;
        return data || [];
    },
};
