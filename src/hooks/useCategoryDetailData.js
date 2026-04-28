import { useState, useEffect, useCallback } from 'react';
import { categoriesService } from '../services/categoriesService';
import { toolsService } from '../services/toolsService';

/**
 * useCategoryDetailData - Metadata Focus
 * Rule #1: Logic Isolation
 */
export const useCategoryDetailData = (slug) => {
    const [isCategoryLoading, setIsCategoryLoading] = useState(true);
    const [categoryError, setCategoryError] = useState(null);
    const [category, setCategory] = useState(null);

    const fetchCategory = useCallback(async () => {
        if (!slug) return;
        setIsCategoryLoading(true);
        setCategoryError(null);
        try {
            const { data, error } = await categoriesService.getCategoryBySlug(slug);
            if (error) throw error;
            setCategory(data);
        } catch (err) {
            console.error('Category Sync Error:', err);
            setCategoryError(err.message || 'Failed to load category information');
        } finally {
            setIsCategoryLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchCategory();
    }, [slug, fetchCategory]);

    const trackClick = async (id, currentClicks) => {
        if (!id) return;
        try {
            await toolsService.incrementClickCount(id, currentClicks);
        } catch (err) {
            console.error('Failed to track click:', err);
        }
    };

    return {
        category,
        isCategoryLoading,
        categoryError,
        refetchCategory: fetchCategory,
        trackClick
    };
};
