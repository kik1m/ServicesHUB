import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling user-related database queries
 */
export const userService = {
    /**
     * Get total users count
     */
    async getUsersCount() {
        return supabase
            .from('profiles')
            .select('id', { count: 'exact', head: true });
    }
};
