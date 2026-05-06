import React from 'react';
import { Twitter, Facebook, Linkedin, ExternalLink, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Skeleton from '../ui/Skeleton';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogPostContent.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogPostContent - Main article body for the blog post detail page
 * Rule #12: Pure UI Content Rendering
 */
const BlogPostContent = ({ post, isLoading, error, onRetry, readingTime }) => {
    const [scrollProgress, setScrollProgress] = React.useState(0);
    const articleRef = React.useRef(null);
    const { POST } = BLOG_CONSTANTS;

    React.useEffect(() => {
        const updateScroll = () => {
            if (!articleRef.current) return;
            
            const element = articleRef.current;
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // The article starts being read when rect.top is 0
            // The article is finished when rect.bottom is windowHeight
            
            const articleHeight = rect.height;
            const scrolled = -rect.top;
            const maxScroll = articleHeight - windowHeight;
            
            if (maxScroll <= 0) {
                setScrollProgress(100);
                return;
            }

            const progress = (scrolled / maxScroll) * 100;
            setScrollProgress(Math.min(100, Math.max(0, progress)));
        };

        window.addEventListener('scroll', updateScroll);
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

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

    /**
     * 🧠 Elite Content Parser (v3.0)
     * Rule #12: Transform shortcodes into rich UI components
     */
    const renderContent = () => {
        if (!post?.content) return null;

        // 1. Identify shortcodes [tool id="uuid"] | [image url="..."] | [compare slug1="..." slug2="..."]
        const parts = post.content.split(/(\[tool id="[^"]+"\]|\[image url="[^"]+"(?:\s+caption="[^"]+")?\]|\[compare slug1="[^"]+" slug2="[^"]+"\])/g);

        return parts.map((part, index) => {
            const toolMatch = part.match(/\[tool id="([^"]+)"\]/);
            const imageMatch = part.match(/\[image url="([^"]+)"(?:\s+caption="([^"]+)")?\]/);
            const compareMatch = part.match(/\[compare slug1="([^"]+)" slug2="([^"]+)"\]/);
            
            if (toolMatch) {
                const toolId = toolMatch[1];
                const toolData = post?.embeddedTools?.find(t => t.id === toolId);

                return (
                    <div key={index} className={styles.embeddedToolCard}>
                        <div className={styles.toolInner}>
                            {toolData?.image_url && (
                                <div className={styles.toolImageWrapper}>
                                    <img src={toolData.image_url} alt={toolData.name} className={styles.toolImage} />
                                </div>
                            )}
                            <div className={styles.toolInfo}>
                                <div className={styles.toolHeader}>
                                    <h4 className={styles.toolTitle}>{toolData?.name || 'Featured AI Tool'}</h4>
                                    {toolData?.rating > 0 && (
                                        <div className={styles.toolRating}>
                                            <span className={styles.ratingValue}>{toolData.rating}</span>
                                            <span className={styles.starIcon}>★</span>
                                        </div>
                                    )}
                                </div>
                                <div className={styles.toolBadges}>
                                    <span className={styles.priceBadge}>{toolData?.pricing_type || 'Free'}</span>
                                </div>
                                <p className={styles.toolMeta}>{toolData?.short_description || 'Discover more about this tool in our directory'}</p>
                            </div>
                            <div className={styles.toolActions}>
                                <Link to={`/tool/${toolData?.slug || toolId}`} className={styles.exploreBtn}>
                                    <span>Details</span>
                                    <ArrowRight size={14} />
                                </Link>
                                {toolData?.url && (
                                    <a 
                                        href={toolData.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className={styles.visitBtn}
                                    >
                                        <span>Visit Website</span>
                                        <ExternalLink size={14} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                );
            }

            if (compareMatch) {
                const slug1 = compareMatch[1];
                const slug2 = compareMatch[2];
                return (
                    <div key={index} className={styles.compareEmbedCard}>
                        <div className={styles.compareContent}>
                            <div className={styles.vsBadge}>VS</div>
                            <div className={styles.compareTools}>
                                <span className={styles.toolName}>{slug1.replace(/-/g, ' ')}</span>
                                <span className={styles.vsText}>Against</span>
                                <span className={styles.toolName}>{slug2.replace(/-/g, ' ')}</span>
                            </div>
                            <p className={styles.compareDesc}>Deep AI-Powered technical comparison and feature analysis.</p>
                            <Link to={`/compare/${slug1}-vs-${slug2}`} className={styles.compareActionBtn}>
                                <span>View Comparison</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                );
            }

            if (imageMatch) {
                const imageUrl = imageMatch[1];
                const caption = imageMatch[2];
                return (
                    <div key={index} className={styles.inlineImageWrapper}>
                        <img src={imageUrl} alt={caption || 'Article Image'} className={styles.inlineImage} />
                        {caption && <p className={styles.imageCaption}>{caption}</p>}
                    </div>
                );
            }

            return <div key={index} dangerouslySetInnerHTML={{ __html: part }} />;
        });
    };
    
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.postContainer}>
                {/* Reading Progress Bar - Rule #34: Elite UX */}
                <div className={styles.progressBar} style={{ transform: `scaleX(${scrollProgress / 100})` }} />

                {/* Reading Progress Bar - Rule #34: Elite UX */}
                <div className={styles.progressBar} style={{ transform: `scaleX(${scrollProgress / 100})` }} />

                <article ref={articleRef} className={styles.articleBody}>
                    {/* Meta Info: Category + Reading Time */}
                    <div className={styles.metaRow}>
                        <span className={styles.catTag}>{post.category || 'AI NEWS'}</span>
                        <span className={styles.readingTime}>{readingTime || 3} min read</span>
                    </div>

                    <div className={styles.proseContent}>
                        {renderContent()}
                    </div>

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
                </article>
            </div>
        </Safeguard>
    );
};

export default React.memo(BlogPostContent);




