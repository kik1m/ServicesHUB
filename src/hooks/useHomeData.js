import { useState, useEffect } from 'react';
import { toolsService } from '../services/toolsService';
import { categoriesService } from '../services/categoriesService';
import { blogService } from '../services/blogService';
import { profilesService } from '../services/profilesService';
import { logEvent } from '../services/analyticsService';

/**
 * Custom hook to manage all data fetching logic for the Home page
 * Implements Rule #18 (Error Isolation) by allowing individual sections to fail
 */
export const useHomeData = () => {
    // Categories State
    const [categories, setCategories] = useState({ data: [], loading: true, error: null });
    // Featured Tools State
    const [featured, setFeatured] = useState({ data: [], loading: true, error: null });
    // Latest Tools State
    const [latest, setLatest] = useState({ data: [], loading: true, error: null });
    // Trending Tools State
    const [trending, setTrending] = useState({ data: [], loading: true, error: null });
    // Blog Posts State
    const [posts, setPosts] = useState({ data: [], loading: true, error: null });
    // Stats State
    const [stats, setStats] = useState({ data: { tools: 0, users: 0, views: 0 }, loading: true, error: null });

    useEffect(() => {
        let mounted = true;

        const fetchData = async (serviceMethod, setState, dataKey = 'data') => {
            try {
                const res = await serviceMethod();
                if (!mounted) return;
                
                if (res.error) {
                    setState(prev => ({ ...prev, loading: false, error: res.error }));
                } else {
                    setState({ data: res[dataKey] || res.data || [], loading: false, error: null });
                }
            } catch (err) {
                console.error("Home Section Fetch Error:", err);
                if (mounted) {
                    setState(prev => ({ ...prev, loading: false, error: "Load failed" }));
                }
            }
        };

        // Fetch each section independently
        fetchData(() => categoriesService.getHomeCategories(), setCategories);
        fetchData(() => toolsService.getFeaturedTools(), setFeatured);
        fetchData(() => toolsService.getLatestTools(), setLatest);
        fetchData(() => toolsService.getTrendingTools(), setTrending);
        fetchData(() => blogService.getLatestPosts(), setPosts);
        
        // Stats combined
        (async () => {
            try {
                const [toolsRes, usersRes] = await Promise.all([
                    toolsService.getToolsStats(),
                    profilesService.getUsersCount()
                ]);
                if (!mounted) return;
                setStats({
                    data: {
                        tools: toolsRes.count || 0,
                        views: toolsRes.views || 0,
                        clicks: toolsRes.clicks || 0,
                        users: usersRes.count || 0
                    },
                    loading: false,
                    error: toolsRes.error || usersRes.error
                });
            } catch (err) {
                if (mounted) setStats(prev => ({ ...prev, loading: false, error: "Stats error" }));
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const trackClick = async (id, currentClicks, toolName) => {
        if (!id) return;
        try {
            // Track in DB
            await toolsService.incrementClickCount(id, currentClicks);
            // Track in GA4 (Elite Intelligence)
            logEvent('external_link_click', 'outbound', toolName || id);
        } catch (err) {
            console.error('Failed to track click:', err);
        }
    };

    return {
        categories,
        featured,
        latest,
        trending,
        posts,
        stats,
        trackClick
    };
};

