import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Lock, Bell, Link as LinkIcon, Save, Camera, ShieldCheck, Mail, Loader2, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState({
        full_name: '',
        bio: '',
        avatar_url: ''
    });
    const [passwords, setPasswords] = useState({
        new: '',
        confirm: ''
    });
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [socialLinks, setSocialLinks] = useState({
        website: '',
        twitter: '',
        linkedin: ''
    });
    const [preferences, setPreferences] = useState({
        email_notifications: true,
        newsletter: false
    });
    const { showToast } = useToast();

    useEffect(() => {
        if (authLoading) return;
        if (!authUser) {
            navigate('/auth');
            return;
        }
        
        const fetchProfile = async () => {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/auth');
                return;
            }
            setUser(user);

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            
            if (data) {
                setProfile({
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || ''
                });
                setSocialLinks({
                    website: data.website_url || '',
                    twitter: data.twitter_url || '',
                    linkedin: data.linkedin_url || ''
                });
                setPreferences({
                    email_notifications: data.email_notifications !== false,
                    newsletter: data.newsletter === true
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [navigate]);

    const handleProfileUpdate = async () => {
        setSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                    website_url: socialLinks.website,
                    twitter_url: socialLinks.twitter,
                    linkedin_url: socialLinks.linkedin,
                    email_notifications: preferences.email_notifications,
                    newsletter: preferences.newsletter,
                    updated_at: new Date()
                })
                .eq('id', user.id);
            
            if (error) throw error;
            showToast('Profile updated successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setSaving(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setProfile({ ...profile, avatar_url: publicUrl });
            
            // Auto save the avatar URL to profile
            await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id);
            
            showToast('Avatar updated successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.new || passwords.new.length < 6) {
            showToast('Password must be at least 6 characters.', 'error');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            showToast('Passwords do not match!', 'error');
            return;
        }
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.new });
            if (error) throw error;
            showToast('Password changed successfully! Supabase will send a confirmation check.', 'success');
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ];

    if (loading) {
        return (
            <div className="settings-page" style={{ padding: '120px 5% 60px' }}>
                <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <SkeletonLoader type="title" width="300px" />
                        <SkeletonLoader type="text" width="500px" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[1, 2, 3].map(i => <SkeletonLoader key={i} height="50px" borderRadius="14px" />)}
                        </div>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="settings-page" style={{ padding: '120px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px' }}>Account Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your personal information, security, and preferences.</p>
                </div>

                {message && (
                    <div style={{ 
                        padding: '1rem', 
                        borderRadius: '12px', 
                        marginBottom: '2rem',
                        background: message.type === 'success' ? 'rgba(0,200,83,0.1)' : 'rgba(255,82,82,0.1)',
                        border: message.type === 'success' ? '1px solid #00C853' : '1px solid #FF5252',
                        color: message.type === 'success' ? '#00C853' : '#FF5252',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {message.text}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{ 
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px', 
                                    borderRadius: '14px', border: 'none', cursor: 'pointer', textAlign: 'left',
                                    background: activeTab === tab.id ? 'var(--gradient)' : 'rgba(255,255,255,0.03)',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                    fontWeight: '700', transition: '0.3s'
                                }}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        {activeTab === 'profile' && (
                            <div className="tab-content">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <div style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            borderRadius: '50%', 
                                            background: 'var(--gradient)', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            fontSize: '2rem', 
                                            fontWeight: '900', 
                                            color: 'white',
                                            overflow: 'hidden',
                                            border: '4px solid rgba(255,255,255,0.05)'
                                        }}>
                                            {profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                profile.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <label htmlFor="avatar-upload" style={{ 
                                            position: 'absolute', 
                                            bottom: '-5px', 
                                            right: '-5px', 
                                            background: 'var(--primary)', 
                                            padding: '8px', 
                                            borderRadius: '50%', 
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                            border: '2px solid #0a0a0a'
                                        }}>
                                            <Camera size={16} color="white" />
                                            <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '4px' }}>{profile.full_name || 'Your Profile'}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Full Name</label>
                                        <input 
                                            type="text" 
                                            className="nav-search-wrapper" 
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)' }} 
                                            value={profile.full_name}
                                            onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Bio</label>
                                        <textarea 
                                            className="nav-search-wrapper" 
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)', minHeight: '100px', borderRadius: '12px' }} 
                                            placeholder="Tell us about yourself..."
                                            value={profile.bio}
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                        ></textarea>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Twitter URL</label>
                                            <input 
                                                type="text" 
                                                placeholder="https://twitter.com/..."
                                                className="nav-search-wrapper" 
                                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)', borderRadius: '12px' }} 
                                                value={socialLinks.twitter}
                                                onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>LinkedIn URL</label>
                                            <input 
                                                type="text" 
                                                placeholder="https://linkedin.com/in/..."
                                                className="nav-search-wrapper" 
                                                style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)', borderRadius: '12px' }} 
                                                value={socialLinks.linkedin}
                                                onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Personal Website</label>
                                        <input 
                                            type="text" 
                                            placeholder="https://example.com"
                                            className="nav-search-wrapper" 
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)', borderRadius: '12px' }} 
                                            value={socialLinks.website}
                                            onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
                                        />
                                    </div>
                                    <button onClick={handleProfileUpdate} className="btn-primary" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Update Profile
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="tab-content">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShieldCheck size={24} color="var(--primary)" /> Update Password
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>New Password</label>
                                        <div className="nav-search-wrapper" style={{ padding: '0 15px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center' }}>
                                            <Lock size={18} color="var(--text-muted)" />
                                            <input 
                                                type={showNewPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                style={{ width: '100%', padding: '12px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }} 
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
                                        <div className="nav-search-wrapper" style={{ padding: '0 15px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center' }}>
                                            <Lock size={18} color="var(--text-muted)" />
                                            <input 
                                                type={showConfirmPassword ? "text" : "password"} 
                                                placeholder="••••••••" 
                                                style={{ width: '100%', padding: '12px', background: 'transparent', color: 'white', border: 'none', outline: 'none' }} 
                                                value={passwords.confirm}
                                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    <button onClick={handlePasswordUpdate} className="btn-primary" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />} Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="tab-content">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Email Preferences</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Platform Notifications</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get notified about your tool status and account activities.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.email_notifications} 
                                            onChange={(e) => setPreferences({...preferences, email_notifications: e.target.checked})}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1rem', fontWeight: '700' }}>Newsletter & Updates</h4>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Receive weekly digests of the best new AI tools.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            checked={preferences.newsletter} 
                                            onChange={(e) => setPreferences({...preferences, newsletter: e.target.checked})}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                    </div>
                                    <button onClick={handleProfileUpdate} className="btn-primary" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Preferences
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
