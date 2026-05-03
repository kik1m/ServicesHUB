import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { settingsService } from '../services/settingsService';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';

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

            // Elite Sanitization: Only allow user-editable fields
            const sanitizedProfile = {
                full_name: profile.full_name,
                role: profile.role,
                bio: profile.bio,
                avatar_url: profile.avatar_url,
                website: profile.website,
                twitter: profile.twitter,
                github: profile.github,
                linkedin: profile.linkedin
            };

            await settingsService.updateProfile(authUser.id, sanitizedProfile);
            
            await sendNotification(
                authUser.id, 
                'Identity Synchronized', 
                'Your profile information has been successfully updated across our ecosystem.', 
                'success'
            ).catch(() => {});

            // Elite Email Security Alert
            if (authUser.email) {
                await emailTriggers.sendSecurityAlert(
                    authUser.email,
                    profile.full_name || 'Member',
                    'Profile Information Update'
                ).catch(() => {});
            }

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

            await sendNotification(
                authUser.id, 
                'Security Alert: Password Updated', 
                'Your account password was recently changed. If you did not perform this action, please contact support immediately.', 
                'warning'
            ).catch(() => {});

            // Elite Email Security Alert
            if (authUser.email) {
                await emailTriggers.sendSecurityAlert(
                    authUser.email,
                    profile.full_name || 'Member',
                    'Account Password Change'
                ).catch(() => {});
            }

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
