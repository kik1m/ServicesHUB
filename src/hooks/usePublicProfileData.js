import { useState, useEffect, useCallback } from 'react';
import { profilesService } from '../services/profilesService';
import { useToast } from '../context/ToastContext';
import { PROFILE_UI_CONSTANTS } from '../constants/profileConstants';

/**
 * usePublicProfileData - Elite Hook Layer
 * Rule #1: Full Logic Isolation
 * Rule #39: Data Normalization
 */
export const usePublicProfileData = (id) => {
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [tools, setTools] = useState([]);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchData = useCallback(async () => {
        if (!id) return;
        
        setLoading(true);
        setError(null);
        setNotFound(false);
        
        try {
            const [profileData, toolsData] = await Promise.all([
                profilesService.getPublicProfile(id),
                profilesService.getPublicTools(id)
            ]);

            setProfile(profileData);
            setTools(Array.isArray(toolsData) ? toolsData : []);

        } catch (err) {
            console.error('Public Profile Fetch Error:', err);
            if (err.code === 'PGRST116') {
                setNotFound(true);
            } else {
                setError(err.message || 'Operation failed');
            }
        } finally {
            setLoading(false);
        }
    }, [id]);

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
        isLoading: loading,
        error,
        notFound,
        copied,
        handleCopyLink,
        refetch: fetchData
    };
};
