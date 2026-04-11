import { useState, useEffect, useCallback } from 'react';
import { blogService } from '../services/blogService';

/**
 * Custom hook for managing blog list page logic
 */
export const useBlogData = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    const ITEMS_PER_PAGE = 6;

    // Fetch Categories once
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data: catData } = await blogService.getCategories();
                if (catData) setCategories(['All', ...catData.map(c => c.name)]);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
        
        // SEO
        document.title = "HUBly Magazine | AI & SaaS Insights";
    }, []);

    // Fetch Posts Logic
    const fetchPosts = useCallback(async (pageNum, isInitial = false) => {
        if (isInitial) setLoading(true);
        else setLoadingMore(true);

        try {
            const { data, error } = await blogService.getPosts({ 
                searchQuery, 
                selectedCategory, 
                page: pageNum, 
                itemsPerPage: ITEMS_PER_PAGE 
            });

            if (data) {
                if (pageNum === 0) setPosts(data);
                else setPosts(prev => [...prev, ...data]);

                if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                else setHasMore(true);
            }
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedCategory]);

    // Reset on search/category change
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        const timer = setTimeout(() => fetchPosts(0, true), 400); // Debounced initial fetch
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, fetchPosts]);

    // Handle Infinite Scroll / Load More
    const loadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    return {
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
    };
};
