import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { queryOptions } from '../lib/queryOptions';
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
    } = useQuery(queryOptions.profile(user?.id, user));

    // 3. React Query: Favorites Data
    const { 
        data: favoritesDataRaw = [], 
        isLoading: loadingFavorites, 
        error: queryErrorFavorites, 
        refetch: refetchFavorites 
    } = useQuery(queryOptions.favorites(user?.id));
    
    // Map favorites to standard tools format
    const favorites = useMemo(() => favoritesDataRaw.map(f => f.tools).filter(Boolean), [favoritesDataRaw]);

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

    return useMemo(() => ({
        profile,
        user,
        loading: loadingProfile || authLoading,
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
