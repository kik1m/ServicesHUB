import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling user settings and account management
 */
export const settingsService = {
    /**
     * Update user profile data
     * @param {string} userId 
     * @param {Object} profileData 
     */
    async updateProfile(userId, profileData) {
        if (!userId) throw new Error('User ID is required');

        return supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            });
    },

    /**
     * Update user password
     * @param {string} newPassword 
     */
    async updatePassword(newPassword) {
        if (!newPassword || newPassword.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        return supabase.auth.updateUser({
            password: newPassword
        });
    },

    /**
     * Get security status (hypothetical future expansion)
     */
    async getSecurityStatus(userId) {
        // Placeholder for future logic
        return { mfa_enabled: false };
    }
};
