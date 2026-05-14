import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * 🚀 Elite Custom Hook: useProfileData (Next.js Optimized)
 * Rule #27: Hook Responsibility - Partitioned Domain Logic
 */
export const useProfileData = () => {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { addToast } = useToast();

    // 1. Partitioned States
    const [activeTab, setActiveTab] = useState('favorites');

    // Auth Redirect
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth');
        }
    }, [user, authLoading, router]);

    // 2. React Query: Profile Data
    const { 
        data: profile = null, 
        isLoading: loadingProfile, 
        refetch: refetchProfile 
    } = useQuery({
        queryKey: ['profile', user?.id],
        queryFn: async () => {
            const { data, error } = await profilesService.getProfileById(user.id);
            if (error) throw new Error(error);
            return data || { ...user, full_name: 'Member' };
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 60 // 1 hour caching
    });

    // 3. React Query: Favorites Data
    const { 
        data: favorites = [], 
        isLoading: loadingFavorites, 
        error: queryErrorFavorites, 
        refetch: refetchFavorites 
    } = useQuery({
        queryKey: ['favorites_list', user?.id],
        queryFn: async () => {
            const { data, error } = await favoritesService.getUserFavorites(user.id);
            if (error) throw error;
            return (data || []).map(f => f.tools).filter(Boolean);
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5 // 5 minutes caching
    });

    const errorFavorites = queryErrorFavorites ? (queryErrorFavorites.message || 'Could not load your collection') : null;

    // 4. Stable Handlers
    const handleSignOut = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            addToast('Signed out successfully', 'success');
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
            addToast('Error signing out', 'error');
        }
    }, [router, addToast]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // 5. Stable Contract
    const favoritesData = useMemo(() => {
        return {
            items: favorites,
            totalCount: favorites.length,
            isLoading: loadingFavorites,
            error: errorFavorites
        };
    }, [favorites, loadingFavorites, errorFavorites]);

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return useMemo(() => ({
        profile,
        user,
        loading: !isMounted || loadingProfile || authLoading,
        favoritesData,
        activeTab,
        setActiveTab: handleTabChange,
        handleSignOut,
        totalFavorites: favorites.length,
        refetch: () => {
            refetchProfile();
            refetchFavorites();
        }
    }), [
        profile, 
        user, 
        loadingProfile, 
        authLoading, 
        favoritesData, 
        activeTab, 
        handleTabChange, 
        handleSignOut, 
        favorites.length, 
        refetchProfile, 
        refetchFavorites
    ]);
};
