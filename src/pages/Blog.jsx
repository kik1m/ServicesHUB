import React from 'react';
import { useBlogData } from '../hooks/useBlogData';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import BlogHeader from '../components/Blog/BlogHeader';
import BlogFilters from '../components/Blog/BlogFilters';
import BlogGrid from '../components/Blog/BlogGrid';

// Import Modular CSS
import styles from './Blog.module.css';

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
        loadMore
    } = useBlogData();

    return (
        <div className={styles.blogPage}>
            <SmartBanner />
            
            <BlogHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className={styles.mainContent}>
                <BlogFilters 
                    categories={categories} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                />

                <BlogGrid 
                    posts={posts} 
                    loading={loading} 
                    loadingMore={loadingMore} 
                    hasMore={hasMore} 
                    setPage={loadMore} 
                />
            </section>
        </div>
    );
};

export default Blog;
