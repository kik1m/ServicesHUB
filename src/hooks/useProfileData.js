import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * Custom Hook: useProfileData (Elite v2.1 Standard)
 * Rule #27: Hook Responsibility - Partitioned Domain Logic
 * Rule #39: Data Normalization (Normalized UI-safe contract)
 */
export const useProfileData = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    // 1. Partitioned States (Rule #29)
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites');
    const [loadingFavorites, setLoadingFavorites] = useState(true);
    const [errorFavorites, setErrorFavorites] = useState(null);

    // 2. Stable Handlers (Rule #41/15)
    const handleSignOut = useCallback(async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            showToast('Signed out successfully', 'success');
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
            showToast('Error signing out', 'error');
        }
    }, [navigate, showToast]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    // 3. Isolated Fetcher logic (Rule #27)
    const fetchProfileData = useCallback(async () => {
        if (!user?.id) return;
        
        setLoading(true);
        setLoadingFavorites(true);
        setErrorFavorites(null);
        try {
            const [profileRes, favsRes] = await Promise.all([
                profilesService.getProfileById(user.id),
                favoritesService.getUserFavorites(user.id)
            ]);

            if (profileRes.error) throw new Error(profileRes.error);
            if (favsRes.error) throw favsRes.error;
            
            // Rule #39: Data Normalization handled by Service
            setProfile(profileRes.data || { ...user, full_name: 'Member' });
            
            // Rule #32: Defensive Filtering for favorites
            const normalizedFavs = (favsRes.data || [])
                .map(f => f.tools)
                .filter(Boolean);
            setFavorites(normalizedFavs);
        } catch (error) {
            console.error('useProfileData Fetch Error:', error);
            setErrorFavorites(error.message || 'Could not load your collection');
            showToast('Could not load profile data', 'error');
        } finally {
            setLoading(false);
            setLoadingFavorites(false);
        }
    }, [user, showToast]);

    // Loop Control
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/auth');
            return;
        }
        fetchProfileData();
    }, [user, authLoading, navigate, fetchProfileData]);

    // 4. Stable Contract (Rule #35/41)
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
        loading: loading || authLoading,
        favoritesData,
        activeTab,
        setActiveTab: handleTabChange,
        handleSignOut,
        totalFavorites: favorites.length,
        refetch: fetchProfileData
    }), [profile, user, loading, authLoading, favoritesData, activeTab, handleTabChange, handleSignOut, favorites.length, fetchProfileData]);
};
