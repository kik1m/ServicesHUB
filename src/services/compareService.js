import { supabase } from '../lib/supabaseClient';

/**
 * Normalizes tool data for consistent consumption (Rule #24.3)
 */
const normalizeTool = (tool) => {
    if (!tool) return null;
    return {
        id: tool.id || '',
        name: tool.name || 'Unknown Tool',
        slug: tool.slug || '',
        description: tool.description || tool.short_description || '',
        short_description: tool.short_description || '',
        image_url: tool.image_url || '',
        pricing_type: tool.pricing_type || 'N/A',
        rating: parseFloat(tool.rating) || 5.0,
        reviews_count: parseInt(tool.reviews_count) || 0,
        is_verified: !!tool.is_verified,
        features: Array.isArray(tool.features) ? tool.features : [],
        url: tool.url || '#',
        category_id: tool.category_id || '',
        categories: {
            name: tool.categories?.name || 'Uncategorized'
        }
    };
};

/**
 * Service for comparison-related database operations
 */
export const compareService = {
    async searchTools(searchTerm, categoryId = null) {
        try {
            let query = supabase
                .from('tools')
                .select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, category_id, categories(name)')
                .eq('is_approved', true);

            if (categoryId) {
                query = query.eq('category_id', categoryId);
            }

            if (searchTerm) {
                query = query.ilike('name', `%${searchTerm}%`);
            }

            const { data, error } = await query.limit(10);
            if (error) throw error;
            return { data: (data || []).map(normalizeTool), error: null };
        } catch (error) {
            console.error('Error searching tools for comparison:', error);
            return { data: [], error };
        }
    },

    async getToolById(id) {
        try {
            const { data, error } = await supabase
                .from('tools')
                .select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, category_id, categories(name)')
                .eq('id', id)
                .single();
            
            return { data: normalizeTool(data), error };
        } catch (error) {
            return { data: null, error };
        }
    },

    async getToolBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('tools')
                .select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, category_id, categories(name)')
                .eq('slug', slug)
                .single();
            
            return { data: normalizeTool(data), error };
        } catch (error) {
            return { data: null, error };
        }
    },

    async getCompetitors(categoryId, excludeToolId) {
        if (!categoryId) return { data: [], error: null };
        try {
            const { data, error } = await supabase
                .from('tools')
                .select('id, name, slug, image_url, pricing_type, rating, is_verified, categories(name)')
                .eq('category_id', categoryId)
                .neq('id', excludeToolId)
                .eq('is_approved', true)
                .order('rating', { ascending: false })
                .limit(5);
            if (error) throw error;
            return { data: (data || []).map(normalizeTool), error: null };
        } catch (error) {
            console.error('Error fetching competitors:', error);
            return { data: [], error };
        }
    },

    async getRecentComparisons() {
        try {
            const { data, error } = await supabase
                .from('tool_comparisons')
                .select(`
                    id,
                    created_at,
                    tool1:tools!tool1_id(id, name, slug, image_url),
                    tool2:tools!tool2_id(id, name, slug, image_url),
                    ai_report_json
                `)
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) throw error;
            return { data: data || [], error: null };
        } catch (error) {
            console.error('Error fetching recent comparisons:', error);
            return { data: [], error };
        }
    }
};
