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
     * Fetch all categories for the directory page with their tool counts
     * Rule #32: Defensive Layer
     */
    async getCategoriesWithCounts() {
        try {
            // Parallel fetching for performance
            const [categoriesRes, toolsRes] = await Promise.all([
                this.getAllCategories(),
                supabase
                    .from('tools')
                    .select('category_id')
                    .eq('is_approved', true)
            ]);

            if (categoriesRes.error) throw categoriesRes.error;
            if (toolsRes.error) throw toolsRes.error;

            // Defensive Sanitization
            const categories = (categoriesRes.data || []).map(cat => ({
                ...cat,
                name: cat.name?.trim() || 'Unnamed Category',
                icon_name: cat.icon_name || 'LayoutGrid',
                slug: cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-') || 'uncategorized'
            }));

            const toolsData = toolsRes.data || [];

            // Compute counts
            const counts = toolsData.reduce((acc, tool) => {
                acc[tool.category_id] = (acc[tool.category_id] || 0) + 1;
                return acc;
            }, {});

            return { data: categories, counts, error: null };
        } catch (error) {
            console.error('Service Error [getCategoriesWithCounts]:', error);
            return { data: [], counts: {}, error };
        }
    },

    /**
     * Fetch all categories for the directory page with sanitization
     */
    async getAllCategories() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) return { data: [], error };

        const sanitized = (data || []).map(cat => ({
            ...cat,
            name: cat.name?.trim() || 'Unnamed Category',
            icon_name: cat.icon_name || 'LayoutGrid'
        }));

        return { data: sanitized, error: null };
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
