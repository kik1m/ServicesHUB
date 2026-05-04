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
        // 1. Check tool_promotions table
        const { data, error } = await supabase
            .from('tool_promotions')
            .select('status, plan_name')
            .eq('tool_id', toolId)
            .eq('status', 'active')
            .limit(1);

        if (error && error.code !== 'PGRST205') {
            console.error('fetchActivePlan error:', error);
        }

        if (data && data.length > 0) {
            console.log('Found active promotion:', data[0]);
            return {
                name: data[0].plan_name,
                status: data[0].status
            };
        }

        // 2. Fallback: check is_featured in tools table
        const { data: toolData, error: toolError } = await supabase
            .from('tools')
            .select('is_featured')
            .eq('id', toolId)
            .single();

        if (toolError) {
            console.error('fetchActivePlan tool check error:', toolError);
        }

        if (toolData?.is_featured) {
            console.log('Tool is flagged as featured, assuming "Featured" plan.');
            return {
                name: 'Featured',
                status: 'active'
            };
        }

        return null;
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
