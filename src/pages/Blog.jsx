import React from 'react';
import useSEO from '../hooks/useSEO';
import { useBlogData } from '../hooks/useBlogData';

// Import Global UI Components
import Safeguard from '../components/ui/Safeguard';
import BlogHero from '../components/Blog/BlogHero';
import BlogFilters from '../components/Blog/BlogFilters';
import BlogGrid from '../components/Blog/BlogGrid';

// Import Modular CSS
import styles from './Blog.module.css';

/**
 * Blog Page - Elite Orchestration Layer
 * Rule #16: Stable Coordinator Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Blog = () => {
    const {
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        posts,
        categories,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        error,
        refresh
    } = useBlogData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'blog' });

    return (
        <div className={styles.blogPage}>
            <BlogHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                error={error}
                onRetry={refresh}
            />

            <section className={styles.mainContent}>
                <div className="container">
                    <BlogFilters 
                        categories={categories} 
                        selectedCategory={selectedCategory} 
                        setSelectedCategory={setSelectedCategory} 
                        isLoading={loading}
                        error={error}
                        onRetry={refresh}
                    />

                    <BlogGrid 
                        posts={posts} 
                        loading={loading} 
                        loadingMore={loadingMore} 
                        hasMore={hasMore} 
                        setPage={loadMore} 
                        error={error}
                        onRetry={refresh}
                    />
                </div>
            </section>
        </div>
    );
};

export default Blog;
