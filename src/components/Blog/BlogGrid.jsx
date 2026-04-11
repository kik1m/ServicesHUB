import React from 'react';
import { BookOpen } from 'lucide-react';
import BlogCard from './BlogCard';
import BlogCardSkeleton from './BlogCardSkeleton';
import styles from './BlogGrid.module.css';

const BlogGrid = ({ 
    posts, 
    loading, 
    loadingMore, 
    hasMore, 
    setPage 
}) => {
    return (
        <div className={styles.gridContainer}>
            <div className={styles.postsGrid}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <BlogCardSkeleton key={i} />
                    ))
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className={styles.noPostsFound}>
                        <BookOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                        <h3>No articles found matching your criteria.</h3>
                    </div>
                )}
            </div>

            {hasMore && posts.length > 0 && !loading && (
                <div className={styles.loadMoreWrap}>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className={styles.loadMoreBtn}
                        disabled={loadingMore}
                    >
                        {loadingMore ? 'Loading articles...' : 'Load More Articles'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogGrid;
