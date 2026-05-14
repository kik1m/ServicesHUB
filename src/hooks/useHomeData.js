import { useQuery } from '@tanstack/react-query';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { profilesService } from '../services/profilesService';
import { compareService } from '../services/compareService';
import { logEvent } from '../services/analyticsService';

/**
 * 🚀 Elite Home Data Hook (React Query Optimized)
 * Implements Rule #14: Efficient Data Fetching & Caching
 * Implements Rule #18: Isolated Loading & Error States
 */
export const useHomeData = () => {
    
    // 1. Helper to format query results into the original structure (Backward Compatibility)
    const formatQuery = (query, dataKey = 'data') => ({
        data: query.data || [],
        loading: query.isLoading,
        error: query.error ? "Load failed" : null
    });

    // 2. Atomic Data Queries
    const categoriesQuery = useQuery({
        queryKey: ['home', 'categories'],
        queryFn: async () => {
            const res = await categoriesService.getHomeCategories();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const featuredQuery = useQuery({
        queryKey: ['home', 'featured'],
        queryFn: async () => {
            const res = await toolsService.getFeaturedTools();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const latestQuery = useQuery({
        queryKey: ['home', 'latest'],
        queryFn: async () => {
            const res = await toolsService.getLatestTools();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const trendingQuery = useQuery({
        queryKey: ['home', 'trending'],
        queryFn: async () => {
            const res = await toolsService.getTrendingTools();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const postsQuery = useQuery({
        queryKey: ['home', 'posts'],
        queryFn: async () => {
            const res = await blogService.getLatestPosts();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const comparisonsQuery = useQuery({
        queryKey: ['home', 'comparisons'],
        queryFn: async () => {
            const res = await compareService.getRecentComparisons();
            if (res.error) throw res.error;
            return res.data || [];
        }
    });

    const statsQuery = useQuery({
        queryKey: ['home', 'stats'],
        queryFn: async () => {
            const [toolsRes, usersRes] = await Promise.all([
                toolsService.getToolsStats(),
                profilesService.getUsersCount()
            ]);
            if (toolsRes.error || usersRes.error) throw new Error("Stats error");
            return {
                tools: toolsRes.count || 0,
                views: toolsRes.views || 0,
                clicks: toolsRes.clicks || 0,
                users: usersRes.count || 0
            };
        }
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

    // 4. Return unified state object
    return {
        categories: formatQuery(categoriesQuery),
        featured: formatQuery(featuredQuery),
        latest: formatQuery(latestQuery),
        trending: formatQuery(trendingQuery),
        posts: formatQuery(postsQuery),
        comparisons: formatQuery(comparisonsQuery),
        stats: {
            data: statsQuery.data || { tools: 0, users: 0, views: 0 },
            loading: statsQuery.isLoading,
            error: statsQuery.error ? "Stats error" : null
        },
        trackClick
    };
};
