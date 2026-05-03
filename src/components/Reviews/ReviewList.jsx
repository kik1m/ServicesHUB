import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Star, User, CheckCircle2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ReviewList.module.css';

const ReviewList = ({ 
    reviews = [], 
    user, 
    isLoading, 
    error, 
    onRetry,
    onReply,
    onDelete,
    replyingTo,
    setReplyingTo,
    replyComment,
    setReplyComment,
    isSubmitting
}) => {
    // Partition reviews into parents and children
    const parentReviews = useMemo(() => reviews.filter(r => !r.parent_id), [reviews]);
    const getReplies = (parentId) => reviews.filter(r => r.parent_id === parentId);

    if (isLoading) {
        return (
            <div className={styles.reviewsList}>
                {[1, 2, 3].map(i => (
                    <div key={`sk-rev-${i}`} className={styles.reviewCard}>
                        <div className={styles.userAvatarWrapper}>
                            <Skeleton className={styles.userAvatar} />
                        </div>
                        <div className={styles.reviewContentArea}>
                            <Skeleton width="150px" height="20px" style={{ marginBottom: '10px' }} />
                            <Skeleton width="100px" height="14px" style={{ marginBottom: '15px' }} />
                            <Skeleton width="100%" height="16px" style={{ marginBottom: '8px' }} />
                            <Skeleton width="80%" height="16px" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    const renderReviewCard = (review, isReply = false) => {
        const isAuthor = user?.id === review.user_id;
        const isAdmin = user?.role?.toLowerCase() === 'admin';

        return (
            <div key={review?.id} className={`${isReply ? styles.replyCard : styles.reviewCard} ${review.is_owner_reply ? styles.ownerReply : ''} fade-in`}>
                <Link to={`/u/${review?.profiles?.id || review?.user_id}`} className={styles.userAvatarWrapper}>
                    <SmartImage 
                        src={review?.profiles?.avatar_url} 
                        alt="Avatar" 
                        fallbackIcon={User}
                        containerClassName={styles.userAvatar} 
                        className={styles.userAvatar}
                    />
                </Link>
                <div className={styles.reviewContentArea}>
                    <div className={styles.reviewHeader}>
                        <div className={styles.userInfoRow}>
                            <Link to={`/u/${review?.profiles?.id || review?.user_id}`} className={styles.userLink}>
                                <h5 className={styles.userName}>{review?.profiles?.full_name || 'Anonymous User'}</h5>
                            </Link>
                            {review?.profiles?.role?.toLowerCase() === 'admin' && (
                                <CheckCircle2 size={20} className={styles.adminCheck} strokeWidth={2.5} />
                            )}
                            {review?.profiles?.is_premium && (
                                <span className={styles.premiumBadge}>Premium</span>
                            )}
                            {review.is_owner_reply && (
                                <span className={styles.ownerBadge}>Tool Owner</span>
                            )}
                        </div>
                        <div className={styles.headerRight}>
                            <span className={styles.reviewDate}>
                                {review?.created_at ? new Date(review.created_at).toLocaleDateString(undefined, { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                }) : ''}
                            </span>
                            {(isAuthor || isAdmin) && (
                                <button 
                                    className={styles.deleteBtn} 
                                    onClick={() => onDelete(review.id)}
                                    title="Delete review"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    {!isReply && (
                        <div className={styles.starsRow}>
                            {[1,2,3,4,5].map(s => (
                                <Star 
                                    key={`rev-${review?.id}-star-${s}`} 
                                    size={14} 
                                    fill={(review?.rating >= s) ? '#ffc107' : 'none'} 
                                    stroke={(review?.rating >= s) ? '#ffc107' : 'rgba(255,255,255,0.1)'} 
                                />
                            ))}
                        </div>
                    )}
                    <p className={styles.commentText}>
                        {review?.comment}
                    </p>

                    {/* Action Row */}
                    {user && (
                        <div className={styles.replyActionRow}>
                            {!isReply && (
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                                >
                                    {replyingTo === review.id ? 'Cancel' : 'Reply'}
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Reply Input Area */}
                    {replyingTo === review.id && (
                        <div className={styles.replyInputArea}>
                            <textarea 
                                className={styles.replyTextarea}
                                placeholder="Write your reply..."
                                value={replyComment}
                                onChange={(e) => setReplyComment(e.target.value)}
                            />
                            <div className={styles.replyButtons}>
                                <Button 
                                    size="sm" 
                                    onClick={() => onReply(review.id)}
                                    isLoading={isSubmitting}
                                    disabled={!replyComment.trim()}
                                >
                                    Post Reply
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <Safeguard error={error} onRetry={onRetry} title="Reviews Unavailable">
            <div className={styles.reviewsList}>
                {parentReviews?.map(review => (
                    <div key={`container-${review.id}`}>
                        {renderReviewCard(review)}
                        
                        {/* Nested Replies */}
                        {getReplies(review.id).length > 0 && (
                            <div className={styles.repliesContainer}>
                                {getReplies(review.id).map(reply => renderReviewCard(reply, true))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </Safeguard>
    );
};

export default memo(ReviewList);
