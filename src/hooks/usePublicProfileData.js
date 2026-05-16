import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { PROFILE_UI_CONSTANTS } from '../constants/profileConstants';

/**
 * 🚀 Elite Hook Layer: usePublicProfileData (Next.js Hydrated)
 * Rule #1: Full Logic Isolation
 * Supports SSR hydration via initialData.
 */
export const usePublicProfileData = (id, initialData = {}) => {
    const { user } = useAuth();
    const { addToast } = useToast(); // Next.js version uses addToast
    const queryClient = useQueryClient();
    
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    // 1. React Query: Main Profile Data
    const { 
        data: baseProfile, 
        isLoading: loadingProfile, 
        error: profileError, 
        refetch: refetchProfile 
    } = useQuery({
        queryKey: ['public_profile', id],
        queryFn: async () => {
            try {
                const data = await profilesService.getPublicProfile(id);
                if (!data) throw new Error('Profile not found');
                return data;
            } catch (err) {
                if (err.code === 'PGRST116' || err.message === 'Profile not found') {
                    setNotFound(true);
                }
                throw err;
            }
        },
        initialData: initialData.profile,
        initialDataUpdatedAt: initialData.profile ? Date.now() : undefined,
        enabled: !!id,
        staleTime: 1000 * 60 * 10
    });

    const targetId = baseProfile?.id;

    // 2. React Query: Social Counts
    const { data: socialCounts } = useQuery({
        queryKey: ['social_counts', targetId],
        queryFn: async () => socialService.getSocialCounts(targetId),
        initialData: initialData.socialCounts,
        initialDataUpdatedAt: initialData.socialCounts ? Date.now() : undefined,
        enabled: !!targetId,
        staleTime: 1000 * 60 * 2
    });

    // 3. React Query: Published Tools
    const { data: tools = [], isLoading: loadingTools, refetch: refetchTools } = useQuery({
        queryKey: ['public_tools', targetId],
        queryFn: async () => {
            const data = await profilesService.getPublicTools(targetId);
            return Array.isArray(data) ? data : [];
        },
        enabled: !!targetId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    // 4. React Query: Favorites
    const { data: favorites = [], isLoading: loadingFavorites, refetch: refetchFavorites } = useQuery({
        queryKey: ['public_favorites', targetId],
        queryFn: async () => {
            const { data } = await favoritesService.getUserFavorites(targetId);
            return (data || []).map(f => f.tools).filter(Boolean);
        },
        enabled: !!targetId,
        staleTime: 1000 * 60 * 5 // 5 minutes
    });

    // 5. React Query: Following Status
    const { data: initialIsFollowing = false } = useQuery({
        queryKey: ['is_following', user?.id, targetId],
        queryFn: async () => socialService.isFollowing(user.id, targetId),
        enabled: !!user?.id && !!targetId && user?.id !== targetId,
        staleTime: 0
    });

    // Local state for optimistic following UI
    const [isFollowing, setIsFollowing] = useState(false);
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    // Derived Profile State
    const profile = baseProfile ? {
        ...baseProfile,
        followers_count: socialCounts?.followers ?? baseProfile.followers_count,
        following_count: socialCounts?.following ?? baseProfile.following_count
    } : null;

    const handleFollow = useCallback(async () => {
        if (!user) {
            addToast?.('Please login to follow users', 'info');
            return;
        }

        if (user.id === targetId) {
            addToast?.("You can't follow yourself", 'warning');
            return;
        }
        
        setIsFollowing(prev => !prev);
        
        try {
            if (isFollowing) {
                await socialService.unfollowUser(user.id, targetId);
                queryClient.setQueryData(['is_following', user.id, targetId], false);
                addToast?.('Unfollowed user', 'success');
            } else {
                await socialService.followUser(user.id, targetId);
                queryClient.setQueryData(['is_following', user.id, targetId], true);
                
                await sendNotification(
                    targetId, 
                    'New Community Connection!', 
                    `${user.full_name || 'A user'} is now following you. Explore their profile and connect!`,
                    'social',
                    { actorId: user.id, type: 'follow' }
                ).catch(() => {});

                addToast?.('Following user!', 'success');
            }
            
            queryClient.invalidateQueries({ queryKey: ['social_counts', targetId] });
        } catch (err) {
            console.error('Follow Sync Error:', err);
            if (err.code === '23505') {
                queryClient.setQueryData(['is_following', user.id, targetId], true);
                setIsFollowing(true);
            } else {
                addToast?.('Failed to sync follow status. Please try again.', 'error');
                setIsFollowing(isFollowing);
                queryClient.invalidateQueries({ queryKey: ['is_following', user.id, targetId] });
            }
        }
    }, [user, targetId, isFollowing, addToast, queryClient]);

    const handleCopyLink = useCallback(() => {
        if (typeof window === 'undefined') return;
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        addToast?.(PROFILE_UI_CONSTANTS.public.hero.copiedBtn, 'success');
        setTimeout(() => setCopied(false), 2000);
    }, [addToast]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isLoading = !isMounted || loadingProfile || (!!targetId && (loadingTools || loadingFavorites));
    const error = profileError ? profileError.message : null;

    return {
        profile,
        tools,
        favorites,
        isFollowing,
        isOwner: user?.id === targetId,
        isLoading,
        error,
        notFound,
        copied,
        handleCopyLink,
        handleFollow,
        refetch: () => {
            refetchProfile();
            refetchTools();
            refetchFavorites();
            queryClient.invalidateQueries({ queryKey: ['social_counts', targetId] });
        }
    };
};
