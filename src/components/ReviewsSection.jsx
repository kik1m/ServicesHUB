import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Star, MessageSquare, Loader2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from './SkeletonLoader';
import { Link } from 'react-router-dom';

const ReviewsSection = ({ toolId }) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoveredRating, setHoveredRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            if (!toolId) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('reviews')
                    .select('*, profiles(full_name, avatar_url)')
                    .eq('tool_id', toolId)
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                setReviews(data || []);
            } catch (err) {
                console.error('Error fetching reviews:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [toolId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user) {
            showToast('You must be logged in to leave a review.', 'info');
            return;
        }

        if (comment.trim().length < 5) {
            showToast('Please write a slightly longer review (min 5 characters).', 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert([{
                    tool_id: toolId,
                    user_id: user.id,
                    rating: rating,
                    comment: comment
                }])
                .select('*, profiles(full_name, avatar_url)')
                .single();

            if (error) {
                if (error.code === '23505') { // Unique violation
                    showToast('You have already reviewed this tool.', 'error');
                } else {
                    throw error;
                }
            } else {
                setReviews([data, ...reviews]);
                setComment('');
                setRating(5);
                showToast('Review submitted successfully!', 'success');
            }
        } catch (err) {
            console.error('Review submission error:', err);
            showToast('Failed to submit review.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="reviews-section" style={{ marginTop: '5rem', paddingTop: '4rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                <MessageSquare size={28} color="var(--primary)" />
                <h3 style={{ fontSize: '2rem', fontWeight: '800' }}>User Reviews</h3>
                <span style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
            </div>

            <div className="reviews-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '4rem' }}>
                {/* Submit Review Form */}
                <div className="review-form-container">
                    <div className="glass-card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h4 style={{ fontWeight: '700', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Write a Review</h4>
                        
                        {user ? (
                            reviews.some(r => r.user_id === user.id) ? (
                                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <div style={{ background: 'rgba(0, 255, 136, 0.1)', padding: '15px', borderRadius: '50%' }}>
                                            <Star size={32} color="#00ff88" fill="#00ff88" />
                                        </div>
                                    </div>
                                    <p style={{ color: '#00ff88', marginBottom: '0.5rem', fontWeight: 'bold' }}>Review Submitted</p>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Thank you for sharing your experience!</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Rating</label>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star 
                                                    key={star} 
                                                    size={32} 
                                                    fill={(hoveredRating || rating) >= star ? '#ffc107' : 'none'}
                                                    color={(hoveredRating || rating) >= star ? '#ffc107' : 'var(--text-muted)'}
                                                    style={{ cursor: 'pointer', transition: '0.2s' }}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    onClick={() => setRating(star)}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your Experience</label>
                                        <textarea 
                                            rows="5"
                                            placeholder="What did you like or dislike?"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="nav-search-wrapper"
                                            style={{ width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', borderRadius: '12px', resize: 'vertical' }}
                                            required
                                        ></textarea>
                                    </div>

                                    <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Post Review'}
                                    </button>
                                </form>
                            )
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>You must sign in to share your experience.</p>
                                <Link to="/auth" className="btn-outline" style={{ width: '100%', display: 'block' }}>Sign In</Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="reviews-list-container">
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {[1,2,3].map(i => (
                                <div key={i} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '20px' }}>
                                    <SkeletonLoader type="avatar" width="50px" height="50px" borderRadius="50%" />
                                    <div style={{ flex: 1 }}>
                                        <SkeletonLoader width="150px" height="20px" style={{ marginBottom: '10px' }} />
                                        <SkeletonLoader height="60px" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : reviews.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {reviews.map(review => (
                                <div key={review.id} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '20px', background: 'rgba(255,255,255,0.01)' }}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                        {review.profiles?.avatar_url ? (
                                            <img src={review.profiles.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <User size={24} color="white" />
                                        )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <h5 style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>{review.profiles?.full_name || 'Anonymous User'}</h5>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px', marginBottom: '15px' }}>
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} size={14} fill={review.rating >= s ? '#ffc107' : 'none'} color={review.rating >= s ? '#ffc107' : 'rgba(255,255,255,0.1)'} />
                                            ))}
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 }}>
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                            <Star size={48} color="var(--border)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                            <h4 style={{ fontWeight: '700', marginBottom: '0.5rem' }}>No reviews yet!</h4>
                            <p style={{ color: 'var(--text-muted)' }}>Be the first to share your thoughts on this tool.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
