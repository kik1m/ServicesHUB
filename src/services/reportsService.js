import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool report operations
 */
export const reportsService = {
    /**
     * Submit a report for a tool
     * @param {Object} reportData 
     */
    async submitReport({ tool_id, user_id, reason }) {
        return supabase
            .from('reports')
            .insert([{
                tool_id,
                user_id: user_id || null,
                reason,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);
    }
};
