import { useState, useEffect, useCallback } from 'react';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';

/**
 * Custom hook for managing search page data, filtering, and pagination
 */
export const useSearchData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPrice, setSelectedPrice] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [results, setResults] = useState([]);
    const [categories, setCategories] = useState([{ id: 'All', name: 'All' }]);

    const ITEMS_PER_PAGE = 12;
    const pricingModels = ['All', 'Free', 'Freemium', 'Paid', 'Contact'];

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await categoriesService.getAllCategories();
            if (data) {
                setCategories([{ id: 'All', name: 'All' }, ...data]);
            }
        };
        fetchCategories();
    }, []);

    // Reset results when filters change
    useEffect(() => {
        setPage(0);
        setResults([]);
        setHasMore(true);
    }, [searchQuery, selectedCategory, selectedPrice, sortBy]);

    // Fetch tools based on current state
    const fetchTools = useCallback(async () => {
        if (page === 0) setIsLoading(true);
        else setLoadingMore(true);

        try {
            // Find category name if we have an ID
            let categoryName = 'All';
            if (selectedCategory !== 'All') {
                const cat = categories.find(c => c.id === selectedCategory);
                categoryName = cat ? cat.name : 'All';
            }

            const { data, error } = await toolsService.getToolsPaginated({
                page,
                itemsPerPage: ITEMS_PER_PAGE,
                searchQuery,
                categoryName,
                priceFilter: selectedPrice,
                sortBy,
                categories
            });

            if (error) throw error;

            if (data) {
                if (page === 0) setResults(data);
                else setResults(prev => [...prev, ...data]);

                if (data.length < ITEMS_PER_PAGE) setHasMore(false);
            }
        } catch (err) {
            console.error('Search Error:', err);
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }, [searchQuery, selectedCategory, selectedPrice, sortBy, page, categories]);

    useEffect(() => {
        const timer = setTimeout(fetchTools, page === 0 ? 500 : 0);
        return () => clearTimeout(timer);
    }, [fetchTools, page]);

    return {
        isLoading,
        loadingMore,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedPrice,
        setSelectedPrice,
        sortBy,
        setSortBy,
        page,
        setPage,
        hasMore,
        results,
        categories,
        pricingModels
    };
};
