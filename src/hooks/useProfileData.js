import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook for managing User Profile page logic, favorites, and auth actions
 */
export const useProfileData = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites');
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchProfileData = async () => {
            setLoading(true);
            setLoadingFavorites(true);
            try {
                const [profileRes, favsRes] = await Promise.all([
                    profilesService.getProfileById(user.id),
                    favoritesService.getUserFavorites(user.id)
                ]);

                if (profileRes.error) throw profileRes.error;
                
                // Merge auth user data with profile table data
                setProfile({ ...user, ...(profileRes.data || {}) });
                
                // Extract tools from favorites response
                setFavorites((favsRes.data || []).map(f => f.tools).filter(Boolean));
            } catch (error) {
                console.error('Error fetching profile data:', error);
                showToast('Could not load profile data', 'error');
            } finally {
                setLoading(false);
                setLoadingFavorites(false);
            }
        };

        fetchProfileData();
    }, [user, authLoading, navigate, showToast]);

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            showToast('Signed out successfully', 'success');
            navigate('/');
        } catch (error) {
            console.error('Sign out error:', error);
            showToast('Error signing out', 'error');
        }
    };

    return {
        profile,
        user,
        loading: loading || authLoading,
        favorites,
        activeTab,
        setActiveTab,
        loadingFavorites,
        handleSignOut,
        totalFavorites: favorites.length
    };
};
