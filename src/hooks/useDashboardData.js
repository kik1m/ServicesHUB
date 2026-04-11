import { useState, useEffect, useCallback } from 'react';
import { toolsService } from '../services/toolsService';
import { favoritesService } from '../services/favoritesService';

/**
 * Custom hook to manage all data fetching and interaction logic for the User Dashboard
 */
export const useDashboardData = (user, authLoading) => {
    const [userTools, setUserTools] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        if (authLoading || !user) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Fetch everything in parallel for maximum performance
            const [toolsRes, favsRes] = await Promise.all([
                toolsService.getUserTools(user.id),
                favoritesService.getUserFavorites(user.id)
            ]);

            setUserTools(toolsRes.data || []);
            setFavorites(favsRes.data || []);

            if (toolsRes.error || favsRes.error) {
                console.warn('Dashboard Data: Some fetches failed partially');
                setError("Unable to sync dashboard data completely.");
            }
        } catch (err) {
            console.error('Dashboard Critical Error:', err);
            setError("A connection error occurred while loading your dashboard.");
        } finally {
            setIsLoading(false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleDeleteTool = async (id, name, showToast) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return false;
        }

        try {
            const { error: deleteError } = await toolsService.deleteTool(id);
            if (deleteError) throw deleteError;
            
            setUserTools(prev => prev.filter(t => t.id !== id));
            if (showToast) showToast('Tool deleted successfully.', 'success');
            return true;
        } catch (err) {
            if (showToast) showToast('Error deleting tool: ' + err.message, 'error');
            return false;
        }
    };

    return {
        userTools,
        favorites,
        isLoading: isLoading || authLoading,
        error,
        handleDeleteTool,
        refreshData: fetchDashboardData
    };
};
