import { useState, useEffect } from 'react';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { userService } from '../services/userService';

/**
 * Custom hook to manage all data fetching logic for the Home page
 */
export const useHomeData = () => {
    const [categories, setCategories] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [latestTools, setLatestTools] = useState([]);
    const [trendingTools, setTrendingTools] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [statsCount, setStatsCount] = useState({ tools: 0, users: 0, views: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const fetchAllData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetch everything in parallel for maximum performance
                const [
                    catRes,
                    featuredRes,
                    latestRes,
                    trendingRes,
                    blogRes,
                    toolsStats,
                    usersCountRes
                ] = await Promise.all([
                    categoriesService.getHomeCategories(),
                    toolsService.getFeaturedTools(),
                    toolsService.getLatestTools(),
                    toolsService.getTrendingTools(),
                    blogService.getLatestPosts(),
                    toolsService.getToolsStats(),
                    userService.getUsersCount()
                ]);

                if (!mounted) return;

                // Set states with data or empty arrays if failed
                setCategories(catRes.data || []);
                setFeaturedTools(featuredRes.data || []);
                setLatestTools(latestRes.data || []);
                setTrendingTools(trendingRes.data || []);
                setLatestPosts(blogRes.data || []);
                
                setStatsCount({
                    tools: toolsStats.count || 0,
                    views: toolsStats.views || 0,
                    users: usersCountRes.count || 0
                });

                // Check for major errors
                if (catRes.error || featuredRes.error || toolsStats.error) {
                    console.warn("Home Data: Some fetches failed partially");
                }

            } catch (err) {
                console.error("Home Data Critical Error:", err);
                if (mounted) setError("Failed to load some content. Please try again.");
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchAllData();

        return () => {
            mounted = false;
        };
    }, []);

    return {
        categories,
        featuredTools,
        latestTools,
        trendingTools,
        latestPosts,
        statsCount,
        loading,
        error
    };
};
