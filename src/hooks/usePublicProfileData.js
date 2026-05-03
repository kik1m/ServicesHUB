import { useState, useEffect, useCallback } from 'react';
import { profilesService } from '../services/profilesService';
import { favoritesService } from '../services/favoritesService';
import { socialService } from '../services/socialService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendNotification } from '../utils/notifications';
import { PROFILE_UI_CONSTANTS } from '../constants/profileConstants';

/**
 * usePublicProfileData - Elite Hook Layer
 * Rule #1: Full Logic Isolation
 * Rule #39: Data Normalization
 */
export const usePublicProfileData = (id) => {
    const { user } = useAuth();
    const { showToast } = useToast();
    
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [tools, setTools] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        setNotFound(false);
        
        try {
            // 1. Fetch Profile First to get the true UUID if 'id' is a slug
            const profileData = await profilesService.getPublicProfile(id);
            if (!profileData) throw new Error('Profile not found');

            setProfile(profileData);

            // 2. Fetch dependent data using the confirmed profile ID
            const targetId = profileData.id;
            const [toolsData, favsData, followingStatus, counts] = await Promise.all([
                profilesService.getPublicTools(targetId),
                favoritesService.getUserFavorites(targetId),
                user?.id ? socialService.isFollowing(user.id, targetId) : Promise.resolve(false),
                socialService.getSocialCounts(targetId)
            ]);

            setProfile(prev => ({
                ...prev,
                followers_count: counts.followers,
                following_count: counts.following
            }));
            
            setTools(Array.isArray(toolsData) ? toolsData : []);
            
            const normalizedFavs = (favsData.data || [])
                .map(f => f.tools)
                .filter(Boolean);
            setFavorites(normalizedFavs);
            setIsFollowing(followingStatus);

        } catch (err) {
            console.error('Public Profile Fetch Error:', err);
            if (err.code === 'PGRST116' || err.message === 'Profile not found') {
                setNotFound(true);
            } else {
                setError(err.message || 'Operation failed');
            }
        } finally {
            setLoading(false);
        }
    }, [id, user?.id]);

    const handleFollow = useCallback(async () => {
        if (!user) {
            showToast('Please login to follow users', 'info');
            return;
        }

        if (user.id === id) {
            showToast("You can't follow yourself", 'warning');
            return;
        }
        
        try {
            // Rule #1: Perform action and wait for DB confirmation
            if (isFollowing) {
                await socialService.unfollowUser(user.id, id);
                setIsFollowing(false);
                showToast('Unfollowed user', 'success');
            } else {
                await socialService.followUser(user.id, id);
                setIsFollowing(true);
                
                // Elite Notification: Notify the followed user
                await sendNotification(
                    id, 
                    'New Community Connection!', 
                    `${user.full_name || 'A user'} is now following you. Explore their profile and connect!`,
                    'social',
                    { actorId: user.id, type: 'follow' }
                ).catch(() => {});

                showToast('Following user!', 'success');
            }
            
            // Rule #2: Refresh counts from DB immediately
            const counts = await socialService.getSocialCounts(id);
            setProfile(prev => ({
                ...prev,
                followers_count: counts.followers,
                following_count: counts.following
            }));

        } catch (err) {
            console.error('Follow Sync Error:', err);
            
            // Rule #3: Detailed Error Handling
            if (err.code === '23505') { // Unique constraint violation (already following)
                setIsFollowing(true);
            } else {
                showToast('Failed to sync follow status. Please try again.', 'error');
                // Force resync with DB
                const freshStatus = await socialService.isFollowing(user.id, id);
                setIsFollowing(freshStatus);
            }
            
            // Always refresh data to be safe
            fetchData();
        }
    }, [user, id, isFollowing, showToast, fetchData]);

    const handleCopyLink = useCallback(() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast(PROFILE_UI_CONSTANTS.public.hero.copiedBtn, 'success');
        setTimeout(() => setCopied(false), 2000);
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        profile,
        tools,
        favorites,
        isFollowing,
        isOwner: user?.id === id,
        isLoading: loading,
        error,
        notFound,
        copied,
        handleCopyLink,
        handleFollow,
        refetch: fetchData
    };
};
