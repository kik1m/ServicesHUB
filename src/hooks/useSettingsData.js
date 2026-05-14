'use client';
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { settingsService } from '../services/settingsService';
import { sendNotification } from '../utils/notifications';
import { emailTriggers } from '../utils/emailService';

/**
 * useSettingsData - Elite Hardened Hook for Next.js
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
        bio: '',
        avatar_url: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: ''
    });

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { 
        data: serverProfile, 
        isLoading: loading, 
        error: queryError, 
        refetch: fetchSettings 
    } = useQuery({
        queryKey: ['profile', authUser?.id],
        queryFn: async () => {
            const data = await settingsService.getProfile(authUser.id);
            return data || null;
        },
        enabled: !!authUser?.id,
        staleTime: 1000 * 60 * 60 * 24
    });

    const error = queryError ? 'Failed to load settings.' : null;

    useEffect(() => {
        if (serverProfile) {
            setProfile(prev => ({ ...prev, ...serverProfile }));
        }
    }, [serverProfile]);

    const handleProfileUpdate = useCallback(async (e) => {
        e.preventDefault();
        if (!authUser) return;

        try {
            setSaving(true);
            setActionError(null);

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
    }, [passwords, showToast]);

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
            setActionError('Failed to upload image.');
        } finally {
            setUploading(false);
        }
    }, [authUser, queryClient]);

    return {
        activeTab, setActiveTab,
        loading, saving, uploading,
        error, actionError, setActionError,
        profile, setProfile,
        passwords, setPasswords,
        showNewPassword, setShowNewPassword,
        showConfirmPassword, setShowConfirmPassword,
        handleProfileUpdate, handleAvatarUpload, handlePasswordUpdate,
        fetchSettings, authUser
    };
};
