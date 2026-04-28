import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool-related database queries
 */

const BASE_SELECT = `
    id, name, slug, short_description, image_url, icon_name,
    is_verified, is_featured, pricing_type, rating,
    categories(name)
`;

const BASE_DETAIL_SELECT = `
    id, name, slug, description, short_description, image_url, icon_name, 
    url, pricing_type, pricing_details, rating, reviews_count, 
    is_featured, is_verified, category_id, view_count, click_count, features, 
    user_id, categories(name, slug, icon_name)
`;

export const toolsService = {
    /**
     * Create a new tool submission with mandatory sanitization
     * Elite v2.2 Standard: Defensive Layer
     * @param {Object} toolData - The tool data to insert
     */
    async createTool(toolData) {
        if (!toolData?.name || !toolData?.user_id) {
            return { data: null, error: 'Mandatory fields missing (Name/User ID)' };
        }

        try {
            // Rule #24.3: Data Sanitization (Defensive Layer)
            const sanitizedData = {
                name: toolData.name.trim(),
                url: toolData.url?.trim() || '',
                short_description: toolData.short_description?.trim() || '',
                description: toolData.description?.trim() || '',
                category_id: toolData.category_id,
                user_id: toolData.user_id,
                image_url: toolData.image_url || null,
                pricing_type: toolData.pricing_type || 'Free',
                pricing_details: toolData.pricing_details?.trim() || '',
                // Rule #32: Defensive filtering for features
                features: (toolData.features || []).map(f => f?.trim()).filter(Boolean),
                
                // Defaults for new tools
                is_approved: false,
                is_verified: false,
                is_featured: false,
                rating: 0,
                reviews_count: 0,
                view_count: 0,
                click_count: 0,
                created_at: new Date().toISOString(),
                slug: toolData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')
            };

            return await supabase
                .from('tools')
                .insert([sanitizedData]);
        } catch (err) {
            console.error('toolsService.createTool Error:', err);
            return { data: null, error: err.message };
        }
    },

    /**
     * Fetch featured tools
     * @param {number} limit 
     */
    async getFeaturedTools(limit = 6) {
        return supabase
            .from('tools')
            .select(`${BASE_SELECT}, click_count`)
            .eq('is_approved', true)
            .eq('is_featured', true)
            .limit(limit);
    },

    /**
     * Fetch tools for the smart banner (Featured first, then latest)
     * @param {number} limit 
     */
    async getBannerTools(limit = 20) {
        const now = new Date().toISOString();
        
        // Try to get tools that are featured (either indefinitely or within their period)
        const { data: featuredData, error: featuredError } = await supabase
            .from('tools')
            .select('id, name, short_description, image_url, url, slug, is_verified, click_count')
            .eq('is_approved', true)
            .eq('is_featured', true)
            .or(`featured_until.is.null,featured_until.gt.${now}`)
            .limit(limit);
        
        if (featuredData && featuredData.length > 0) {
            return { data: featuredData, error: featuredError };
        }

        // Fallback to latest approved tools if no active featured tools
        return supabase
            .from('tools')
            .select('id, name, short_description, image_url, url, slug, is_verified, click_count')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(limit);
    },

    /**
     * Fetch latest arrivals
     * @param {number} limit 
     */
    async getLatestTools(limit = 6) {
        return supabase
            .from('tools')
            .select(`${BASE_SELECT}, click_count`)
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(limit);
    },

    /**
     * Fetch trending tools based on view count
     * @param {number} limit 
     */
    async getTrendingTools(limit = 6) {
        return supabase
            .from('tools')
            .select(`${BASE_SELECT}, view_count, click_count`)
            .eq('is_approved', true)
            .order('view_count', { ascending: false })
            .limit(limit);
    },

    /**
     * Get total tools count and total views
     * Optimized to fetch only required fields
     */
    async getToolsStats() {
        try {
            const countPromise = supabase
                .from('tools')
                .select('id', { count: 'exact', head: true })
                .eq('is_approved', true);
                
            const viewsPromise = supabase
                .from('tools')
                .select('view_count, click_count')
                .eq('is_approved', true);

            const [countRes, viewsRes] = await Promise.all([countPromise, viewsPromise]);

            // Note: For multi-thousand rows, a database RPC function would be better (e.g., 'get_total_views')
            const totalViews = viewsRes.data?.reduce((sum, t) => sum + (t.view_count || 0), 0) || 0;
            const totalClicks = viewsRes.data?.reduce((sum, t) => sum + (t.click_count || 0), 0) || 0;

            return {
                count: countRes.count || 0,
                views: totalViews,
                clicks: totalClicks,
                error: countRes.error || viewsRes.error
            };
        } catch (err) {
            return { count: 0, views: 0, error: err.message };
        }
    },


    /**
     * Paginated fetch for the tools directory with filtering and sorting
     */
    async getToolsPaginated({
        page = 0,
        itemsPerPage = 20, // Standardized to 20 for better initial coverage
        searchQuery = '',
        categoryName = 'All',
        priceFilter = 'All',
        sortBy = 'newest',
        categories = []
    }) {
        const SELECT_FIELDS = 'id, name, slug, short_description, image_url, pricing_type, rating, reviews_count, is_featured, is_verified, category_id, categories(name)';

        let query = supabase
            .from('tools')
            .select(SELECT_FIELDS, { count: 'exact' })
            .eq('is_approved', true);

        // 🎯 1. Category Filter (Primary)
        if (categoryName && categoryName !== 'All') {
            const catObj = categories.find(c => c.name === categoryName);
            if (catObj) {
                query = query.eq('category_id', catObj.id);
            }
        }

        // 💰 2. Price Filter (Secondary)
        if (priceFilter && priceFilter !== 'All') {
            // Standard Elite Filter: Case-insensitive match
            query = query.ilike('pricing_type', priceFilter);
        }

        // 🔍 3. Search Filter (Nested Logic to prevent filter bypass)
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            const matchingCatIds = categories
                .filter(c => c.id !== 'All' && c.name?.toLowerCase().includes(searchLower))
                .map(c => c.id);

            // Rule #32: Defensive Sanitization - Escape quotes to prevent syntax errors
            const safeQuery = searchQuery.replace(/"/g, '""');

            // Wrap values in double quotes to prevent PostgREST comma-splitting errors (400 Bad Request)
            const searchConditions = [
                `name.ilike."%${safeQuery}%"`,
                `short_description.ilike."%${safeQuery}%"`
            ];

            // Use .eq for each category ID to avoid .in() comma parsing issues
            if (matchingCatIds.length > 0) {
                matchingCatIds.forEach(id => {
                    searchConditions.push(`category_id.eq."${id}"`);
                });
            }

            query = query.or(searchConditions.join(','));
        }

        // ⚡ 4. Sorting Logic (Elite Unified Sorting)
        if (sortBy === 'newest') {
            query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        } else if (sortBy === 'rating' || sortBy === 'top_rated') {
            query = query.order('is_featured', { ascending: false }).order('rating', { ascending: false });
        } else if (sortBy === 'popular') {
            query = query.order('is_featured', { ascending: false }).order('view_count', { ascending: false });
        } else if (sortBy === 'alphabetical') {
            query = query.order('name', { ascending: true });
        } else if (sortBy === 'featured') {
            query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        } else {
            // Default: featured first, then newest
            query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
        }

        // Secondary stable order
        query = query.order('id', { ascending: true });

        // 📏 5. Pagination
        const from = page * itemsPerPage;
        const to = from + itemsPerPage - 1;
        query = query.range(from, to);

        return query;
    },

    /**
     * Fetch a single tool by its slug with defensive sanitization
     * Rule #32: Defensive Layer
     */
    async getToolBySlug(slug) {
        try {
            const { data, error } = await supabase
                .from('tools')
                .select(BASE_DETAIL_SELECT)
                .eq('slug', slug)
                .single();

            if (error || !data) return { data: null, error };

            // Defensive Data Sanitization
            const sanitizedTool = {
                ...data,
                features: Array.isArray(data.features) ? data.features.filter(Boolean) : [],
                rating: data.rating ?? 0,
                reviews_count: data.reviews_count || 0,
                short_description: data.short_description || data.description?.slice(0, 160) || '',
                pricing_type: data.pricing_type || 'Free'
            };

            return { data: sanitizedTool, error: null };
        } catch (err) {
            return { data: null, error: err };
        }
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
     * Increment the click count of a tool
     */
    async incrementClickCount(id, currentClicks) {
        return supabase
            .from('tools')
            .update({ click_count: (currentClicks || 0) + 1 })
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
            .select('id, name, slug, short_description, image_url, pricing_type, is_approved, is_featured, is_verified, featured_until, created_at, view_count, click_count, rating')
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
            ? supabase.from('tools').select(BASE_DETAIL_SELECT).eq('id', idOrSlug)
            : supabase.from('tools').select(BASE_DETAIL_SELECT).eq('slug', idOrSlug);
            
        return query.single();
    },

    /**
     * Update an existing tool with mandatory sanitization
     * Rule #24.3: Defensive Layer for data integrity
     * @param {string} id - Tool ID
     * @param {Object} toolData - The new data
     * @param {boolean} isAlreadyApproved - If true, changes are queued for review
     */
    async updateTool(id, toolData, isAlreadyApproved = false) {
        if (!id || !toolData) return { data: null, error: 'ID or ToolData missing' };

        try {
            const sanitizedData = {
                name: toolData.name?.trim(),
                url: toolData.url?.trim(),
                short_description: toolData.short_description?.trim(),
                description: toolData.description?.trim(),
                category_id: toolData.category_id,
                pricing_type: toolData.pricing_type,
                pricing_details: toolData.pricing_details?.trim(),
                image_url: toolData.image_url,
                features: (toolData.features || []).map(f => f?.trim()).filter(Boolean),
                updated_at: new Date().toISOString()
            };

            const payload = isAlreadyApproved 
                ? { pending_changes: sanitizedData }
                : { ...sanitizedData, is_approved: false };

            return await supabase
                .from('tools')
                .update(payload)
                .eq('id', id);
        } catch (err) {
            console.error('toolsService.updateTool Error:', err);
            return { data: null, error: err.message };
        }
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
    },
    // Force rebuild trigger: 2026-04-25-v2
    _rebuild() { return true; }
};
