import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { toolsService } from '../services/toolsService';
import { favoritesService } from '../services/favoritesService';

/**
 * Custom hook to manage all data fetching and interaction logic for the User Dashboard
 */
export const useDashboardData = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    
    // Independent Section States (Rule #11.1)
    const [tools, setTools] = useState({ data: [], loading: true, error: null });
    const [favorites, setFavorites] = useState({ data: [], loading: true, error: null });

    // Rule #32: Defensive Data Layer & Pre-computation (Rule #408)
    const safeUserTools = useMemo(() => {
        return (tools.data || []).filter(Boolean).map(tool => {
            const featuredUntil = tool.featured_until ? new Date(tool.featured_until) : null;
            const daysLeft = featuredUntil 
                ? Math.max(0, Math.ceil((featuredUntil - new Date()) / (1000 * 60 * 60 * 24)))
                : 0;
            const formattedDate = new Date(tool.created_at).toLocaleDateString();
            
            return {
                ...tool,
                display_days_left: daysLeft,
                display_date: formattedDate
            };
        });
    }, [tools.data]);

    const safeFavorites = useMemo(() => (favorites.data || []).filter(Boolean), [favorites.data]);

    // Rule #35: Derived Data Stability - Pre-compute stats
    const stats = useMemo(() => {
        const totalViews = safeUserTools.reduce((sum, tool) => sum + (tool.view_count || 0), 0);
        const totalClicks = safeUserTools.reduce((sum, tool) => sum + (tool.click_count || 0), 0);
        return {
            totalViews,
            totalClicks,
            totalSubmissions: safeUserTools.length,
            totalFavorites: safeFavorites.length
        };
    }, [safeUserTools, safeFavorites]);

    // Rule #409: Pre-compute Chart Data (Logic Isolation)
    const chartData = useMemo(() => {
        if (safeUserTools.length === 0) return [];
        
        const sorted = [...safeUserTools]
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
            
        // Calculate max views based on the top performer for accurate scaling
        const maxViews = Math.max(...sorted.map(t => t.view_count || 0), 1);
        
        return sorted.map(tool => ({
            ...tool,
            viewsPercent: Math.max(((tool.view_count || 0) / maxViews) * 100, 2),
            clicksPercent: Math.max(((tool.click_count || 0) / maxViews) * 100, 2)
        }));
    }, [safeUserTools]);

    const isCreator = useMemo(() => safeUserTools.length > 0, [safeUserTools]);

    // Independent fetchers (Rule #293)
    const fetchTools = useCallback(async () => {
        if (!user?.id) return;
        setTools(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await toolsService.getUserTools(user.id);
            setTools({ data: res.data || [], loading: false, error: res.error });
        } catch (err) {
            setTools(prev => ({ ...prev, loading: false, error: "Failed to load tools" }));
        }
    }, [user?.id]);

    const fetchFavorites = useCallback(async () => {
        if (!user?.id) return;
        setFavorites(prev => ({ ...prev, loading: true, error: null }));
        try {
            const res = await favoritesService.getUserFavorites(user.id);
            setFavorites({ data: res.data || [], loading: false, error: res.error });
        } catch (err) {
            setFavorites(prev => ({ ...prev, loading: false, error: "Failed to load favorites" }));
        }
    }, [user?.id]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchTools();
            fetchFavorites();
        } else if (!authLoading && !user) {
            setTools(prev => ({ ...prev, loading: false }));
            setFavorites(prev => ({ ...prev, loading: false }));
        }
    }, [user, authLoading, fetchTools, fetchFavorites]);

    const handleDeleteTool = async (id, name, confirmMessage) => {
        const message = confirmMessage 
            ? confirmMessage.replace('{name}', name) 
            : `Are you sure you want to delete "${name}"?`;

        if (!window.confirm(message)) return false;

        try {
            const { error: deleteError } = await toolsService.deleteTool(id);
            if (deleteError) throw deleteError;
            
            setTools(prev => ({ ...prev, data: prev.data.filter(t => t.id !== id) }));
            showToast('Tool deleted successfully.', 'success');
            return true;
        } catch (err) {
            showToast('Error deleting tool: ' + err.message, 'error');
            return false;
        }
    };

    return {
        userTools: safeUserTools,
        favorites: safeFavorites,
        chartData,
        stats,
        isCreator,
        isPremium: user?.is_premium || false,
        user,
        isLoading: tools.loading || favorites.loading || authLoading,
        toolsLoading: tools.loading,
        favoritesLoading: favorites.loading,
        toolsError: tools.error,
        favoritesError: favorites.error,
        handleDeleteTool,
        refreshData: () => { fetchTools(); fetchFavorites(); }
    };
};

