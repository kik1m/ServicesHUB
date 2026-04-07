import React from 'react';
import { BookOpen } from 'lucide-react';
import BlogCard from './BlogCard';
import SkeletonLoader from '../SkeletonLoader';

const BlogGrid = ({ 
    posts, 
    loading, 
    loadingMore, 
    hasMore, 
    setPage 
}) => {
    return (
        <div className="blog-posts-container">
            <div className="blog-posts-grid">
                {loading ? (
                    [1, 2, 3, 4, 5, 6].map(i => (
                        <SkeletonLoader key={i} type="card" height="450px" />
                    ))
                ) : posts.length > 0 ? (
                    posts.map(post => (
                        <BlogCard key={post.id} post={post} />
                    ))
                ) : (
                    <div className="no-posts-found">
                        <BookOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                        <h3>No articles found matching your criteria.</h3>
                    </div>
                )}
            </div>

            {hasMore && posts.length > 0 && !loading && (
                <div className="load-more-wrap">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="btn-primary"
                        disabled={loadingMore}
                        style={{ padding: '1rem 3rem' }}
                    >
                        {loadingMore ? 'Loading articles...' : 'Load More Articles'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogGrid;
