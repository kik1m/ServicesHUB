import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool-related database queries
 */
export const toolsService = {
    /**
     * Create a new tool submission
     * @param {Object} toolData - The tool data to insert
     */
    async createTool(toolData) {
        const slug = toolData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        
        return supabase
            .from('tools')
            .insert([{
                ...toolData,
                slug,
                is_approved: false, // All submissions require admin approval
                rating: 5.0,
                reviews_count: 0,
                view_count: 0,
                created_at: new Date().toISOString()
            }]);
    },

    /**
     * Fetch featured tools
     * @param {number} limit 
     */
    async getFeaturedTools(limit = 6) {
        return supabase
            .from('tools')
            .select(`
                id, name, slug, short_description, image_url, icon_name,
                is_verified, is_featured, pricing_type, rating,
                categories(name)
            `)
            .eq('is_approved', true)
            .eq('is_featured', true)
            .limit(limit);
    },

    /**
     * Fetch latest arrivals
     * @param {number} limit 
     */
    async getLatestTools(limit = 4) {
        return supabase
            .from('tools')
            .select(`
                id, name, slug, short_description, image_url, icon_name,
                is_verified, is_featured, pricing_type, rating,
                categories(name)
            `)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(limit);
    },

    /**
     * Fetch trending tools based on view count
     * @param {number} limit 
     */
    async getTrendingTools(limit = 4) {
        return supabase
            .from('tools')
            .select(`
                id, name, slug, short_description, image_url, icon_name,
                view_count, is_verified, is_featured, pricing_type, rating,
                categories(name)
            `)
            .eq('is_approved', true)
            .order('view_count', { ascending: false })
            .limit(limit);
    },

    /**
     * Get total tools count and total views
     */
    async getToolsStats() {
        const countPromise = supabase
            .from('tools')
            .select('id', { count: 'exact', head: true })
            .eq('is_approved', true);
            
        const viewsPromise = supabase
            .from('tools')
            .select('view_count')
            .eq('is_approved', true);

        const [countRes, viewsRes] = await Promise.all([countPromise, viewsPromise]);

        const totalViews = viewsRes.data?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0;

        return {
            count: countRes.count || 0,
            views: totalViews,
            error: countRes.error || viewsRes.error
        };
    },

    /**
     * Paginated fetch for the tools directory with filtering and sorting
     */
    async getToolsPaginated({
        page = 0,
        itemsPerPage = 12,
        searchQuery = '',
        categoryName = 'All',
        priceFilter = 'All',
        sortBy = 'Newest',
        categories = []
    }) {
        let query = supabase
            .from('tools')
            .select('id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, categories(name)', { count: 'exact' })
            .eq('is_approved', true);

        // Search Filter
        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%,short_description.ilike.%${searchQuery}%`);
        }

        // Category Filter
        if (categoryName !== 'All') {
            const catObj = categories.find(c => c.name === categoryName);
            if (catObj) {
                query = query.eq('category_id', catObj.id);
            }
        }

        // Price Filter
        if (priceFilter !== 'All') {
            query = query.eq('pricing_type', priceFilter);
        }

        // Sorting
        if (sortBy === 'Newest') {
            query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        } else if (sortBy === 'Rating') {
            query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
        } else if (sortBy === 'Popular') {
            query = query.order('is_featured', { ascending: false }).order('view_count', { ascending: false });
        }

        // Pagination
        const from = page * itemsPerPage;
        const to = from + itemsPerPage - 1;
        query = query.range(from, to);

        return query;
    },

    /**
     * Fetch a single tool by its slug including category name
     */
    async getToolBySlug(slug) {
        return supabase
            .from('tools')
            .select(`
                id, name, slug, description, short_description, image_url, icon_name, 
                url, pricing_type, pricing_details, rating, reviews_count, 
                is_featured, is_verified, category_id, view_count, features, 
                user_id, categories(name, slug)
            `)
            .eq('slug', slug)
            .single();
    },

    /**
     * Increment the view count of a tool
     */
    async incrementViewCount(id, currentViews) {
        return supabase
            .from('tools')
            .update({ view_count: (currentViews || 0) + 1 })
            .eq('id', id);
    },

    /**
     * Fetch related tools in the same category
     */
    async getRelatedTools(categoryId, currentToolId, limit = 3) {
        return supabase
            .from('tools')
            .select('id, name, slug, short_description, image_url, rating, reviews_count, is_verified, categories(name)')
            .eq('category_id', categoryId)
            .neq('id', currentToolId)
            .limit(limit);
    },

    /**
     * Fetch tools submitted by a specific user
     */
    async getUserTools(userId) {
        if (!userId) return { data: [], error: null };
        return supabase
            .from('tools')
            .select('id, name, slug, short_description, image_url, pricing_type, is_approved, is_featured, is_verified, featured_until, created_at, view_count, rating')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
    },

    /**
     * Fetch a single tool by its ID or Slug including category name
     * @param {string|number} idOrSlug - The ID or Slug of the tool
     */
    async getToolByIdOrSlug(idOrSlug) {
        // Detect if it's a UUID or a Slug
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
        
        const query = isUuid 
            ? supabase.from('tools').select('*, categories(name)').eq('id', idOrSlug)
            : supabase.from('tools').select('*, categories(name)').eq('slug', idOrSlug);
            
        return query.single();
    },

    /**
     * Update an existing tool with pending changes logic
     * @param {string} id - Tool ID
     * @param {Object} toolData - The new data
     * @param {boolean} isAlreadyApproved - If true, changes are queued for review
     */
    async updateTool(id, toolData, isAlreadyApproved = false) {
        const payload = isAlreadyApproved 
            ? { 
                pending_changes: { 
                    ...toolData, 
                    updated_at: new Date().toISOString() 
                } 
              }
            : { 
                ...toolData, 
                is_approved: false, // Ensure unapproved tool remains unapproved
                updated_at: new Date().toISOString() 
              };

        return supabase
            .from('tools')
            .update(payload)
            .eq('id', id);
    },

    /**
     * Check if a user has reached their tool submission limit
     * @param {string} userId 
     */
    async checkSubmissionLimit(userId) {
        if (!userId) return false;

        // Fetch user premium status
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_premium')
            .eq('id', userId)
            .single();

        // Count user's tools
        const { count } = await supabase
            .from('tools')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        return (count || 0) >= 2 && !profile?.is_premium;
    },

    /**
     * Delete a tool by ID
     */
    async deleteTool(id) {
        return supabase
            .from('tools')
            .delete()
            .eq('id', id);
    }
};
