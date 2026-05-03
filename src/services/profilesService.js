import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling user profiles and publisher-related queries
 * Elite v2.2 Standard: Defensive Layer & Sanitization
 */
export const profilesService = {
    /**
     * Get a user profile by their ID with automatic sanitization
     * @param {string} userId 
     */
    async getProfileById(userId) {
        if (!userId) return { data: null, error: 'User ID is required' };
        
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();

            if (error) throw error;
            if (!data) return { data: null, error: null };

            // Rule #24.3: Data Sanitization (Elite Normalization)
            const sanitized = {
                ...data,
                full_name: data.full_name || 'Member',
                avatar_url: data.avatar_url || null, // UI handles default via SmartImage
                bio: data.bio || null,
                role: data.role || 'Member',
                joinYear: data.created_at ? new Date(data.created_at).getFullYear() : new Date().getFullYear(),
                is_premium: !!data.is_premium,
                is_verified: !!data.is_verified
            };

            return { data: sanitized, error: null };
        } catch (err) {
            console.error('profilesService.getProfileById Error:', err);
            return { data: null, error: err.message };
        }
    },

    /**
     * Fetches a public profile by its ID (UUID) with Elite Sanitization
     * @param {string} id 
     */
    async getPublicProfile(id) {
        if (!id) throw new Error('User ID is required');

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            
            // Rule #24.3: Elite Sanitization
            return {
                ...data,
                full_name: data.full_name || 'Member',
                role: data.role || 'Member',
                bio: data.bio || 'No bio provided.',
                is_premium: !!data.is_premium,
                is_verified: !!data.is_verified,
                followers_count: data.followers_count || 0,
                following_count: data.following_count || 0,
                joinYear: data.created_at ? new Date(data.created_at).getFullYear() : null
            };
        } catch (err) {
            console.error('profilesService.getPublicProfile Error:', err);
            throw err;
        }
    },

    /**
     * Fetches all approved tools published by a specific user
     * @param {string} id 
     */
    async getPublicTools(id) {
        if (!id) throw new Error('User ID is required');

        try {
            const { data, error } = await supabase
                .from('tools')
                .select('*, categories(name)')
                .eq('user_id', id)
                .eq('is_approved', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('profilesService.getPublicTools Error:', err);
            return [];
        }
    },

    /**
     * Get total users count for platform stats
     */
    async getUsersCount() {
        return supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });
    }
};
