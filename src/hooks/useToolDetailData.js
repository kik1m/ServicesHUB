import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toolsService } from '../services/toolsService';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../utils/notifications';

/**
 * Custom hook for managing tool detail data, favorites, and UI interactions
 */
export const useToolDetailData = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [tool, setTool] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [relatedTools, setRelatedTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch Main Tool
            const { data: toolData, error: toolError } = await toolsService.getToolBySlug(slug);
            if (toolError) throw toolError;
            if (!toolData) {
                setTool(null);
                setLoading(false);
                return;
            }
            setTool(toolData);

            // 2. Parallel Fetching for secondary data
            const promises = [
                toolsService.getRelatedTools(toolData.category_id, toolData.id),
                toolsService.incrementViewCount(toolData.id, toolData.view_count),
                profilesService.getProfileById(toolData.user_id)
            ];

            if (user) {
                promises.push(favoritesService.isToolFavorited(user.id, toolData.id));
            }

            const results = await Promise.all(promises);
            
            setRelatedTools(results[0].data || []);
            // results[1] is increment view update (no state needed usually)
            if (results[2]?.data) setPublisher(results[2].data);
            if (user && results[3]?.data) setIsFavorited(true);

        } catch (error) {
            console.error('Error fetching tool detail:', error);
            showToast('Error loading tool: ' + (error.message || 'Unknown error'), 'error');
        } finally {
            setLoading(false);
        }
    }, [slug, user, showToast]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
    }, [fetchData]);

    const toggleFavorite = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        try {
            if (isFavorited) {
                const { error } = await favoritesService.removeFavorite(user.id, tool.id);
                if (error) throw error;
                setIsFavorited(false);
                showToast('Removed from favorites', 'info');
            } else {
                const { error } = await favoritesService.addFavorite(user.id, tool.id);
                if (error) throw error;
                setIsFavorited(true);
                
                await sendNotification(
                    user.id, 
                    'Added to Favorites', 
                    `You added ${tool.name} to your favorites list.`,
                    'info'
                );
                showToast('Success. Added to your favorites.', 'success');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showToast('Failed to save favorite.', 'error');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: tool?.name,
                    text: tool?.short_description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard!', 'success');
        }
    };

    return {
        tool,
        publisher,
        relatedTools,
        loading,
        isFavorited,
        isReportModalOpen,
        setIsReportModalOpen,
        toggleFavorite,
        handleShare,
        navigate
    };
};
