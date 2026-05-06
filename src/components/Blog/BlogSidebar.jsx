import React from 'react';
import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogSidebar.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogSidebar - Sidebar with related articles and newsletter for the blog post page
 * Rule #12: Pure UI Component
 */
const BlogSidebar = ({ relatedPosts, isLoading, error, onRetry }) => {
    const { SIDEBAR, SKELETONS } = BLOG_CONSTANTS;

    if (isLoading) {
        return (
            <aside className={styles.sidebar}>
                <div className={styles.widget}>
                    <Skeleton className={styles.skeletonTitle} />
                    <Skeleton className={styles.skeletonText} />
                    <Skeleton className={styles.skeletonText} />
                    <Skeleton className={styles.skeletonInput} />
                    <Skeleton className={styles.skeletonButton} />
                </div>
                <div className={styles.widget}>
                    <Skeleton className={styles.skeletonTitle} />
                    {SKELETONS.RELATED_SIDEBAR.map(i => (
                        <div key={i} className={styles.skeletonRelatedItem}>
                            <Skeleton className={styles.skeletonThumb} />
                            <div className={styles.skeletonRelatedContent}>
                                <Skeleton className={styles.skeletonRelatedTitle} />
                                <Skeleton className={styles.skeletonRelatedTitle} />
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        );
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <aside className={styles.sidebar}>
                <div className={styles.widget}>
                    <h4>
                        <Share2 size={18} color="var(--primary)" /> {SIDEBAR?.NEWSLETTER?.TITLE}
                    </h4>
                    <p>
                        {SIDEBAR?.NEWSLETTER?.SUBTITLE}
                    </p>
                    <Input 
                        id="newsletter-email"
                        type="email" 
                        placeholder={SIDEBAR?.NEWSLETTER?.PLACEHOLDER} 
                        className={styles.newsInput}
                        variant="glass"
                    />
                    <Button variant="primary" className={styles.subscribeBtn}>
                        {SIDEBAR?.NEWSLETTER?.BUTTON}
                    </Button>
                </div>

                {relatedPosts && relatedPosts?.length > 0 && (
                    <div className={styles.widget}>
                        <h4>{SIDEBAR?.RELATED?.TITLE}</h4>
                        <div className={styles.relatedList}>
                            {relatedPosts?.map(p => (
                                <Link key={p?.id} to={`/blog/${p?.slug || p?.id}`} className={styles.relatedItem}>
                                    <div className={styles.thumbWrapper}>
                                        <SmartImage 
                                            src={p?.image_url} 
                                            alt="" 
                                            className={styles.thumbImg}
                                            fallback={SIDEBAR?.RELATED?.IMAGE_FALLBACK}
                                        />
                                    </div>
                                    <h5>{p?.title}</h5>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </aside>
        </Safeguard>
    );
};

export default React.memo(BlogSidebar);




