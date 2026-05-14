import React, { memo } from 'react';
import { Star } from 'lucide-react';
import Button from '../ui/Button';
import Safeguard from '../ui/Safeguard';
import styles from './ReviewForm.module.css';

const ReviewForm = ({ 
    rating, 
    setRating, 
    comment, 
    setComment, 
    hoveredRating, 
    setHoveredRating, 
    onSubmit, 
    submitting,
    error,
    onRetry,
    content 
}) => {
    return (
        <Safeguard error={error} onRetry={onRetry} title="Review Form Unavailable">
            <form onSubmit={onSubmit} className={styles.reviewForm}>
                <div className={styles.formGroup}>
                    <label className={styles.inputFieldLabel}>{content?.ratingLabel || 'Your Rating'}</label>
                    <div className={styles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                                key={`rating-star-${star}`} 
                                size={32} 
                                fill={(hoveredRating || rating) >= star ? '#ffc107' : 'none'}
                                stroke={(hoveredRating || rating) >= star ? '#ffc107' : 'var(--text-muted)'}
                                className={styles.starIconInteractive}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                onClick={() => setRating(star)}
                            />
                        ))}
                    </div>
                </div>
                
                <div className={styles.formGroup}>
                    <label className={styles.inputFieldLabel}>{content?.experienceLabel || 'Your Experience'}</label>
                    <textarea 
                        rows="5"
                        placeholder={content?.placeholder || "What did you like or dislike about this tool?"}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className={styles.commentArea}
                        required
                    ></textarea>
                </div>

                <Button 
                    type="submit" 
                    isLoading={submitting} 
                    variant="primary" 
                    className={styles.submitBtn}
                >
                    {content?.submitBtn || 'Post Review'}
                </Button>
            </form>
        </Safeguard>
    );
};

export default memo(ReviewForm);
