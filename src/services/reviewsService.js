import { supabase } from '../lib/supabaseClient';

/**
 * Service for handling tool review operations
 */
export const reviewsService = {
    /**
     * Fetch all reviews for a specific tool including replies
     * @param {string} toolId 
     */
    async getReviewsByToolId(toolId) {
        return supabase
            .from('reviews')
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    avatar_url,
                    is_premium,
                    role
                )
            `)
            .eq('tool_id', toolId)
            .order('created_at', { ascending: false });
    },

    /**
     * Submit a reply to a review
     */
    async submitReply({ tool_id, user_id, parent_id, comment, is_owner_reply = false }) {
        return supabase
            .from('reviews')
            .insert([{
                tool_id,
                user_id,
                parent_id,
                comment,
                rating: 5, // Avoid database constraint errors
                is_owner_reply,
                created_at: new Date().toISOString()
            }])
            .select(`
                *,
                profiles (
                    id,
                    full_name,
                    avatar_url,
                    is_premium,
                    role
                )
            `)
            .single();
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
                        id,
                        full_name,
                        avatar_url,
                        is_premium,
                        role
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
    },
    /**
     * Delete a review and update tool stats
     */
    async deleteReview(reviewId, toolId) {
        try {
            // Elite Defensive Strategy: Manual Cascade Delete
            // 1. Delete all replies associated with this review first
            const { error: repliesError } = await supabase
                .from('reviews')
                .delete()
                .eq('parent_id', reviewId);

            if (repliesError) {
                console.warn('Non-critical: Failed to delete replies or none existed:', repliesError);
            }

            // 2. Delete the parent review itself
            const { error: deleteError } = await supabase
                .from('reviews')
                .delete()
                .eq('id', reviewId);

            if (deleteError) throw deleteError;

            // 3. Fetch remaining reviews to recalculate tool stats
            // Note: We only count reviews that are NOT replies (parent_id is null) for the main rating
            const { data: remainingReviews, error: fetchError } = await supabase
                .from('reviews')
                .select('rating')
                .eq('tool_id', toolId)
                .is('parent_id', null);

            if (fetchError) throw fetchError;

            // 4. Calculate new stats
            const count = remainingReviews.length;
            const average = count > 0 
                ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / count 
                : 0;

            // 5. Atomic Update to the tools table
            const { error: updateError } = await supabase
                .from('tools')
                .update({ 
                    rating: average, 
                    reviews_count: count 
                })
                .eq('id', toolId);

            if (updateError) throw updateError;

            return { error: null };
        } catch (err) {
            console.error('deleteReview Elite Error:', err);
            return { error: err };
        }
    },
    /**
     * Fetch tool owner data for notification purposes
     * @param {string} toolId 
     */
    async getToolOwner(toolId) {
        return supabase
            .from('tools')
            .select(`
                user_id, 
                name,
                slug,
                profiles:user_id (
                    id,
                    full_name
                )
            `)
            .eq('id', toolId)
            .single();
    }
};
