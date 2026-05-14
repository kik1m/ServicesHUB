import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { toolsService } from '../services/toolsService';
import { favoritesService } from '../services/favoritesService';

/**
 * 🚀 Elite Dashboard Engine (React Query Optimized)
 * Ported to Next.js with Hydration Safeguards
 */
export const useDashboardData = () => {
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    
    // 1. React Query: User Tools
    const { 
        data: toolsData = [], 
        isLoading: toolsLoading, 
        error: toolsQueryError,
        refetch: refetchTools
    } = useQuery({
        queryKey: ['dashboard_tools', user?.id],
        queryFn: async () => {
            const res = await toolsService.getUserTools(user.id);
            if (res.error) throw new Error(res.error);
            return res.data || [];
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5 // 5 minutes caching
    });

    const toolsError = toolsQueryError ? toolsQueryError.message : null;

    // 2. React Query: Favorites
    const { 
        data: favoritesData = [], 
        isLoading: favoritesLoading, 
        error: favsQueryError,
        refetch: refetchFavorites
    } = useQuery({
        queryKey: ['dashboard_favorites', user?.id],
        queryFn: async () => {
            const res = await favoritesService.getUserFavorites(user.id);
            if (res.error) throw new Error(res.error);
            return res.data || [];
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5
    });

    const favoritesError = favsQueryError ? favsQueryError.message : null;

    // Pre-computation logic (Same as Vite)
    const safeUserTools = useMemo(() => {
        return toolsData.filter(Boolean).map(tool => {
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
    }, [toolsData]);

    const safeFavorites = useMemo(() => favoritesData.filter(Boolean), [favoritesData]);

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

    const chartData = useMemo(() => {
        if (safeUserTools.length === 0) return [];
        
        const sorted = [...safeUserTools]
            .sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
            
        const maxViews = Math.max(...sorted.map(t => t.view_count || 0), 1);
        
        return sorted.map(tool => ({
            ...tool,
            viewsPercent: Math.max(((tool.view_count || 0) / maxViews) * 100, 2),
            clicksPercent: Math.max(((tool.click_count || 0) / maxViews) * 100, 2)
        }));
    }, [safeUserTools]);

    const isCreator = useMemo(() => safeUserTools.length > 0, [safeUserTools]);

    const handleDeleteTool = async (id, name, confirmMessage) => {
        const message = confirmMessage 
            ? confirmMessage.replace('{name}', name) 
            : `Are you sure you want to delete "${name}"?`;

        if (!window.confirm(message)) return false;

        try {
            const { error: deleteError } = await toolsService.deleteTool(id);
            if (deleteError) throw deleteError;
            
            queryClient.setQueryData(['dashboard_tools', user?.id], old => 
                (old || []).filter(t => t.id !== id)
            );
            
            showToast('Tool deleted successfully.', 'success');
            return true;
        } catch (err) {
            showToast('Error deleting tool: ' + err.message, 'error');
            return false;
        }
    };

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return {
        userTools: safeUserTools,
        favorites: safeFavorites,
        chartData,
        stats,
        isCreator,
        isPremium: user?.is_premium || false,
        user,
        isLoading: !isMounted || toolsLoading || favoritesLoading || authLoading,
        toolsLoading: !isMounted || toolsLoading,
        favoritesLoading: !isMounted || favoritesLoading,
        toolsError,
        favoritesError,
        handleDeleteTool,
        refreshData: () => { refetchTools(); refetchFavorites(); }
    };
};
