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
            // 1. Pending Tools & Updates (Enriched with Publisher Profile Data)
            supabase.from('tools').select('*, categories(name), profiles:user_id(id, full_name)').or('is_approved.eq.false,pending_changes.not.is.null').order('updated_at', { ascending: false }),
            
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
    async createBlogPost(postData, authorName) {
        const { data, error } = await supabase.from('blog_posts').insert([{ ...postData, author_name: authorName }]).select();
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
            // This happens if RLS allows SELECT but denies DELETE
            throw new Error(`Critical: Delete command returned 0 affected rows. This is likely a Database Permission (RLS) restriction for the 'DELETE' operation.`);
        }
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
            is_verified: true, // Official Platform Tools are verified by default
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
    },

    /**
     * Fetch all approved tools with pagination
     */
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

    /**
     * Update tool data directly (Admin Override)
     */
    async updateToolDirect(toolId, updateData) {
        const { data, error } = await supabase
            .from('tools')
            .update(updateData)
            .eq('id', toolId)
            .select();
        
        if (error) throw error;
        return data[0];
    },
    /**
     * Broadcast Newsletter to all subscribers
     */
    async sendNewsletterBroadcast(campaignData) {
        // 1. Get all subscribers
        const { data: subsData, error: subsError } = await supabase.from('newsletter_subscribers').select('email');
        if (subsError) throw subsError;
        
        // Filter to ONLY valid Gmail accounts (User's real accounts for testing)
        const subs = subsData.filter(sub => sub.email.toLowerCase().endsWith('@gmail.com'));
        
        if (!subs || subs.length === 0) throw new Error('No valid Gmail subscribers found to broadcast to.');

        // 2. Prepare payload for the Email Engine
        const payload = {
            type: 'newsletter_broadcast',
            subject: campaignData.subject,
            data: {
                subject: campaignData.subject,
                intro: campaignData.intro,
                tools: campaignData.tools,
                specialOffer: campaignData.specialOffer
            }
        };

        // 3. Sequential Broadcast (Safest for delivery)
        const results = { total: subs.length, sent: 0, failed: 0 };
        
        for (const sub of subs) {
            try {
                const response = await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, to: sub.email })
                });
                if (!response.ok) throw new Error('API Error');
                results.sent++;
            } catch (err) {
                console.warn(`Failed to send to ${sub.email}:`, err);
                results.failed++;
            }
        }

        return results;
    }
};
