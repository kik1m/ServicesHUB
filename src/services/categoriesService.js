import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling category-related database queries
 */
export const categoriesService = {
    /**
     * Fetch categories for the home page preview
     * @param {number} limit 
     */
    async getHomeCategories(limit = 12) {
        return supabase
            .from('categories')
            .select('id, name, icon_name, slug')
            .limit(limit);
    },

    /**
     * Fetch all categories for the directory page
     */
    async getAllCategories() {
        return supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });
    },

    /**
     * Fetch a single category by its slug
     * @param {string} slug 
     */
    async getCategoryBySlug(slug) {
        return supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();
    }
};
