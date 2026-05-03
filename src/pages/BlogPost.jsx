import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { useBlogPostData } from '../hooks/useBlogPostData';

// Import Global UI Components
import Safeguard from '../components/ui/Safeguard';
import BlogPostHero from '../components/Blog/BlogPostHero';
import BlogPostContent from '../components/Blog/BlogPostContent';
import BlogSidebar from '../components/Blog/BlogSidebar';

// Import Constants & Styles
import { BLOG_CONSTANTS } from '../constants/blogConstants';
import styles from './BlogPost.module.css';

/**
 * Blog Post Detail Page - Elite Orchestration Layer
 * Rule #16: Stable Coordinator Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const BlogPost = () => {
    const { post, relatedPosts, loading, error, refresh } = useBlogPostData();
    const { POST, HERO, SEO } = BLOG_CONSTANTS;

    const breadcrumbItems = useMemo(() => [
        ...HERO.BREADCRUMBS,
        { label: post?.title || '...', path: `/blog/${post?.id}` }
    ], [post, HERO.BREADCRUMBS]);

    // Rule #34/41: SEO and Article Schema Implementation
    useSEO({
        title: post?.title ? `${post.title}${SEO.POST_TITLE_SUFFIX}` : 'Article Details',
        description: post?.excerpt || post?.content?.substring(0, 160),
        image: post?.featured_image,
        schema: post ? [
            {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": post.title,
                "image": post.featured_image,
                "author": {
                    "@type": "Person",
                    "name": post.author_name || "HUBly Expert"
                },
                "datePublished": post.created_at,
                "description": post.excerpt
            },
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": breadcrumbItems.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.label,
                    "item": `https://hubly-tools.com${item.path}`
                }))
            }
        ] : null
    });



    return (
        <div className={styles.postPage}>
            {!post && !loading && !error ? (
                <div className={styles.errorWrapper}>
                    <h2>{POST.ERROR_NOT_FOUND}</h2>
                    <Link to="/blog" className={styles.backBtn}>{POST.BACK_TO_MAGAZINE}</Link>
                </div>
            ) : (
                <>
                    <BlogPostHero 
                        post={post} 
                        isLoading={loading} 
                        breadcrumbs={breadcrumbItems}
                        error={error}
                        onRetry={refresh}
                    />

                    <section className={styles.mainContent}>
                        <div className="container">
                            <div className={styles.layoutGrid}>
                                <BlogPostContent 
                                    post={post} 
                                    isLoading={loading} 
                                    error={error}
                                    onRetry={refresh}
                                />
                                <BlogSidebar 
                                    relatedPosts={relatedPosts} 
                                    isLoading={loading} 
                                    error={error}
                                    onRetry={refresh}
                                />
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default BlogPost;
