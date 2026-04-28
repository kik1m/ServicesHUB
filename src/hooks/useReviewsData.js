import { useState, useEffect, useCallback, useMemo } from 'react';
import { reviewsService } from '../services/reviewsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook for managing tool review lifecycle
 * Handles fetching, submission, and validation logic
 */
export const useReviewsData = (toolId, labels, onReviewSuccess) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [reviews, setReviews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    const fetchReviews = useCallback(async () => {
        if (!toolId) return;
        setIsLoading(true);
        try {
            const { data, error } = await reviewsService.getReviewsByToolId(toolId);
            if (error) throw error;
            setReviews(data?.filter(Boolean) ?? []);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            showToast('Failed to load reviews.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [toolId, showToast]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const submitReview = async (e) => {
        if (e) e.preventDefault();
        
        if (!user) {
            showToast(labels?.loginRequired || 'Please sign in to review', 'info');
            return;
        }

        if (comment.trim().length < 5) {
            showToast(labels?.minLengthError || 'Comment too short', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const { data, error } = await reviewsService.submitReview({
                tool_id: toolId,
                user_id: user.id,
                rating,
                comment
            });

            if (error) {
                if (error.code === '23505') {
                    showToast(labels?.alreadySubmitted || 'Already reviewed', 'error');
                } else {
                    throw error;
                }
            } else {
                setReviews(prev => [data, ...prev]);
                setComment('');
                setRating(5);
                showToast(labels?.success || 'Review posted!', 'success');
                // Rule #1: Refresh parent data (Tool Detail)
                if (onReviewSuccess) onReviewSuccess();
            }
        } catch (err) {
            console.error('Review submission error:', err);
            showToast('Failed to submit review.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const hasUserReviewed = useMemo(() => {
        return user && reviews.some(r => r.user_id === user.id);
    }, [user, reviews]);

    return {
        reviews,
        isLoading,
        submitting,
        rating,
        setRating,
        comment,
        setComment,
        hoveredRating,
        setHoveredRating,
        submitReview,
        hasUserReviewed,
        user,
        refresh: fetchReviews
    };
};
