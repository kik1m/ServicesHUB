import React, { memo } from 'react';
import { Star, User } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ReviewList.module.css';

const ReviewList = ({ reviews = [], isLoading, error, onRetry }) => {
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

    return (
        <Safeguard error={error} onRetry={onRetry} title="Reviews Unavailable">
            <div className={styles.reviewsList}>
                {reviews?.map(review => (
                    <div key={review?.id} className={styles.reviewCard}>
                        <div className={styles.userAvatarWrapper}>
                            <SmartImage 
                                src={review?.profiles?.avatar_url} 
                                alt="Avatar" 
                                fallbackIcon={User}
                                containerClassName={styles.userAvatar} 
                                className={styles.userAvatar}
                            />
                        </div>
                        <div className={styles.reviewContentArea}>
                            <div className={styles.reviewHeader}>
                                <h5 className={styles.userName}>{review?.profiles?.full_name || 'Anonymous User'}</h5>
                                <span className={styles.reviewDate}>
                                    {review?.created_at ? new Date(review.created_at).toLocaleDateString(undefined, { 
                                        year: 'numeric', 
                                        month: 'short', 
                                        day: 'numeric' 
                                    }) : ''}
                                </span>
                            </div>
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
                            <p className={styles.commentText}>
                                {review?.comment}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </Safeguard>
    );
};

export default memo(ReviewList);
