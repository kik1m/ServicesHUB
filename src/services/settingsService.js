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
     * Upload user avatar to Supabase Storage.
     * - Validates file size (max 2MB)
     * - Removes any existing avatar for this user
     * - Uploads new file to the 'avatars' bucket
     * - Updates Supabase Auth user_metadata so the picture propagates
     *   to every component (Navbar, AI Chat, etc.) without a page reload
     *
     * @param {string} userId
     * @param {File} file
     * @returns {string} publicUrl of the uploaded avatar
     */
    async uploadAvatar(userId, file) {
        if (!userId) throw new Error('User ID is required');

        // 1. Validate file size (max 2MB)
        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            throw new Error('Image size must be under 2MB. Please choose a smaller file.');
        }

        // 2. Build a deterministic path so we can replace (not accumulate) files
        const fileExt = file.name.split('.').pop().toLowerCase();
        const filePath = `avatars/${userId}.${fileExt}`;

        // 3. Remove old avatar if it exists (ignore errors — it may not exist yet)
        await supabase.storage.from('avatars').remove([filePath]).catch(() => {});

        // 4. Upload the new avatar (upsert: true overwrites if same path exists)
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, file, { upsert: true, cacheControl: '3600' });

        if (uploadError) throw uploadError;

        // 5. Get the public URL
        const { data } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Add a cache-busting timestamp so the browser fetches the new image
        const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

        // 6. Update Supabase Auth Metadata — this propagates the new avatar
        //    to useAuth() → Navbar, AI Chat, and any component reading user_metadata
        await supabase.auth.updateUser({
            data: { avatar_url: publicUrl }
        }).catch(err => console.warn('Could not sync avatar to auth metadata:', err));

        return publicUrl;
    }
};

