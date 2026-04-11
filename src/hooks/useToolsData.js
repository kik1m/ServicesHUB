import { useState, useEffect } from 'react';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';

/**
 * Custom hook for managing Tools directory data and filters
 */
export const useToolsData = () => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Filters
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [searchQuery, setSearchQuery] = useState('');
    
    // UI States
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);
    const ITEMS_PER_PAGE = 12;

    // 1. Fetch Categories once on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await categoriesService.getAllCategories();
                setCategories(data || []);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // 2. Reset page when filters or search change
    useEffect(() => {
        setPage(0);
        setTools([]);
        setHasMore(true);
    }, [selectedCategory, priceFilter, sortBy, searchQuery]);

    // 3. Fetch Tools when filters, search, or page change
    useEffect(() => {
        const fetchTools = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);
            setError(null);

            try {
                const query = await toolsService.getToolsPaginated({
                    page,
                    itemsPerPage: ITEMS_PER_PAGE,
                    searchQuery,
                    categoryName: selectedCategory,
                    priceFilter,
                    sortBy,
                    categories
                });

                const { data, count, error: fetchErr } = await query;
                if (fetchErr) throw fetchErr;

                if (page === 0) {
                    setTools(data || []);
                } else {
                    setTools(prev => [...prev, ...(data || [])]);
                }

                if (data && data.length < ITEMS_PER_PAGE) setHasMore(false);
                if (count !== null) setTotalResults(count);
            } catch (err) {
                console.error('Error fetching tools:', err);
                setError("Unable to fetch tools. Please check your connection.");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        // Note: categories must be loaded before fetching tools filtered by category name
        if (categories.length > 0 || selectedCategory === 'All') {
            fetchTools();
        }
    }, [selectedCategory, priceFilter, sortBy, searchQuery, page, categories]);

    return {
        tools,
        categories,
        selectedCategory,
        setSelectedCategory,
        priceFilter,
        setPriceFilter,
        sortBy,
        setSortBy,
        searchQuery,
        setSearchQuery,
        loading,
        loadingMore,
        error,
        setPage,
        hasMore,
        totalResults
    };
};
