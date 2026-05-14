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
            supabase.from('tools').select('*, categories(name), profiles:user_id(id, full_name)').or('is_approved.eq.false,pending_changes.not.is.null').order('updated_at', { ascending: false }),
            supabase.from('tools').select('*, categories(name)').eq('is_featured', true).order('featured_until', { ascending: true }),
            supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
            supabase.from('blog_categories').select('*'),
            supabase.from('categories').select('*'),
            supabase.from('profiles').select('id, full_name, avatar_url, role, updated_at, is_premium').order('updated_at', { ascending: false }),
            supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
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

    async approveTool(tool) {
        let updatePayload = { is_approved: true };
        if (tool.pending_changes) {
            updatePayload = { ...updatePayload, ...tool.pending_changes, pending_changes: null };
        }
        
        const { data, error } = await supabase.from('tools').update(updatePayload).eq('id', tool.id).select();
        if (error) throw error;
        return data[0];
    },

    async rejectTool(tool) {
        const isUpdate = !!tool.pending_changes;
        if (isUpdate) {
            const { error } = await supabase.from('tools').update({ pending_changes: null }).eq('id', tool.id);
            if (error) throw error;
        } else {
            return this.deleteTool(tool.id);
        }
        return true;
    },

    async deleteTool(toolId) {
        if (!toolId) throw new Error('Tool ID is required for deletion');

        const cleanup = [
            supabase.from('seo_metadata').delete().eq('entity_id', toolId).eq('entity_type', 'tool'),
            supabase.from('reviews').delete().eq('tool_id', toolId),
            supabase.from('favorites').delete().eq('tool_id', toolId)
        ];

        await Promise.all(cleanup);

        const { error } = await supabase.from('tools').delete().eq('id', toolId);
        if (error) throw error;
        return true;
    },

    async createBlogPost(postData, authorName) {
        const slug = postData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const { data, error } = await supabase
            .from('blog_posts')
            .insert([{ ...postData, slug, author_name: authorName }])
            .select();
            
        if (error) throw error;
        return data[0];
    },

    async updateBlogPost(postId, postData) {
        const slug = postData.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const { data, error } = await supabase
            .from('blog_posts')
            .update({ ...postData, slug, updated_at: new Date().toISOString() })
            .eq('id', postId)
            .select();
            
        if (error) throw error;
        return data[0];
    },

    async deleteBlogPost(postId) {
        // Step 1: Verify visibility (Rule #22)
        const { data: checkData, error: checkError } = await supabase.from('blog_posts').select('id').eq('id', postId).single();
        if (checkError) {
            console.error('Visibility Check Failed:', checkError);
            throw new Error(`Delete Failed: Post not visible or access denied. (${checkError.message})`);
        }

        // Step 2: Attempt Hardened Delete
        const { data, error } = await supabase.from('blog_posts').delete().eq('id', postId).select();
        
        if (error) {
            console.error('Supabase Delete Error:', error);
            throw new Error(`Delete Failed: ${error.message} ${error.details || ''}`);
        }
        
        if (!data || data.length === 0) {
            throw new Error('Delete confirmed by DB but no rows affected. Check RLS policies.');
        }

        return true;
    },

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

    async addToolDirect(toolData, userId) {
        const slug = toolData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const { data, error } = await supabase.from('tools').insert([{ 
            ...toolData, 
            slug,
            user_id: userId, 
            is_approved: true,
            is_verified: true,
            rating: 5.0,
            reviews_count: 0,
            view_count: 0
        }]).select();
        if (error) throw error;
        return data[0];
    },

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

    async toggleFeatured(toolId, currentState) {
        const { error } = await supabase.from('tools').update({ is_featured: !currentState }).eq('id', toolId);
        if (error) throw error;
        return !currentState;
    },

    async fetchAllToolsPaginated(page = 1, pageSize = 10) {
        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;

        const { data, error, count } = await supabase
            .from('tools')
            .select('*, categories(name)', { count: 'exact' })
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;
        return { data, total: count };
    },

    async updateToolDirect(toolId, updateData) {
        const { data, error } = await supabase
            .from('tools')
            .update(updateData)
            .eq('id', toolId)
            .select();
        
        if (error) throw error;
        return data[0];
    },

    async sendNewsletterBroadcast(campaignData) {
        const { data: subsData, error: subsError } = await supabase.from('newsletter_subscribers').select('email');
        if (subsError) throw subsError;
        
        const subs = subsData.filter(sub => sub.email.toLowerCase().endsWith('@gmail.com'));
        if (!subs || subs.length === 0) throw new Error('No valid Gmail subscribers found.');

        const results = { total: subs.length, sent: 0, failed: 0 };
        for (const sub of subs) {
            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        type: 'newsletter_broadcast',
                        to: sub.email,
                        data: campaignData
                    })
                });
                if (!response.ok) throw new Error('API Error');
                results.sent++;
            } catch (err) {
                results.failed++;
            }
        }
        return results;
    }
};
