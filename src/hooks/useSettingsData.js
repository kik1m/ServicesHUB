import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { settingsService } from '../services/settingsService';
import { profilesService } from '../services/profilesService';
import { storageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook for managing the Settings page logic
 */
export const useSettingsData = () => {
    const navigate = useNavigate();
    const { user: authUser, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    // UI States
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Data States
    const [profile, setProfile] = useState({
        full_name: '',
        bio: '',
        role: '',
        avatar_url: '',
        website: '',
        twitter: '',
        github: '',
        linkedin: '',
        is_premium: false
    });

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch Profile Logic
    useEffect(() => {
        if (authLoading) return;
        if (!authUser) {
            navigate('/auth');
            return;
        }

        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data, error } = await profilesService.getProfileById(authUser.id);
                if (error) throw error;
                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        bio: data.bio || '',
                        role: data.role || '',
                        avatar_url: data.avatar_url || '',
                        website: data.website || '',
                        twitter: data.twitter || '',
                        github: data.github || '',
                        linkedin: data.linkedin || '',
                        is_premium: data.is_premium || false
                    });
                }
            } catch (err) {
                console.error("Settings Load Error:", err);
                showToast('Error loading profile.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, authUser, authLoading, showToast]);

    // Profile Update Handler
    const handleProfileUpdate = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);
        try {
            const { error } = await settingsService.updateProfile(authUser.id, profile);
            if (error) throw error;
            showToast('Profile updated!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // Avatar Upload Handler
    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const publicUrl = await storageService.uploadAvatar(authUser.id, file);
            
            // Update local state
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            
            // Persist to database
            const { error } = await settingsService.updateProfile(authUser.id, { avatar_url: publicUrl });
            if (error) throw error;
            
            showToast('Avatar updated!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    // Password Update Handler
    const handlePasswordUpdate = async (e) => {
        if (e) e.preventDefault();
        
        if (!passwords.new || passwords.new.length < 6) {
            showToast('Min 6 characters required.', 'error');
            return;
        }
        
        if (passwords.new !== passwords.confirm) {
            showToast('Passwords do not match!', 'error');
            return;
        }

        setSaving(true);
        try {
            const { error } = await settingsService.updatePassword(passwords.new);
            if (error) throw error;
            
            showToast('Password updated!', 'success');
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    return {
        activeTab,
        setActiveTab,
        loading,
        saving,
        uploading,
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
        authUser
    };
};
