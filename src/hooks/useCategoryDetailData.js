import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categoriesService';
import { toolsService } from '../services/toolsService';

/**
 * 🚀 Elite Category Detail Engine (React Query Optimized)
 * Rule #1: Logic Isolation
 */
export const useCategoryDetailData = (slug) => {
    const { 
        data: category = null, 
        isLoading: isCategoryLoading, 
        error: queryError, 
        refetch: refetchCategory 
    } = useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            const { data, error } = await categoriesService.getCategoryBySlug(slug);
            if (error) throw error;
            return data;
        },
        enabled: !!slug,
        staleTime: 1000 * 60 * 60 * 24 // 24 hours
    });

    const categoryError = queryError ? (queryError.message || 'Failed to load category information') : null;

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
        refetchCategory,
        trackClick
    };
};
