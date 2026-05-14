import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling user settings and account management
 * Elite Standard Architecture
 */
export const settingsService = {
    /**
     * Fetch user profile data
     * @param {string} userId 
     */
    async getProfile(userId) {
        if (!userId) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "No rows found"
            console.error('Error fetching profile:', error);
            throw error;
        }

        return data;
    },

    /**
     * Update user profile data
     * @param {string} userId 
     * @param {Object} profileData 
     */
    async updateProfile(userId, profileData) {
        if (!userId) throw new Error('User ID is required');

        const { error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString()
            });

        if (error) throw error;
        return true;
    },

    /**
     * Upload user avatar to storage
     */
    async uploadAvatar(userId, file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Math.random()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
