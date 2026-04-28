import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool review operations
 */
export const reviewsService = {
    /**
     * Fetch all reviews for a specific tool
     * @param {string} toolId 
     */
    async getReviewsByToolId(toolId) {
        return supabase
            .from('reviews')
            .select(`
                *,
                profiles (
                    full_name,
                    avatar_url
                )
            `)
            .eq('tool_id', toolId)
            .order('created_at', { ascending: false });
    },

    /**
     * Submit a new review
     * @param {Object} reviewData 
     */
    async submitReview({ tool_id, user_id, rating, comment }) {
        try {
            // 1. Insert the new review
            const { data: review, error: reviewError } = await supabase
                .from('reviews')
                .insert([{
                    tool_id,
                    user_id,
                    rating,
                    comment,
                    created_at: new Date().toISOString()
                }])
                .select(`
                    *,
                    profiles (
                        full_name,
                        avatar_url
                    )
                `)
                .single();

            if (reviewError) throw reviewError;

            // 2. Fetch all reviews to recalculate stats
            const { data: allReviews, error: fetchError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('tool_id', tool_id);

            if (fetchError) throw fetchError;

            // 3. Calculate new average and count
            const count = allReviews.length;
            const average = allReviews.reduce((sum, r) => sum + r.rating, 0) / count;

            // 4. Update the tools table
            const { error: updateError } = await supabase
                .from('tools')
                .update({ 
                    rating: average, 
                    reviews_count: count 
                })
                .eq('id', tool_id);

            if (updateError) throw updateError;

            return { data: review, error: null };
        } catch (err) {
            console.error('submitReview Error:', err);
            return { data: null, error: err };
        }
    }
};
