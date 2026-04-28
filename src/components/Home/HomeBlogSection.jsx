import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image as ImageIcon, BookOpen } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import { SECTION_LIMITS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeBlogSection.module.css';

/**
 * HomeBlogSection - Elite Insights Grid
 * Rule #29: Pure View with Safeguard protection
 */
const HomeBlogSection = ({ latestPosts = [], isLoading, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const visiblePosts = useMemo(() => {
        const safePosts = latestPosts?.filter(Boolean) ?? [];
        return safePosts.slice(0, SECTION_LIMITS.BLOG);
    }, [latestPosts]);

    return (
        <Safeguard error={error}>
            <section className={styles.latestBlogSection}>
                <SectionHeader 
                    title="Latest" 
                    subtitle="Insights" 
                    description="Stay informed with the newest AI breakthroughs and tutorials."
                >
                    {!isLoading && visiblePosts.length > 0 && (
                        <Button 
                            as={Link} 
                            to="/blog" 
                            variant="text" 
                            className={styles.viewAllLink}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            View Magazine
                        </Button>
                    )}
                </SectionHeader>

                {!isLoading && visiblePosts.length === 0 ? (
                    <EmptyState 
                        title="No articles yet" 
                        message="Our writers are working on new insights. Check back soon!" 
                        icon={BookOpen}
                    />
                ) : (
                    <div className={styles.blogPostsGrid}>
                        {isLoading ? (
                            SKELETON_COUNTS.BLOG_ITEMS.map((i) => (
                                <div key={`skeleton-blog-${i}`} className={styles.blogCard}>
                                    <Skeleton className={styles.skeletonImage} />
                                    <div className={`${styles.blogMeta} ${styles.skeletonMeta}`}>
                                        <Skeleton className={styles.skeletonMetaItem} />
                                        <Skeleton className={styles.skeletonMetaItem} />
                                    </div>
                                    <Skeleton className={styles.skeletonTitleLine1} />
                                    <Skeleton className={styles.skeletonTitleLine2} />
                                </div>
                            ))
                        ) : (
                            visiblePosts.map(post => {
                                if (!post.id) return null;
                                return (
                                    <Link key={post.id} to={`/blog/${post.id}`} className={styles.blogCard}>
                                        <div className={styles.blogCardImage}>
                                            <SmartImage 
                                                src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} 
                                                alt={post.title} 
                                                fallbackIcon={ImageIcon}
                                            />
                                        </div>
                                        <div className={styles.blogMeta}>
                                            <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Recent'}</span>
                                            <span>•</span>
                                            <span className={styles.primaryText}>{post.category || 'General'}</span>
                                        </div>
                                        <h3>{post.title}</h3>
                                        <div className={styles.readMoreLink}>
                                            Read Article <ArrowRight size={14} />
                                        </div>
                                    </Link>
                                );
                            })
                        )}
                    </div>
                )}
            </section>
        </Safeguard>
    );
};

export default HomeBlogSection;
