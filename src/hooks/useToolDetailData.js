import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
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
            const promises = [
                toolsService.getRelatedTools(toolData.category_id, toolData.id),
                profilesService.getProfileById(toolData.user_id)
            ];

            if (user) {
                promises.push(favoritesService.isToolFavorited(user.id, toolData.id));
            }

            const [relatedRes, profileRes, favRes] = await Promise.all(promises.map(p => p.catch(e => ({ error: e }))));
            
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

    // Rule #47: Smart View Throttling (12h window)
    useEffect(() => {
        if (!tool?.id) return;

        const handleViewIncrement = async () => {
            const STORAGE_KEY = `tool_view_${tool.id}`;
            const lastView = localStorage.getItem(STORAGE_KEY);
            const now = Date.now();
            const TWELVE_HOURS = 12 * 60 * 60 * 1000;

            if (lastView && (now - parseInt(lastView)) < TWELVE_HOURS) {
                return;
            }

            try {
                await toolsService.incrementViewCount(tool.id, tool.view_count);
                localStorage.setItem(STORAGE_KEY, now.toString());
            } catch (err) {
                console.warn('View count update failed:', err);
            }
        };

        handleViewIncrement();
    }, [tool?.id]);

    const toggleFavorite = async () => {
        if (!user) return { error: 'auth_required' };
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

    const handleCompare = useCallback(() => {
        if (!tool?.slug) return;
        navigate(`/compare?t1=${tool.slug}`);
    }, [tool?.slug, navigate]);

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
            } catch (err) { console.error('Share failed:', err); }
        } else {
            try {
                await navigator.clipboard.writeText(currentUrl);
                showToast(TOOL_DETAIL_CONSTANTS.SHARE_SUCCESS, 'success');
            } catch (err) { console.error('Clipboard failed:', err); }
        }
    }, [tool, showToast]);

    const handleExternalClick = useCallback(async () => {
        if (!tool?.id) return;

        const STORAGE_KEY = `tool_click_${tool.id}`;
        const lastClick = localStorage.getItem(STORAGE_KEY);
        const now = Date.now();
        const ONE_HOUR = 60 * 60 * 1000;

        if (lastClick && (now - parseInt(lastClick)) < ONE_HOUR) return;

        try {
            await toolsService.incrementClickCount(tool.id, tool.click_count);
            localStorage.setItem(STORAGE_KEY, now.toString());
        } catch (err) { console.error('Failed to track click:', err); }
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
        handleCompare,
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
        handleCompare,
        handleExternalClick, 
        openReportModal, 
        closeReportModal, 
        user, 
        fetchData
    ]);

    return memoizedValue;
};
