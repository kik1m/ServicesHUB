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
            .update({
                ...profileData,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId);

        if (error) throw error;
        return true;
    },

    /**
     * Upload user avatar via the secure server-side API route.
     *
     * The server route uses the Supabase Admin client which bypasses all
     * RLS policies — this is the correct pattern for user-owned storage
     * operations that need both security (auth check server-side) and
     * permission (admin write to storage).
     *
     * @param {string} userId  - The authenticated user's ID
     * @param {File}   file    - The image File object from the input element
     * @returns {string}       - The public URL of the uploaded avatar
     */
    async uploadAvatar(userId, file) {
        if (!userId) throw new Error('User ID is required');

        // 1. Client-side validation (prevents unnecessary round-trip)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error('Image must be under 2MB. Please choose a smaller file.');
        }

        // 2. Get the current auth session token to authenticate the API call
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            throw new Error('You must be signed in to upload an image.');
        }

        // 3. Send the file to our secure server-side API route
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/user/upload-avatar', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            },
            body: formData
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'Upload failed. Please try again.');
        }

        return result.url;
    }
};

