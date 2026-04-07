import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { 
    User, ShieldCheck, CreditCard, Bell
} from 'lucide-react';

// Import Modular Components
import SettingsTabs from '../components/Settings/SettingsTabs';
import SettingsProfile from '../components/Settings/SettingsProfile';
import SettingsSecurity from '../components/Settings/SettingsSecurity';
import SettingsBilling from '../components/Settings/SettingsBilling';
import SettingsNotifications from '../components/Settings/SettingsNotifications';

// Import Modular CSS
import '../styles/pages/Settings.css';

const Settings = () => {
    const navigate = useNavigate();
    const { user: authUser, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const [profile, setProfile] = useState({
        full_name: '', bio: '', role: '', avatar_url: '',
        website: '', twitter: '', github: '', linkedin: '',
        is_premium: false
    });

    const [passwords, setPasswords] = useState({ new: '', confirm: '' });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!authUser) { navigate('/auth'); return; }
        
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setProfile({
                        full_name: data.full_name || '', bio: data.bio || '', role: data.role || '',
                        avatar_url: data.avatar_url || '', website: data.website || '',
                        twitter: data.twitter || '', github: data.github || '', linkedin: data.linkedin || '',
                        is_premium: data.is_premium || false
                    });
                }
            } catch (err) {
                if (err.code !== 'PGRST116') showToast('Error loading profile.', 'error');
            } finally { setLoading(false); }
        };
        fetchProfile();
    }, [navigate, authUser, authLoading, showToast]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: authUser.id, ...profile, updated_at: new Date().toISOString()
            });
            if (error) throw error;
            showToast('Profile updated!', 'success');
        } catch (err) { showToast(err.message, 'error'); } finally { setSaving(false); }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSaving(true);
        try {
            const fileExt = file.name.split('.').pop();
            const filePath = `avatars/${authUser.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('tool-images').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: { publicUrl } } = supabase.storage.from('tool-images').getPublicUrl(filePath);
            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            await supabase.from('profiles').upsert({ id: authUser.id, avatar_url: publicUrl });
            showToast('Avatar updated!', 'success');
        } catch (err) { showToast(err.message, 'error'); } finally { setSaving(false); }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (!passwords.new || passwords.new.length < 6) { showToast('Min 6 characters required.', 'error'); return; }
        if (passwords.new !== passwords.confirm) { showToast('Passwords do not match!', 'error'); return; }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.new });
            if (error) throw error;
            showToast('Password updated!', 'success');
            setPasswords({ new: '', confirm: '' });
        } catch (err) { showToast(err.message, 'error'); } finally { setSaving(false); }
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Safety & Privacy', icon: <ShieldCheck size={18} /> },
        { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ];

    if (loading) {
        return (
            <div className="settings-view">
                <div className="settings-container">
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    return (
        <div className="settings-view">
            <div className="settings-container">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard', path: '/dashboard' }, { label: 'Settings' }]} />
                
                <header className="settings-header">
                    <h1>Account <span className="gradient-text">Settings</span></h1>
                    <p>Manage your professional identity, security preferences, and data.</p>
                </header>

                <div className="settings-layout">
                    <SettingsTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    
                    <main className="settings-main-content">
                        {activeTab === 'profile' && (
                            <SettingsProfile 
                                profile={profile} setProfile={setProfile} 
                                handleProfileUpdate={handleProfileUpdate} 
                                handleAvatarUpload={handleAvatarUpload} 
                                saving={saving} authUser={authUser} 
                            />
                        )}

                        {activeTab === 'security' && (
                            <SettingsSecurity 
                                passwords={passwords} setPasswords={setPasswords} 
                                handlePasswordUpdate={handlePasswordUpdate} 
                                showNewPassword={showNewPassword} setShowNewPassword={setShowNewPassword}
                                showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
                                saving={saving}
                            />
                        )}

                        {activeTab === 'billing' && <SettingsBilling profile={profile} />}
                        {activeTab === 'notifications' && <SettingsNotifications profile={profile} />}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Settings;
