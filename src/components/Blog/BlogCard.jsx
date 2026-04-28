import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogCard.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogCard - Scoped component for the blog magazine list
 * Rule #12: Pure UI Component
 */
const BlogCard = ({ post, isLoading, error, onRetry }) => {
    const { CARD } = BLOG_CONSTANTS;

    if (isLoading) {
        return (
            <div className={styles.blogCard}>
                <div className={styles.imageWrapper}>
                    <Skeleton className={styles.skeletonImage} />
                </div>
                <div className={styles.cardContent}>
                    <div className={styles.metaRow}>
                        <Skeleton className={styles.skeletonMeta} />
                        <Skeleton className={styles.skeletonMeta} />
                    </div>
                    <Skeleton className={styles.skeletonTitle} />
                    <Skeleton className={styles.skeletonExcerpt} />
                    <Skeleton className={styles.skeletonExcerpt} />
                    <Skeleton className={styles.skeletonButton} />
                </div>
            </div>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <Link to={`/blog/${post?.id}`} className={styles.blogCard}>
                <div className={styles.imageWrapper}>
                    <SmartImage 
                        src={post?.image_url} 
                        alt={post?.title} 
                        className={styles.blogImage}
                        fallback={CARD?.IMAGE_FALLBACK}
                    />
                    <div className={styles.categoryBadge}>
                        {post?.category}
                    </div>
                </div>

                <div className={styles.cardContent}>
                    <div className={styles.metaRow}>
                        <div className={styles.metaItem}>
                            <Calendar size={14} /> 
                            {post?.created_at && new Date(post.created_at).toLocaleDateString()}
                        </div>
                        <div className={styles.metaItem}>
                            <User size={14} /> 
                            {post?.author_name || CARD?.AUTHOR_FALLBACK}
                        </div>
                    </div>
                    
                    <h3 className={styles.cardTitle}>{post?.title}</h3>
                    <p className={styles.excerpt}>
                        {post?.excerpt}
                    </p>
                    
                    <div className={styles.cardFooter}>
                        <Button 
                            variant="text" 
                            icon={ArrowRight} 
                            iconPosition="right"
                            className={styles.readMoreBtn}
                            as="span"
                        >
                            {CARD?.READ_MORE}
                        </Button>
                    </div>
                </div>
            </Link>
        </Safeguard>
    );
};

export default React.memo(BlogCard);




