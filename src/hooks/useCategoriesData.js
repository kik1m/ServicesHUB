import { useState, useEffect, useCallback, useMemo } from 'react';
import { categoriesService } from '../services/categoriesService';
import { toolsService } from '../services/toolsService';

/**
 * Custom hook for managing Categories Directory page data and tool counts
 * Elite Standard: Logic isolation & Service-driven
 */
export const useCategoriesData = () => {
    const [categories, setCategories] = useState([]);
    const [counts, setCounts] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data, counts: toolCounts, error: fetchError } = await categoriesService.getCategoriesWithCounts();
            if (fetchError) throw fetchError;
            
            setCategories(data || []);
            setCounts(toolCounts || {});
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError(err.message || 'Failed to load categories');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Rule #39: Data Normalization
    const normalizedCategories = useMemo(() => {
        return categories.map(cat => ({
            ...cat,
            toolCount: counts[cat.id] || 0
        }));
    }, [categories, counts]);

    // Local filtering logic (Rule #35: Derived Data Stability)
    const filteredCategories = useMemo(() => {
        if (!searchQuery) return normalizedCategories;
        const query = searchQuery.toLowerCase();
        return normalizedCategories.filter(cat => 
            cat.name.toLowerCase().includes(query)
        );
    }, [normalizedCategories, searchQuery]);

    const trackClick = async (id, currentClicks) => {
        if (!id) return;
        try {
            await toolsService.incrementClickCount(id, currentClicks);
        } catch (err) {
            console.error('Failed to track click:', err);
        }
    };

    // Rule #35: Derived Data Stability
    const memoizedValue = useMemo(() => ({
        categories: filteredCategories,
        allCategories: normalizedCategories,
        searchQuery,
        setSearchQuery,
        loading,
        error,
        trackClick,
        refresh: fetchCategories
    }), [
        filteredCategories, 
        normalizedCategories, 
        searchQuery, 
        loading, 
        error, 
        fetchCategories
    ]);

    return memoizedValue;
};
