import { supabase } from '../lib/supabaseClient';

/**
 * 🛡️ Social Service - Elite Architecture
 * Responsibility: Handling follower/following relationships
 */
export const socialService = {
    /**
     * Follow a user
     */
    async followUser(followerId, followingId) {
        if (!followerId || !followingId) throw new Error('Invalid IDs');
        
        // 1. Create the follow record
        const { data, error } = await supabase
            .from('follows')
            .insert([{ follower_id: followerId, following_id: followingId }])
            .select()
            .single();
        
        if (error) {
            console.error('socialService.followUser Error:', error);
            throw error;
        }

        // 2. Sync Counts in Profiles Table (Elite Synchronization)
        try {
            // Update Follower's "following_count"
            const { data: followerProfile } = await supabase.from('profiles').select('following_count').eq('id', followerId).single();
            await supabase.from('profiles').update({ following_count: (followerProfile?.following_count || 0) + 1 }).eq('id', followerId);

            // Update Following's "followers_count"
            const { data: followingProfile } = await supabase.from('profiles').select('followers_count').eq('id', followingId).single();
            await supabase.from('profiles').update({ followers_count: (followingProfile?.followers_count || 0) + 1 }).eq('id', followingId);
        } catch (syncErr) {
            console.error('Counter Sync Error:', syncErr);
        }

        return data;
    },

    /**
     * Unfollow a user
     */
    async unfollowUser(followerId, followingId) {
        // 1. Delete the follow record
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followingId);
        
        if (error) {
            console.error('socialService.unfollowUser Error:', error);
            throw error;
        }

        // 2. Sync Counts in Profiles Table (Elite Synchronization)
        try {
            // Update Follower's "following_count"
            const { data: followerProfile } = await supabase.from('profiles').select('following_count').eq('id', followerId).single();
            await supabase.from('profiles').update({ following_count: Math.max(0, (followerProfile?.following_count || 0) - 1) }).eq('id', followerId);

            // Update Following's "followers_count"
            const { data: followingProfile } = await supabase.from('profiles').select('followers_count').eq('id', followingId).single();
            await supabase.from('profiles').update({ followers_count: Math.max(0, (followingProfile?.followers_count || 0) - 1) }).eq('id', followingId);
        } catch (syncErr) {
            console.error('Counter Sync Error:', syncErr);
        }

        return true;
    },

    /**
     * Check if a user is following another
     */
    async isFollowing(followerId, followingId) {
        if (!followerId || !followingId) return false;
        try {
            const { data, error } = await supabase
                .from('follows')
                .select('id')
                .eq('follower_id', followerId)
                .eq('following_id', followingId)
                .maybeSingle();
            
            if (error) return false;
            return !!data;
        } catch (e) {
            return false;
        }
    },

    /**
     * Get list of followers for a user
     */
    async getFollowers(userId) {
        if (!userId) return { data: [], error: 'User ID is required' };
        return supabase
            .from('follows')
            .select(`
                follower:profiles!follower_id (
                    id,
                    full_name,
                    avatar_url,
                    role,
                    is_premium
                )
            `)
            .eq('following_id', userId);
    },

    /**
     * Get list of users a specific user is following
     */
    async getFollowing(userId) {
        if (!userId) return { data: [], error: 'User ID is required' };
        return supabase
            .from('follows')
            .select(`
                following:profiles!following_id (
                    id,
                    full_name,
                    avatar_url,
                    role,
                    is_premium
                )
            `)
            .eq('follower_id', userId);
    },

    /**
     * Get follower/following counts
     */
    async getSocialCounts(userId) {
        try {
            const [followers, following] = await Promise.all([
                supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
                supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId)
            ]);

            return {
                followers: followers.count || 0,
                following: following.count || 0
            };
        } catch (e) {
            return { followers: 0, following: 0 };
        }
    }
};
