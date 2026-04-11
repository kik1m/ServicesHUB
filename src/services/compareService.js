import { supabase } from '../lib/supabaseClient';

/**
 * Service for comparison-related database operations
 */
export const compareService = {
    /**
     * Search tools for comparison modal
     * @param {string} searchTerm - Query to match tool names
     * @returns {Promise<{data: any[], error: any}>}
     */
    async searchTools(searchTerm) {
        try {
            let query = supabase
                .from('tools')
                .select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, categories(name)')
                .eq('is_approved', true);

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            const { data, error } = await query.limit(10);
            if (error) throw error;
            return { data, error: null };
        } catch (error) {
            console.error('Error searching tools for comparison:', error);
            return { data: [], error };
        }
    },

    /**
     * Get tool details by ID
     * @param {string} id - Tool UUID
     */
    async getToolById(id) {
        const { data, error } = await supabase
            .from('tools')
            .select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, categories(name)')
            .eq('id', id)
            .single();
        
        return { data, error };
    }
};
