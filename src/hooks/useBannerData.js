import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';

const BANNER_INTERVAL = 8000;
const MAX_BANNER_ITEMS = 20; // Increased for promotional scalability

/**
 * Custom Hook: useBannerData
 */
export const useBannerData = (initialTools = []) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: tools = initialTools, isLoading: loading, error: queryError } = useQuery({
        ...queryOptions.bannerTools(MAX_BANNER_ITEMS),
        initialData: initialTools.length > 0 ? initialTools : undefined,
        initialDataUpdatedAt: initialTools.length > 0 ? Date.now() : undefined,
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
