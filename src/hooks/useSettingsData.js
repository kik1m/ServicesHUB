import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { settingsService } from '../services/settingsService';

/**
 * useSettingsData - Elite Hardened Hook
 * Rule #1: Logic Isolation
 * Rule #13: Centralized Notifications (Toasts)
 * Rule #22: Hybrid Error Management
 */
export const useSettingsData = () => {
    const { user: authUser } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    
    // Split Error State: Critical vs Action Errors
    const [error, setError] = useState(null); // Critical (Fetch)
    const [actionError, setActionError] = useState(null); // Local (Update/Mutation)
    
    const [profile, setProfile] = useState({
        full_name: '',
        role: '',
        bio: '',
        avatar_url: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: ''
    });

    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 1. Fetch Logic - Critical Gateway
    const fetchSettings = useCallback(async () => {
        if (!authUser) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await settingsService.getProfile(authUser.id);
            if (data) {
                setProfile(prev => ({ ...prev, ...data }));
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    // 2. Action Logic: Profile Update
    const handleProfileUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (!authUser) return;

        try {
            setSaving(true);
            setActionError(null);
            await settingsService.updateProfile(authUser.id, profile);
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            console.error('Error updating profile:', err);
            setActionError('Could not save changes. Please try again.');
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    }, [authUser, profile, showToast]);

    // 3. Action Logic: Password Update
    const handlePasswordUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setActionError("Passwords don't match!");
            showToast("Passwords don't match", 'error');
            return;
        }

        try {
            setSaving(true);
            setActionError(null);
            const { error } = await supabase.auth.updateUser({
                password: passwords.new
            });
            if (error) throw error;
            showToast('Password updated successfully!', 'success');
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            console.error('Error updating password:', err);
            setActionError(err.message || 'Failed to update password.');
            showToast('Password update failed', 'error');
        } finally {
            setSaving(false);
        }
    }, [passwords, showToast]);

    // 4. Avatar Upload Logic
    const handleAvatarUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file || !authUser) return;

        try {
            setUploading(true);
            setActionError(null);
            const url = await settingsService.uploadAvatar(authUser.id, file);
            setProfile(prev => ({ ...prev, avatar_url: url }));
        } catch (err) {
            console.error('Error uploading avatar:', err);
            setActionError('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    }, [authUser]);

    // Stable Interface
    return {
        activeTab,
        setActiveTab,
        loading,
        saving,
        uploading,
        error,
        actionError,
        setActionError,
        profile,
        setProfile,
        passwords,
        setPasswords,
        showNewPassword,
        setShowNewPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        handleProfileUpdate,
        handleAvatarUpload,
        handlePasswordUpdate,
        fetchSettings,
        authUser
    };
};
