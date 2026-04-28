import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogPostContent.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogPostContent - Main article body for the blog post detail page
 * Rule #12: Pure UI Content Rendering
 */
const BlogPostContent = ({ post, isLoading, error, onRetry }) => {
    const { POST } = BLOG_CONSTANTS;

    if (isLoading) {
        return (
            <div className={styles.postContainer}>
                <div className={styles.articleBody}>
                    <div className={styles.proseContent}>
                        <Skeleton type="text" width="100%" />
                        <Skeleton type="text" width="100%" />
                        <Skeleton type="text" width="90%" />
                        <Skeleton type="text" width="100%" className={styles.skeletonMargin} />
                        <Skeleton type="text" width="100%" />
                        <Skeleton type="text" width="80%" />
                    </div>
                </div>
            </div>
        );
    }

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.postContainer}>
                <div className={styles.articleBody}>
                    <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: post?.content }} />

                    <div className={styles.articleFooter}>
                        <div className={styles.shareBox}>
                            <span className={styles.shareLabel}>{POST?.SHARE_LABEL}</span>
                            <div className={styles.shareButtons}>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Share on Twitter"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post?.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    className={styles.iconBtn}
                                >
                                    <Twitter size={18} />
                                </div>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Share on Facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    className={styles.iconBtn}
                                >
                                    <Facebook size={18} />
                                </div>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    aria-label="Share on LinkedIn"
                                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                    className={styles.iconBtn}
                                >
                                    <Linkedin size={18} />
                                </div>
                            </div>
                        </div>
                        <div className="tags">
                            <span className={styles.catTag}>
                                #{post?.category?.replace(/\s+/g, '')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Safeguard>
    );
};

export default React.memo(BlogPostContent);




