import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling user profiles and publisher-related queries
 */
export const profilesService = {
    /**
     * Get a user profile by their ID
     * @param {string} userId 
     */
    async getProfileById(userId) {
        if (!userId) return { data: null, error: null };
        return supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle();
    }
};
