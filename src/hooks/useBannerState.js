import { useState, useEffect, useCallback } from 'react';

const BANNER_INTERVAL = 8000;

/**
 * Custom Hook: useBannerState
 * Client-side state manager for the SmartBanner in Next.js
 * Rule #1: Logic Isolation
 */
export const useBannerState = (tools = [], isLoading = false) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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
        if (tools.length <= 1 || isLoading) return;
        
        const interval = setInterval(next, BANNER_INTERVAL);
        return () => clearInterval(interval);
    }, [tools.length, isLoading, next]);

    return {
        currentIndex,
        next,
        prev
    };
};
