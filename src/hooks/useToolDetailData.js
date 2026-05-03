import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toolsService } from '../services/toolsService';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../utils/notifications';
import { TOOL_DETAIL_CONSTANTS } from '../constants/toolDetailConstants';

import { getCurrentUrl } from '../utils/getCurrentUrl';

/**
 * Custom hook for managing tool detail data, favorites, and fetching logic
 * Follows Rule #21 (Data Contract) and #27 (Hook Responsibility)
 */
export const useToolDetailData = () => {
    const { id: slug } = useParams();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [tool, setTool] = useState(null);
    const [publisher, setPublisher] = useState(null);
    const [relatedTools, setRelatedTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        if (!slug) return;
        
        setLoading(true);
        setError(null);
        
        try {
            // 1. Fetch Main Tool (Critical Path)
            const { data: toolData, error: toolError } = await toolsService.getToolBySlug(slug);
            
            if (toolError) {
                setError(toolError.message || 'Tool not found');
                setTool(null);
                setLoading(false);
                return;
            }

            if (!toolData) {
                setTool(null);
                setLoading(false);
                return;
            }

            setTool(toolData);
            setLoading(false); // Tool is ready, page can show structure

            // 2. Parallel Fetching for secondary data (Rule #17: Progressive)
            // These don't block the main tool display
            const promises = [
                toolsService.getRelatedTools(toolData.category_id, toolData.id),
                toolsService.incrementViewCount(toolData.id, toolData.view_count),
                profilesService.getProfileById(toolData.user_id)
            ];

            if (user) {
                promises.push(favoritesService.isToolFavorited(user.id, toolData.id));
            }

            const [relatedRes, _, profileRes, favRes] = await Promise.all(promises.map(p => p.catch(e => ({ error: e }))));
            
            // Rule #32: Defensive Rendering
            setRelatedTools(relatedRes?.data?.filter(Boolean) ?? []);
            
            if (profileRes?.data) setPublisher(profileRes.data);
            if (user && favRes?.data) setIsFavorited(true);

        } catch (err) {
            console.error('Error fetching tool detail:', err);
            setError(err.message || 'Unknown error occurred');
            setLoading(false);
        }
    }, [slug, user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleFavorite = async () => {
        if (!user) {
            return { error: 'auth_required' };
        }

        if (!tool?.id) return { error: 'invalid_tool' };

        try {
            if (isFavorited) {
                const { error: revError } = await favoritesService.removeFavorite(user.id, tool.id);
                if (revError) throw revError;
                
                setIsFavorited(false);
                showToast(TOOL_DETAIL_CONSTANTS.FAVORITE_REMOVED, 'info');
            } else {
                const { error: addError } = await favoritesService.addFavorite(user.id, tool.id);
                if (addError) throw addError;
                
                setIsFavorited(true);
                
                await sendNotification(
                    user.id, 
                    'Added to Favorites', 
                    `You added ${tool.name} to your favorites list.`,
                    'info'
                ).catch(() => {});

                showToast(TOOL_DETAIL_CONSTANTS.FAVORITE_ADDED, 'success');
            }
            return { success: true };
        } catch (err) {
            console.error('Error toggling favorite:', err);
            showToast('Failed to save favorite.', 'error');
            return { error: err.message };
        }
    };

    const handleShare = useCallback(async () => {
        if (!tool) return;

        const currentUrl = getCurrentUrl();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: tool.name,
                    text: tool.short_description || tool.description,
                    url: currentUrl,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                showToast(TOOL_DETAIL_CONSTANTS.SHARE_SUCCESS, 'success');
            } catch (err) {
                console.error('Clipboard failed:', err);
            }
        }
    }, [tool, showToast]);

    const handleExternalClick = useCallback(async () => {
        if (!tool?.id) return;
        try {
            await toolsService.incrementClickCount(tool.id, tool.click_count);
        } catch (err) {
            console.error('Failed to track click:', err);
        }
    }, [tool?.id, tool?.click_count]);

    const openReportModal = useCallback(() => setIsReportModalOpen(true), []);
    const closeReportModal = useCallback(() => setIsReportModalOpen(false), []);

    // Rule #35: Derived Data Stability
    const memoizedValue = useMemo(() => ({
        tool,
        publisher,
        relatedTools: relatedTools.filter(Boolean),
        loading,
        error,
        isFavorited,
        isReportModalOpen,
        toggleFavorite,
        handleShare,
        handleExternalClick,
        openReportModal,
        closeReportModal,
        user,
        refresh: fetchData
    }), [
        tool, 
        publisher, 
        relatedTools, 
        loading, 
        error, 
        isFavorited, 
        isReportModalOpen, 
        toggleFavorite, 
        handleShare, 
        handleExternalClick, 
        openReportModal, 
        closeReportModal, 
        user, 
        fetchData
    ]);

    return memoizedValue;
};

