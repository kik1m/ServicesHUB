import React from 'react';
import { Link } from 'react-router-dom';
import { useBlogPostData } from '../hooks/useBlogPostData';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular Components
import BlogPostHeader from '../components/Blog/BlogPostHeader';
import BlogPostContent from '../components/Blog/BlogPostContent';
import BlogSidebar from '../components/Blog/BlogSidebar';

// Import Modular CSS
import styles from './BlogPost.module.css';

const BlogPost = () => {
    const { post, relatedPosts, loading, error } = useBlogPostData();

    if (loading) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.skeletonHeader}>
                    <SkeletonLoader type="text" width="100px" />
                    <SkeletonLoader type="title" width="80%" />
                    <SkeletonLoader type="text" width="200px" style={{ marginTop: '2rem' }} />
                </div>
                <div style={{ height: '500px' }}></div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.errorWrapper}>
                <h2>{error || 'Article not found'}</h2>
                <Link to="/blog" className={styles.backBtn}>Back to Blog Magazine</Link>
            </div>
        );
    }

    return (
        <div className={styles.postPage}>
            <BlogPostHeader post={post} />

            <section className={styles.mainContent}>
                <BlogPostContent post={post} />
                <BlogSidebar relatedPosts={relatedPosts} />
            </section>
        </div>
    );
};

export default BlogPost;
