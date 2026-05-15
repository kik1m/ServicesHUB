import React from 'react';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { blogService } from '../../services/blogService';
import { toolsService } from '../../services/toolsService';
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
    const queryClient = useQueryClient();

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

    const postIdentifier = post?.slug || post?.id;

    const handleMouseEnter = () => {
        if (postIdentifier) {
            queryClient.prefetchQuery({
                queryKey: ['blog_post', postIdentifier],
                queryFn: async () => {
                    const { data: postData, error: postError } = await blogService.getPostByIdOrSlug(postIdentifier);
                    if (postError) throw postError;

                    // Fetch embedded tool details to match useBlogPostData.js EXACTLY
                    const toolIds = [...(postData.content?.matchAll(/\[tool id="([^"]+)"\]/g) || [])].map(m => m[1]);
                    if (toolIds.length > 0) {
                        const { data: embeddedTools } = await toolsService.getToolsByIds(toolIds);
                        postData.embeddedTools = embeddedTools || [];
                    } else {
                        postData.embeddedTools = [];
                    }
                    
                    return postData;
                },
                staleTime: 1000 * 60 * 10 // Cache for 10 minutes
            });
        }
    };

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <Link 
                href={`/blog/${postIdentifier}`} 
                className={styles.blogCard}
                onMouseEnter={handleMouseEnter}
            >
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
                    
                    <h2 className={styles.cardTitle}>{post?.title}</h2>
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




