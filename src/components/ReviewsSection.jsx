import React, { useMemo } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useReviewsData } from '../hooks/useReviewsData';
import { Link } from 'react-router-dom';

// Import UI Atoms
import Button from './ui/Button';
import Skeleton from './ui/Skeleton';
import EmptyState from './ui/EmptyState';

// Import Sub-Components
import ReviewForm from './Reviews/ReviewForm';
import ReviewList from './Reviews/ReviewList';

// Import Constants & Styles
import { SKELETON_COUNTS } from '../constants/toolDetailConstants';
import styles from './ReviewsSection.module.css';

/**
 * ReviewsSection - Elite Standard
 * Rule #1: Logic Isolation (useReviewsData)
 * Rule #19: Component Splitting
 */
const ReviewsSection = ({ toolId, content, onReviewSuccess }) => {
    // Rule #38: Resilience Fallback
    const labels = useMemo(() => content || {}, [content]);

    const {
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
        user
    } = useReviewsData(toolId, labels, onReviewSuccess);

    const reviewCountText = useMemo(() => {
        if (isLoading) return '...';
        const count = reviews.length;
        return `${count} ${count === 1 ? labels.countSingle : labels.countPlural}`;
    }, [reviews.length, isLoading, labels.countSingle, labels.countPlural]);

    if (isLoading && reviews.length === 0) {
        return (
            <div className={styles.reviewsSection}>
                <div className={styles.sectionHeader}>
                    <Skeleton width="200px" height="32px" borderRadius="8px" />
                </div>
                <div className={styles.reviewsLayout}>
                    <div className={styles.formContainer}>
                        <Skeleton height="300px" borderRadius="20px" />
                    </div>
                    <div className={styles.listContainer}>
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} height="120px" borderRadius="16px" className={styles.mb1rem} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className={styles.reviewsSection}>
            <div className={styles.sectionHeader}>
                <div className={styles.headerTitleGroup}>
                    <MessageSquare size={28} className={styles.headerIcon} />
                    <h3 className={styles.sectionTitle}>{labels.title}</h3>
                </div>
                <span className={styles.reviewCountBadge}>{reviewCountText}</span>
            </div>

            <div className={styles.reviewsLayout}>
                <aside className={styles.formContainer}>
                    <div className={styles.formInner}>
                        <h4 className={styles.formTitle}>{labels.writeReview}</h4>
                        
                        {user ? (
                            hasUserReviewed ? (
                                <div className={styles.submittedCard}>
                                    <div className={styles.successIconWrapper}>
                                        <div className={styles.successIconBg}>
                                            <Star size={32} fill="var(--primary)" stroke="var(--primary)" />
                                        </div>
                                    </div>
                                    <p className={styles.successText}>{labels.reviewSubmitted}</p>
                                    <p className={styles.successSubtext}>{labels.thankYou}</p>
                                </div>
                            ) : (
                                <ReviewForm 
                                    rating={rating}
                                    setRating={setRating}
                                    comment={comment}
                                    setComment={setComment}
                                    hoveredRating={hoveredRating}
                                    setHoveredRating={setHoveredRating}
                                    onSubmit={submitReview}
                                    submitting={submitting}
                                />
                            )
                        ) : (
                            <div className={styles.loginRequiredCard}>
                                <p className={styles.loginText}>{labels.loginRequired}</p>
                                <Button as={Link} to="/auth" variant="outline" className={styles.fullWidth}>
                                    {labels.signInToReview}
                                </Button>
                            </div>
                        )}
                    </div>
                </aside>

                <main className={styles.listContainer}>
                    {reviews.length > 0 ? (
                        <ReviewList reviews={reviews} />
                    ) : (
                        <EmptyState 
                            message={labels.empty?.title}
                            description={labels.empty?.desc}
                            icon={MessageSquare}
                            variant="small"
                        />
                    )}
                </main>
            </div>
        </section>
    );
};

export default ReviewsSection;
