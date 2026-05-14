import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categoriesService';
import { toolsService } from '../services/toolsService';

/**
 * 🚀 Elite Categories Data Engine (React Query Optimized)
 * Elite Standard: Logic isolation & Service-driven
 */
export const useCategoriesData = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: normalizedCategories = [], isLoading: loading, error: queryError, refetch } = useQuery({
        queryKey: ['categories', 'directory'],
        queryFn: async () => {
            const { data, counts, error: fetchError } = await categoriesService.getCategoriesWithCounts();
            if (fetchError) throw fetchError;
            
            // Rule #39: Data Normalization
            return (data || []).map(cat => ({
                ...cat,
                toolCount: counts?.[cat.id] || 0
            }));
        },
        staleTime: 1000 * 60 * 60 * 24 // 24 hours caching
    });

    const error = queryError ? (queryError.message || 'Failed to load categories') : null;

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
        refresh: refetch
    }), [
        filteredCategories, 
        normalizedCategories, 
        searchQuery, 
        loading, 
        error, 
        refetch
    ]);

    return memoizedValue;
};
