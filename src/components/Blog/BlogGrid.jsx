import React from 'react';
import { BookOpen } from 'lucide-react';
import BlogCard from './BlogCard';
import Button from '../ui/Button';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogGrid.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogGrid - Container for the blog post list
 * Rule #12: Pure UI Orchestration
 */
const BlogGrid = ({ posts, loading, loadingMore, hasMore, setPage, error, onRetry }) => {
    const { GRID, SKELETONS } = BLOG_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry} title={GRID?.LOAD_MORE}>
            <div className={styles.gridContainer}>
                <div className={styles.postsGrid}>
                    {loading ? (
                        // Initial load skeletons - Rule #30
                        SKELETONS?.GRID_INITIAL?.map(i => (
                            <BlogCard key={`skeleton-${i}`} isLoading={true} />
                        ))
                    ) : posts?.length > 0 ? (
                        <>
                            {posts?.map(post => (
                                <BlogCard key={post?.id} post={post} />
                            ))}
                            
                            {loadingMore && (
                                // Pagination skeletons
                                SKELETONS?.GRID_MORE?.map(i => (
                                    <BlogCard key={`more-skeleton-${i}`} isLoading={true} />
                                ))
                            )}
                        </>
                    ) : (
                        <div className={styles.noPostsFound}>
                            <BookOpen size={64} className={styles.noPostsIcon} />
                            <h3>{GRID?.NO_POSTS_FOUND}</h3>
                        </div>
                    )}
                </div>

                {hasMore && posts?.length > 0 && !loading && (
                    <div className={styles.loadMoreWrap}>
                        <Button
                            variant="outline"
                            onClick={setPage}
                            isLoading={loadingMore}
                            className={styles.loadMoreBtn}
                        >
                            {GRID?.LOAD_MORE}
                        </Button>
                    </div>
                )}
            </div>
        </Safeguard>
    );
};

export default React.memo(BlogGrid);




