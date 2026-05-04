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
        page,
        error,
        refresh
    } = useBlogData();

    // 1. Elite Dynamic SEO Hardening (v3.0)
    useSEO({ 
        title: selectedCategory !== 'All' 
            ? `${selectedCategory} AI & SaaS Articles | Expert Insights` 
            : searchQuery 
            ? `Articles matching "${searchQuery}" | HUBly Search` 
            : 'AI & SaaS Magazine - Expert Guides, News & Insights',
        description: selectedCategory !== 'All'
            ? `Explore the latest ${selectedCategory} tutorials, guides, and expert perspectives for professionals.`
            : 'Stay updated with the world of AI and SaaS through our handpicked collection of expert articles and news.',
        noindex: !!searchQuery, // Prevent indexing search results
        prev: page > 0 ? `/blog?page=${page}` : null,
        next: hasMore ? `/blog?page=${page + 2}` : null, // +2 because sitemap/links often expect 1-based or offset
        schema: {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "HUBly Magazine",
            "url": "https://hubly-tools.com/blog",
            "description": "Premium AI & SaaS insights, news, and expert tutorials for the modern creator.",
            "publisher": {
                "@type": "Organization",
                "name": "HUBly"
            }
        }
    });

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
