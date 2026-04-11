import { supabase } from '../lib/supabaseClient';

/**
 * Admin Service - Centralized database operations for the moderator dashboard
 */
export const adminService = {
    /**
     * Fetch all initial dashboard data in parallel
     */
    async fetchDashboardData() {
        const [
            pending,
            featured,
            blogs,
            blogCats,
            toolCats,
            users,
            subs,
            counts
        ] = await Promise.all([
            // 1. Pending Tools & Updates
            supabase.from('tools').select('*, categories(name)').or('is_approved.eq.false,pending_changes.not.is.null').order('updated_at', { ascending: false }),
            
            // 2. Featured Tools
            supabase.from('tools').select('*, categories(name)').eq('is_featured', true).order('featured_until', { ascending: true }),
            
            // 3. Blog Data
            supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
            supabase.from('blog_categories').select('*'),
            
            // 4. Tool Categories
            supabase.from('categories').select('*'),
            
            // 5. User Management
            supabase.from('profiles').select('id, full_name, avatar_url, role, updated_at, is_premium').order('updated_at', { ascending: false }),
            supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
            
            // 6. Global Counts
            this.getGlobalCounts()
        ]);

        return {
            pendingTools: pending.data || [],
            featuredTools: featured.data || [],
            blogPosts: blogs.data || [],
            blogCategories: blogCats.data || [],
            toolCategories: toolCats.data || [],
            allUsers: users.data || [],
            subscribers: subs.data || [],
            counts: counts
        };
    },

    /**
     * Get exact counts for stats cards
     */
    async getGlobalCounts() {
        const [tools, profiles, pending] = await Promise.all([
            supabase.from('tools').select('id', { count: 'exact', head: true }),
            supabase.from('profiles').select('id', { count: 'exact', head: true }),
            supabase.from('tools').select('id', { count: 'exact', head: true }).or('is_approved.eq.false,pending_changes.not.is.null')
        ]);

        return {
            totalTools: tools.count || 0,
            totalUsers: profiles.count || 0,
            totalPending: pending.count || 0
        };
    },

    /**
     * Approve a tool submission or update
     */
    async approveTool(tool) {
        let updatePayload = { is_approved: true };
        if (tool.pending_changes) {
            updatePayload = { ...updatePayload, ...tool.pending_changes, pending_changes: null };
        }
        
        const { data, error } = await supabase.from('tools').update(updatePayload).eq('id', tool.id).select();
        if (error) throw error;
        return data[0];
    },

    /**
     * Reject a tool submission (delete) or update (clear changes)
     */
    async rejectTool(tool) {
        const isUpdate = !!tool.pending_changes;
        if (isUpdate) {
            const { error } = await supabase.from('tools').update({ pending_changes: null }).eq('id', tool.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('tools').delete().eq('id', tool.id);
            if (error) throw error;
        }
        return true;
    },

    /**
     * Blog Management
     */
    async createBlogPost(postData, authorId) {
        const { data, error } = await supabase.from('blog_posts').insert([{ ...postData, author_id: authorId }]).select();
        if (error) throw error;
        return data[0];
    },

    async deleteBlogPost(postId) {
        const { error } = await supabase.from('blog_posts').delete().eq('id', postId);
        if (error) throw error;
        return true;
    },

    /**
     * Category Management
     */
    async createCategory(catData, isBlog = false) {
        const table = isBlog ? 'blog_categories' : 'categories';
        const { data, error } = await supabase.from(table).insert([catData]).select();
        if (error) throw error;
        return data[0];
    },

    async deleteCategory(id, isBlog = false) {
        const table = isBlog ? 'blog_categories' : 'categories';
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    /**
     * Tool Acquisition (Direct Add)
     */
    async addToolDirect(toolData, userId) {
        const slug = toolData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const { data, error } = await supabase.from('tools').insert([{ 
            ...toolData, 
            slug,
            user_id: userId, 
            is_approved: true,
            rating: 5.0,
            reviews_count: 0,
            view_count: 0
        }]).select();
        if (error) throw error;
        return data[0];
    },

    /**
     * Tool Search (Admin)
     */
    async searchTools(query) {
        if (!query.trim()) return [];
        const { data, error } = await supabase
            .from('tools')
            .select('*, categories(name)')
            .eq('is_approved', true)
            .ilike('name', `%${query}%`)
            .limit(5);
        if (error) throw error;
        return data || [];
    },

    /**
     * Featured Status Toggle
     */
    async toggleFeatured(toolId, currentState) {
        const { error } = await supabase.from('tools').update({ is_featured: !currentState }).eq('id', toolId);
        if (error) throw error;
        return !currentState;
    }
};
