import { useState, useEffect, useCallback } from 'react';
import { toolsService } from '../services/toolsService';

const BANNER_INTERVAL = 8000;
const MAX_BANNER_ITEMS = 20; // Increased for promotional scalability

/**
 * Custom Hook: useBannerData
 */
export const useBannerData = () => {
    const [tools, setTools] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTools = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error: fetchError } = await toolsService.getBannerTools(MAX_BANNER_ITEMS);
            if (fetchError) throw fetchError;
            
            // Rule #12: Shuffle tools to give everyone a chance at the first spot
            const shuffled = (data || []).sort(() => Math.random() - 0.5);
            setTools(shuffled);
        } catch (err) {
            console.error('Banner Fetch Error:', err);
            setError('Failed to load featured tools');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTools();
    }, [fetchTools]);

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
