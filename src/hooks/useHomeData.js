import { useQuery } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { toolsService } from '../services/toolsService';
import { logEvent } from '../services/analyticsService';

/**
 * 🚀 Elite Home Data Hook (React Query Optimized)
 * Implements Rule #14: Efficient Data Fetching & Caching
 * Implements Rule #18: Isolated Loading & Error States
 */
export const useHomeData = (initial = {}) => {
    
    // 2. Atomic Data Queries with Initial Data Support
    const categoriesQuery = useQuery({
        ...queryOptions.home.categories(),
        initialData: initial.initialCategories,
        initialDataUpdatedAt: initial.initialCategories ? Date.now() : undefined,
    });

    const featuredQuery = useQuery({
        ...queryOptions.home.featured(),
        initialData: initial.initialFeatured,
        initialDataUpdatedAt: initial.initialFeatured ? Date.now() : undefined,
    });

    const latestQuery = useQuery({
        ...queryOptions.home.latest(),
        initialData: initial.initialLatest,
        initialDataUpdatedAt: initial.initialLatest ? Date.now() : undefined,
    });

    const trendingQuery = useQuery({
        ...queryOptions.home.trending(),
        initialData: initial.initialTrending,
        initialDataUpdatedAt: initial.initialTrending ? Date.now() : undefined,
    });

    const postsQuery = useQuery({
        ...queryOptions.home.posts(),
        initialData: initial.initialPosts,
        initialDataUpdatedAt: initial.initialPosts ? Date.now() : undefined,
    });

    const comparisonsQuery = useQuery({
        ...queryOptions.home.comparisons(),
        initialData: initial.initialComparisons,
        initialDataUpdatedAt: initial.initialComparisons ? Date.now() : undefined,
    });

    const statsQuery = useQuery({
        ...queryOptions.home.stats(),
        initialData: initial.initialStats,
        initialDataUpdatedAt: initial.initialStats ? Date.now() : undefined,
    });

    // 3. Track Click Method (Remains similar)
    const trackClick = async (id, currentClicks, toolName) => {
        if (!id) return;
        try {
            await toolsService.incrementClickCount(id, currentClicks);
            logEvent('external_link_click', 'outbound', toolName || id);
        } catch (err) {
            console.error('Failed to track click:', err);
        }
    };

    // 4. Return unified state object (Matching HomeClient expectations)
    return {
        categories: categoriesQuery.data || [],
        featuredTools: featuredQuery.data || [],
        latestTools: latestQuery.data || [],
        trendingTools: trendingQuery.data || [],
        blogPosts: postsQuery.data || [],
        comparisons: comparisonsQuery.data || [],
        stats: statsQuery.data || { tools: 0, users: 0, views: 0 },
        loading: categoriesQuery.isLoading || featuredQuery.isLoading || latestQuery.isLoading,
        trackClick
    };
};
