import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool favorite/bookmark logic
 */
export const favoritesService = {
    /**
     * Check if a tool is favorited by a user
     */
    async isToolFavorited(userId, toolId) {
        if (!userId || !toolId) return { data: null, error: null };
        return supabase
            .from('favorites')
            .select('user_id, tool_id')
            .eq('user_id', userId)
            .eq('tool_id', toolId)
            .maybeSingle();
    },

    /**
     * Add a tool to favorites
     */
    async addFavorite(userId, toolId) {
        return supabase
            .from('favorites')
            .insert([{ user_id: userId, tool_id: toolId }]);
    },

    /**
     * Remove a tool from favorites
     */
    async removeFavorite(userId, toolId) {
        return supabase
            .from('favorites')
            .delete()
            .eq('user_id', userId)
            .eq('tool_id', toolId);
    },

    /**
     * Get all favorite tools for a user
     */
    async getUserFavorites(userId) {
        if (!userId) return { data: [], error: null };
        return supabase
            .from('favorites')
            .select('tool_id, tools(*, categories(name))')
            .eq('user_id', userId);
    }
};
