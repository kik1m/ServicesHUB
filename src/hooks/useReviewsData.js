import { useState, useEffect, useCallback, useMemo } from 'react';
import { reviewsService } from '../services/reviewsService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';

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

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyComment, setReplyComment] = useState('');

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

    const submitReply = async (parentReviewId, isOwner = false) => {
        if (!user) {
            showToast('Please sign in to reply', 'info');
            return;
        }

        if (replyComment.trim().length < 2) {
            showToast('Reply too short', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const { data, error } = await reviewsService.submitReply({
                tool_id: toolId,
                user_id: user.id,
                parent_id: parentReviewId,
                comment: replyComment,
                is_owner_reply: isOwner
            });

            if (error) throw error;
            
            // Elite Notification: Notify the original reviewer
            const originalReview = reviews.find(r => r.id === parentReviewId);
            if (originalReview && originalReview.user_id !== user.id) {
                await sendNotification(
                    originalReview.user_id,
                    isOwner ? 'Official Reply Received!' : 'New Reply on Your Review',
                    isOwner 
                        ? `The creator of the tool has replied to your feedback. Check it out!`
                        : `${user.full_name || 'A user'} replied to your comment.`,
                    'social',
                    { toolId, type: 'review_reply' }
                ).catch(() => {});
            }

            setReviews(prev => [data, ...prev]);
            setReplyComment('');
            setReplyingTo(null);
            showToast('Reply posted!', 'success');
        } catch (err) {
            console.error('Reply error:', err);
            showToast('Failed to post reply.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

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
            // Fetch tool to get owner ID before submitting review
            const { data: tool } = await reviewsService.getToolOwner(toolId);
            
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
                // Elite Notification: Notify Tool Owner
                if (tool && tool.user_id !== user.id) {
                    // Internal Notification
                    await sendNotification(
                        tool.user_id,
                        'New Tool Review Received!',
                        `${user.full_name || 'A user'} rated your tool "${tool.name}" with ${rating} stars.`,
                        'social',
                        { toolId, rating, type: 'new_review' }
                    ).catch(() => {});

                }

                setReviews(prev => [data, ...prev]);
                setComment('');
                setRating(5);
                showToast(labels?.success || 'Review posted!', 'success');
                if (onReviewSuccess) onReviewSuccess();
            }
        } catch (err) {
            console.error('Review submission error:', err);
            showToast('Failed to submit review.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!user) return;
        
        const confirmDelete = window.confirm("Are you sure you want to delete this review? This action cannot be undone.");
        if (!confirmDelete) return;

        setSubmitting(true);
        try {
            const { error } = await reviewsService.deleteReview(reviewId, toolId);
            if (error) throw error;

            setReviews(prev => prev.filter(r => r.id !== reviewId));
            showToast('Review deleted successfully', 'success');
            
            // Refresh to ensure tool rating/count sync across UI
            if (onReviewSuccess) onReviewSuccess();
        } catch (err) {
            console.error('Delete review error:', err);
            showToast('Failed to delete review', 'error');
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
        submitReply,
        handleDeleteReview,
        replyingTo,
        setReplyingTo,
        replyComment,
        setReplyComment,
        hasUserReviewed,
        user,
        refresh: fetchReviews
    };
};
