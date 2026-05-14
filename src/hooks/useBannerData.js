import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toolsService } from '../services/toolsService';

const BANNER_INTERVAL = 8000;
const MAX_BANNER_ITEMS = 20; // Increased for promotional scalability

/**
 * Custom Hook: useBannerData
 */
export const useBannerData = (initialTools = []) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: tools = initialTools, isLoading: loading, error: queryError } = useQuery({
        queryKey: ['banner', 'tools'],
        queryFn: async () => {
            const { data, error: fetchError } = await toolsService.getBannerTools(MAX_BANNER_ITEMS);
            if (fetchError) throw fetchError;
            
            // Rule #12: Shuffle tools to give everyone a chance at the first spot
            return (data || []).sort(() => Math.random() - 0.5);
        },
        initialData: initialTools.length > 0 ? initialTools : undefined,
        staleTime: 1000 * 60 * 10,
    });

    const error = queryError ? 'Failed to load featured tools' : null;

    const next = useCallback(() => {
        if (tools.length <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % tools.length);
    }, [tools.length]);

    const prev = useCallback(() => {
        if (tools.length <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + tools.length) % tools.length);
    }, [tools.length]);

    // Auto-scroll logic
    useEffect(() => {
        if (tools.length <= 1 || loading) return;
        
        const interval = setInterval(next, BANNER_INTERVAL);
        return () => clearInterval(interval);
    }, [tools.length, loading, next]);

    return {
        tools,
        currentIndex,
        setCurrentIndex,
        loading,
        error,
        next,
        prev
    };
};
