import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Breadcrumbs from '../Breadcrumbs';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogPostHero.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogPostHero - Elite Isolated Hero for Blog Post Details
 * Rule #12: Pure UI Hero Pattern
 */
const BlogPostHero = ({ post, isLoading, breadcrumbs, error, onRetry }) => {
    const { POST, CARD } = BLOG_CONSTANTS;

    if (isLoading) {
        return (
            <header className={styles.isolatedHeroSection}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroLayoutWrapper}>
                        <div className={styles.titleAuraWrapper}>
                            <div className={styles.auraBlur} style={{ opacity: 0.1 }} />
                            <div className={styles.auraContent}>
                                <Skeleton className={styles.skeletonBadge} />
                                <Skeleton className={styles.skeletonTitle} />
                                <div className={styles.metaHeroSkeleton}>
                                    <Skeleton className={styles.skeletonMetaItem} />
                                    <Skeleton className={styles.skeletonMetaItem} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    const readTime = Math.ceil((post?.content || '').split(' ').length / 200) || 5;
    const featuredImg = post?.image_url || CARD?.IMAGE_FALLBACK;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <header className={styles.isolatedHeroSection}>
                <div className={styles.heroContainer}>
                    <div className={styles.heroLayoutWrapper}>
                        {/* 1. Breadcrumbs Layer - Rule #16 */}
                        {breadcrumbs && (
                            <div className={styles.breadcrumbWrapper}>
                                <Breadcrumbs items={breadcrumbs} />
                            </div>
                        )}

                        {/* 2. Title Aura Wrapper (Dynamic Image Background) */}
                        <div className={styles.titleAuraWrapper} style={{ '--aura-img': `url(${featuredImg})` }}>
                            <div className={styles.auraBlur} />
                            
                            <div className={styles.auraContent}>
                                {/* Category Badge */}
                                <div className={styles.categoryBadge}>
                                    {post?.category || 'Article'}
                                </div>

                                {/* Professional Main Title */}
                                <h1 className={styles.eliteHeadingText}>
                                    {post?.title}
                                </h1>

                                {/* Elite Metadata Row */}
                                <div className={styles.metaHero}>
                                    <div className={styles.authorBox}>
                                        <div className={styles.avatarGlow}>
                                            <User size={20} className={styles.authorIcon} />
                                        </div>
                                        <span className={styles.authorName}>
                                            By <strong>{post?.author_name}</strong>
                                        </span>
                                    </div>
                                    
                                    <div className={styles.metaDivider} />

                                    <div className={styles.metaItem}>
                                        <Calendar size={16} className={styles.metaIcon} />
                                        <span>{post?.created_at && new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <div className={styles.metaDivider} />

                                    <div className={styles.metaItem}>
                                        <Clock size={16} className={styles.metaIcon} />
                                        <span>{readTime} {POST?.READ_TIME_SUFFIX}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </Safeguard>
    );
};

export default React.memo(BlogPostHero);
