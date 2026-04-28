import React from 'react';
import { Star, User } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import styles from '../ReviewsSection.module.css';

const ReviewList = ({ reviews }) => {
    return (
        <div className={styles.reviewsList}>
            {reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.userAvatarWrapper}>
                        <SmartImage 
                            src={review.profiles?.avatar_url} 
                            alt="Avatar" 
                            fallbackIcon={User}
                            containerClassName={styles.userAvatar} 
                            className={styles.userAvatar}
                        />
                    </div>
                    <div className={styles.reviewContentArea}>
                        <div className={styles.reviewHeader}>
                            <h5 className={styles.userName}>{review.profiles?.full_name || 'Anonymous User'}</h5>
                            <span className={styles.reviewDate}>
                                {new Date(review.created_at).toLocaleDateString(undefined, { 
                                    year: 'numeric', 
                                    month: 'short', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                        <div className={styles.starsRow}>
                            {[1,2,3,4,5].map(s => (
                                <Star 
                                    key={`rev-${review.id}-star-${s}`} 
                                    size={14} 
                                    fill={review.rating >= s ? '#ffc107' : 'none'} 
                                    stroke={review.rating >= s ? '#ffc107' : 'rgba(255,255,255,0.1)'} 
                                />
                            ))}
                        </div>
                        <p className={styles.commentText}>
                            {review.comment}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReviewList;
