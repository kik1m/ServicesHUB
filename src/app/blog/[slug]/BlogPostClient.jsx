'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useBlogPostData } from '../../../hooks/useBlogPostData';

// Import Global UI Components
import BlogPostHero from '../../../components/Blog/BlogPostHero';
import BlogPostContent from '../../../components/Blog/BlogPostContent';
import BlogSidebar from '../../../components/Blog/BlogSidebar';
import Safeguard from '../../../components/ui/Safeguard';

// Import Constants & Styles
import { BLOG_CONSTANTS } from '../../../constants/blogConstants';
import styles from './BlogPost.module.css';

/**
 * BlogPostClient - Next.js Interactive Layer
 */
export default function BlogPostClient({ id, initialPost, initialRelatedPosts }) {
    const { post, relatedPosts, loading, error, readingTime } = useBlogPostData({ 
        id, 
        initialPost, 
        initialRelatedPosts 
    });

    const { POST, HERO } = BLOG_CONSTANTS;

    const breadcrumbItems = useMemo(() => [
        ...HERO.BREADCRUMBS,
        { label: post?.title || '...', path: `/blog/${post?.slug || post?.id}` }
    ], [post, HERO.BREADCRUMBS]);

    const isNotFound = !loading && !post && !error;

    return (
        <div className={styles.postPage}>
            <Safeguard error={error} fullPage title="Article Unavailable">
                {isNotFound ? (
                    <div className={styles.errorWrapper}>
                        <h2>{POST.ERROR_NOT_FOUND}</h2>
                        <Link href="/blog" className={styles.backBtn}>{POST.BACK_TO_MAGAZINE}</Link>
                    </div>
                ) : (
                    <>
                        <BlogPostHero 
                            post={post} 
                            isLoading={loading && !post} 
                            breadcrumbs={breadcrumbItems}
                        />

                        <section className={styles.mainContent}>
                            <div className="container">
                                <div className={styles.layoutGrid}>
                                    <BlogPostContent 
                                        post={post} 
                                        isLoading={loading && !post} 
                                    />
                                    <BlogSidebar 
                                        relatedPosts={relatedPosts} 
                                        isLoading={loading && relatedPosts.length === 0} 
                                    />
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </Safeguard>
        </div>
    );
}
