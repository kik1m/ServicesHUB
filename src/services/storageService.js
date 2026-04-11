import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling image uploads to Supabase Storage
 */
export const storageService = {
    /**
     * Upload an image to the tool-images bucket
     * @param {File} file - The file object to upload
     * @returns {Promise<string>} - The public URL of the uploaded image
     */
    async uploadToolImage(file) {
        if (!file) throw new Error('No file provided');

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            throw new Error('File size exceeds 2MB limit');
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `tool-thumbnails/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('tool-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('tool-images')
            .getPublicUrl(filePath);

        return publicUrl;
    },

    /**
     * Upload a user avatar to the tool-images bucket (avatars folder)
     * @param {string} userId - User ID to associate with the avatar
     * @param {File} file - The file object to upload
     * @returns {Promise<string>} - The public URL of the uploaded avatar
     */
    async uploadAvatar(userId, file) {
        if (!file) throw new Error('No file provided');

        const fileExt = file.name.split('.').pop();
        const filePath = `avatars/${userId}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('tool-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('tool-images')
            .getPublicUrl(filePath);

        return publicUrl;
    }
};
