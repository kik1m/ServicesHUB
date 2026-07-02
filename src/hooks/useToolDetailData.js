import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toolsService } from '../services/toolsService';
import { queryOptions } from '../lib/queryOptions';
import { favoritesService } from '../services/favoritesService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../utils/notifications';
import { TOOL_DETAIL_CONSTANTS } from '../constants/toolDetailConstants';
import { getCurrentUrl } from '../utils/getCurrentUrl';

/**
 * 🚀 Elite Tool Detail Engine (React Query Optimized)
 * Rule #21: Data Contract, Rule #17: Progressive Rendering
 */
export const useToolDetailData = ({ initialTool, initialPublisher, initialRelatedTools }) => {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;
    const { user } = useAuth();
    const toastContext = useToast();
    const addToast = toastContext?.addToast;
    const queryClient = useQueryClient();

    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // 1. React Query: Main Tool Data
    const { 
        data: tool, 
        isLoading: loading, 
        error: toolError, 
        refetch: refetchTool 
    } = useQuery({
        ...queryOptions.toolBySlug(slug),
        initialData: initialTool,
        initialDataUpdatedAt: initialTool ? Date.now() : undefined,
    });

    const error = toolError ? (toolError.message || 'Tool not found') : null;

    // 2. React Query: Publisher Data (Dependent Query)
    const { data: publisher = null } = useQuery({
        ...queryOptions.profile(tool?.user_id, initialPublisher),
        initialData: initialPublisher,
        initialDataUpdatedAt: initialPublisher ? Date.now() : undefined,
    });

    // 3. React Query: Related Tools (Dependent Query)
    const { data: relatedTools = [] } = useQuery({
        queryKey: ['tool_related', tool?.category_id, tool?.id],
        queryFn: async () => {
            const { data } = await toolsService.getRelatedTools(tool.category_id, tool.id);
            return data?.filter(Boolean) || [];
        },
        initialData: initialRelatedTools,
        initialDataUpdatedAt: initialRelatedTools ? Date.now() : undefined,
        enabled: !!tool?.category_id && !!tool?.id,
        staleTime: 1000 * 60 * 60 // 1 hour
    });

    // 4. React Query: Favorite Status (Dependent Query)
    const { data: initialFavorited = false } = useQuery({
        queryKey: ['favorite', user?.id, tool?.id],
        queryFn: async () => {
            const { data } = await favoritesService.isToolFavorited(user.id, tool.id);
            return !!data;
        },
        enabled: !!user?.id && !!tool?.id,
        staleTime: 0 // Always fresh check
    });

    // Local optimistic UI state for favorites
    const [isFavorited, setIsFavorited] = useState(false);
    useEffect(() => {
        setIsFavorited(initialFavorited);
    }, [initialFavorited]);

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

        // Optimistic UI Update
        setIsFavorited(prev => !prev);

        try {
            if (isFavorited) {
                const { error: revError } = await favoritesService.removeFavorite(user.id, tool.id);
                if (revError) throw revError;
                
                queryClient.setQueryData(['favorite', user.id, tool.id], false);
                addToast?.(TOOL_DETAIL_CONSTANTS.FAVORITE_REMOVED, 'info');
            } else {
                const { error: addError } = await favoritesService.addFavorite(user.id, tool.id);
                if (addError) throw addError;
                
                queryClient.setQueryData(['favorite', user.id, tool.id], true);
                
                await sendNotification(
                    user.id, 
                    'Added to Favorites', 
                    `You added ${tool.name} to your favorites list.`,
                    'info'
                ).catch(() => {});

                addToast?.(TOOL_DETAIL_CONSTANTS.FAVORITE_ADDED, 'success');
            }
            return { success: true };
        } catch (err) {
            // Revert Optimistic Update
            setIsFavorited(isFavorited);
            console.error('Error toggling favorite:', err);
            addToast?.('Failed to save favorite.', 'error');
            return { error: err.message };
        }
    };

    const handleCompare = useCallback(() => {
        if (!tool?.slug) return;
        router.push(`/compare?t1=${tool.slug}`);
    }, [tool?.slug, router]);

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
                addToast?.(TOOL_DETAIL_CONSTANTS.SHARE_SUCCESS, 'success');
            } catch (err) { console.error('Clipboard failed:', err); }
        }
    }, [tool, addToast]);

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
        refresh: refetchTool
    }), [
        tool, 
        publisher, 
        relatedTools, 
        loading, 
        error, 
        isFavorited, 
        isReportModalOpen, 
        handleCompare,
        handleShare,
        handleExternalClick, 
        openReportModal, 
        closeReportModal, 
        user, 
        refetchTool
    ]);

    return memoizedValue;
};
