import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// Import Global Components
import SmartBanner from '../components/SmartBanner';

// Import Modular Components
import BlogHeader from '../components/Blog/BlogHeader';
import BlogFilters from '../components/Blog/BlogFilters';
import BlogGrid from '../components/Blog/BlogGrid';

// Import Modular CSS
import '../styles/Pages/Blog.css';

const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: catData } = await supabase.from('blog_categories').select('name');
            if (catData) setCategories(['All', ...catData.map(c => c.name)]);

            // SEO
            document.title = "HUBly Magazine | AI & SaaS Insights";
        };
        fetchInitialData();
    }, []);

    // Reset on filter change
    useEffect(() => {
        setPage(0);
        setPosts([]);
        setHasMore(true);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        let mounted = true;

        const fetchPosts = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);

            try {
                let query = supabase.from('blog_posts')
                    .select('id, title, excerpt, image_url, category, author_name, created_at');

                if (searchQuery) {
                    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
                }

                if (selectedCategory !== 'All') {
                    query = query.eq('category', selectedCategory);
                }

                const from = page * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                const { data, error } = await query
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) throw error;

                if (data && mounted) {
                    if (page === 0) setPosts(data);
                    else setPosts(prev => [...prev, ...data]);

                    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                }
            } catch (err) {
                console.error('Fetch posts error:', err);
            } finally {
                if (mounted) {
                    setLoading(false);
                    setLoadingMore(false);
                }
            }
        };

        const timer = setTimeout(fetchPosts, page === 0 ? 400 : 0);
        return () => {
            mounted = false;
            clearTimeout(timer);
        };
    }, [searchQuery, selectedCategory, page]);

    return (
        <div className="page-wrapper blog-page">
            <SmartBanner />
            
            <BlogHeader 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className="main-section content-layout">
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
                    setPage={setPage} 
                />
            </section>
        </div>
    );
};

export default Blog;
