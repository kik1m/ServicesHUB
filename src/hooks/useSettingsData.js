'use client';
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryOptions } from '../lib/queryOptions';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { settingsService } from '../services/settingsService';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';

/**
 * useSettingsData - Elite Hardened Hook for Next.js
 * Rule #1: Business Logic Isolation
 * Rule #13: Defensive Data Operations (Metadata Fallback)
 */
export const useSettingsData = () => {
    const { user: authUser } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    
    const [activeTab, setActiveTab] = useState('profile');
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [actionError, setActionError] = useState(null);
    
    const [profile, setProfile] = useState({
        full_name: '',
        role: '',
        experience_level: '',
        primary_goal: '',
        bio: '',
        avatar_url: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: '',
        email_notif: true,
        review_notif: true,
        promo_notif: true
    });

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { 
        data: serverProfile, 
        isLoading: loading, 
        error: queryError, 
        refetch: fetchSettings 
    } = useQuery(queryOptions.profile(authUser?.id, authUser));

    const error = queryError ? 'Failed to load settings.' : null;

    // Synchronize profile state with server data AND auth metadata preferences
    useEffect(() => {
        if (serverProfile || authUser) {
            // Get preferences from Auth Metadata (Safest storage when schema is locked)
            const prefs = authUser?.user_metadata?.preferences || {};
            
            setProfile(prev => ({ 
                ...prev, 
                // Priority 1: Auth metadata fallbacks (for instant UI)
                full_name: authUser?.user_metadata?.full_name || prev.full_name,
                avatar_url: authUser?.user_metadata?.avatar_url || prev.avatar_url,
                // Priority 2: Server data (The real source of truth)
                ...(serverProfile || {}),
                // Merge preferences from metadata
                email_notif: prefs.email_notif !== undefined ? prefs.email_notif : prev.email_notif,
                review_notif: prefs.review_notif !== undefined ? prefs.review_notif : prev.review_notif,
                promo_notif: prefs.promo_notif !== undefined ? prefs.promo_notif : prev.promo_notif
            }));
        }
    }, [serverProfile, authUser]);

    const handleProfileUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (!authUser) return;

        try {
            setSaving(true);
            setActionError(null);

            // Only update columns that definitely exist in the profiles table
            const sanitizedProfile = {
                full_name: profile.full_name,
                job_title: profile.job_title,
                experience_level: profile.experience_level,
                primary_goal: profile.primary_goal,
                bio: profile.bio,
                avatar_url: profile.avatar_url,
                website: profile.website,
                twitter: profile.twitter,
                github: profile.github,
                linkedin: profile.linkedin
            };

            await settingsService.updateProfile(authUser.id, sanitizedProfile);
            
            // 1. Internal Notification
            await sendNotification(
                authUser.id, 
                'Identity Synchronized', 
                'Your profile information has been successfully updated across our ecosystem.', 
                'success'
            ).catch(() => {});

            // 2. Elite Email Security Alert
            if (authUser.email) {
                await emailTriggers.sendSecurityAlert(
                    authUser.email,
                    profile.full_name || 'Member',
                    'Profile Information Update'
                ).catch(() => {});
            }

            queryClient.setQueryData(['profile', authUser.id], old => ({
                ...(old || {}),
                ...sanitizedProfile
            }));

            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            setActionError('Could not save changes.');
            showToast('Failed to update profile', 'error');
        } finally {
            setSaving(false);
        }
    }, [authUser, profile, showToast, queryClient]);

    const handlePasswordUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            showToast("Passwords don't match", 'error');
            return;
        }

        try {
            setSaving(true);
            setActionError(null);
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwords.new
            });
            if (updateError) throw updateError;

            // 1. Internal Notification
            await sendNotification(
                authUser.id, 
                'Security Alert: Password Updated', 
                'Your account password was recently changed. If you did not perform this action, please contact support immediately.', 
                'warning'
            ).catch(() => {});

            // 2. Elite Email Security Alert
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
            setActionError(err.message || 'Failed to update password.');
            showToast('Password update failed', 'error');
        } finally {
            setSaving(false);
        }
    }, [passwords, showToast, authUser, profile]);

    const handleAvatarUpload = useCallback(async (e) => {
        const file = e.target.files[0];
        if (!file || !authUser) return;

        try {
            setUploading(true);
            setActionError(null);
            const url = await settingsService.uploadAvatar(authUser.id, file);
            setProfile(prev => ({ ...prev, avatar_url: url }));
            
            queryClient.setQueryData(['profile', authUser.id], old => ({
                ...(old || {}),
                avatar_url: url
            }));
        } catch (err) {
            const message = err?.message || 'Failed to upload image.';
            setActionError(message);
            showToast(message, 'error');
        } finally {
            setUploading(false);
        }
    }, [authUser, queryClient]);

    /**
     * handleNotificationToggle - Strategy Shift
     * Since profiles table schema is restricted, we use Supabase Auth Metadata 
     * to store preferences. This is non-destructive and doesn't require SQL migrations.
     */
    const handleNotificationToggle = useCallback(async (id, value) => {
        if (!authUser) return;

        // 1. Optimistic Update (UI stays responsive)
        setProfile(prev => ({ ...prev, [id]: value }));

        try {
            // Get current preferences or empty object
            const currentPrefs = authUser?.user_metadata?.preferences || {};
            const newPrefs = { ...currentPrefs, [id]: value };

            // Update Supabase Auth User Metadata (The "Elite" Fallback)
            const { error: updateError } = await supabase.auth.updateUser({
                data: { preferences: newPrefs }
            });

            if (updateError) throw updateError;
            
            showToast(`${id.replace('_', ' ')} updated.`, 'success');
        } catch (err) {
            console.error('Preference Update Error:', err);
            // Revert on error
            setProfile(prev => ({ ...prev, [id]: !value }));
            showToast('Failed to update preference.', 'error');
        }
    }, [authUser, showToast]);

    const handleDeleteAIMemory = useCallback(async () => {
        if (!authUser) return;
        const confirmDelete = window.confirm('Are you sure you want to permanently delete your AI Memory? HUBly AI will forget all context about your projects. This action cannot be undone.');
        if (!confirmDelete) return;

        try {
            setSaving(true);
            // Delete the long_term_memory field from the profiles table
            const { error: updateError } = await supabase.from('profiles').update({ long_term_memory: null }).eq('id', authUser.id);
            
            if (updateError) throw updateError;
            
            showToast('AI Memory successfully deleted. (GDPR Compliance)', 'success');
        } catch (err) {
            console.error('Memory Deletion Error:', err);
            showToast('Failed to delete AI memory.', 'error');
        } finally {
            setSaving(false);
        }
    }, [authUser, showToast]);

    return {
        activeTab, setActiveTab,
        loading, saving, uploading,
        error, actionError, setActionError,
        profile, setProfile,
        passwords, setPasswords,
        showNewPassword, setShowNewPassword,
        showConfirmPassword, setShowConfirmPassword,
        handleProfileUpdate, handleAvatarUpload, handlePasswordUpdate,
        handleNotificationToggle, handleDeleteAIMemory,
        fetchSettings, authUser
    };
};
