'use client';

import React from 'react';
import { useBlogData } from '../../hooks/useBlogData';

// Import Global UI Components
import BlogHero from '../../components/Blog/BlogHero';
import BlogFilters from '../../components/Blog/BlogFilters';
import BlogGrid from '../../components/Blog/BlogGrid';

// Import Modular CSS
import styles from './Blog.module.css';

/**
 * BlogClient - Next.js Interactive Layer
 */
export default function BlogClient({ initialPosts, initialCategories }) {
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
        refresh
    } = useBlogData({ initialPosts, initialCategories });

    return (
        <div className={styles.blogPage}>
            <BlogHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className={styles.mainContent}>
                <div className="container">
                    <BlogFilters 
                        categories={categories} 
                        selectedCategory={selectedCategory} 
                        setSelectedCategory={setSelectedCategory} 
                        isLoading={loading}
                    />

                    <BlogGrid 
                        posts={posts} 
                        loading={loading} 
                        loadingMore={loadingMore} 
                        hasMore={hasMore} 
                        setPage={loadMore} 
                    />
                </div>
            </section>
        </div>
    );
}
