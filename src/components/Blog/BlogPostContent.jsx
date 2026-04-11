import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';
import styles from './BlogPostContent.module.css';

const BlogPostContent = ({ post }) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    return (
        <div className={styles.postContainer}>
            <div className={styles.featuredImageContainer}>
                <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60'} 
                    alt={post.title} 
                />
            </div>

            <div className={styles.articleBody}>
                <div className={styles.proseContent} dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className={styles.articleFooter}>
                    <div className={styles.shareBox}>
                        <span className={styles.shareLabel}>Share this article:</span>
                        <div className={styles.shareButtons}>
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className={styles.iconBtn}
                            >
                                <Twitter size={18} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className={styles.iconBtn}
                            >
                                <Facebook size={18} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className={styles.iconBtn}
                            >
                                <Linkedin size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="tags">
                        <span className={styles.catTag}>
                            #{post.category?.replace(/\s+/g, '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostContent;
