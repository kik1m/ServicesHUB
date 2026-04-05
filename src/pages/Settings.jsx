import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
    User, Lock, Bell, Save, Camera, ShieldCheck, Loader2, 
    Eye, EyeOff, Globe, Twitter, Linkedin, Github, ExternalLink,
    Mail, CreditCard, ChevronRight, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';

const Settings = () => {
    const navigate = useNavigate();
    const { user: authUser, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const [profile, setProfile] = useState({
        full_name: '',
        bio: '',
        role: '',
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

    useEffect(() => {
        if (authLoading) return;
        if (!authUser) {
            navigate('/auth');
            return;
        }
        
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authUser.id)
                    .maybeSingle(); // Better than single() as it returns null instead of 406 if empty
                
                if (error && error.code !== 'PGRST116') throw error;
                if (data) {
                    setProfile({
                        full_name: data.full_name || '',
                        bio: data.bio || '',
                        role: data.role || '',
                        avatar_url: data.avatar_url || '',
                        website: data.website || '',
                        twitter: data.twitter || '',
                        github: data.github || '',
                        linkedin: data.linkedin || ''
                    });
                }
            } catch (err) {
                console.error('Settings fetch error:', err);
                // Don't show toast for "not found" as it's normal for new users
                if (err.code !== 'PGRST116') {
                    showToast('Error loading profile data.', 'error');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, authUser, authLoading, showToast]);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: authUser.id,
                    full_name: profile.full_name,
                    bio: profile.bio,
                    role: profile.role,
                    avatar_url: profile.avatar_url,
                    website: profile.website,
                    twitter: profile.twitter,
                    github: profile.github,
                    linkedin: profile.linkedin,
                    updated_at: new Date().toISOString()
                });
            
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
            const fileName = `${authUser.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('tool-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('tool-images')
                .getPublicUrl(filePath);

            setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
            
            await supabase.from('profiles').upsert({ id: authUser.id, avatar_url: publicUrl });
            showToast('Avatar updated successfully!', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
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
            showToast('Password updated successfully!', 'success');
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Public Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Safety & Privacy', icon: <ShieldCheck size={18} /> },
        { id: 'billing', label: 'Billing & Plans', icon: <CreditCard size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ];

    if (loading) {
        return (
            <div className="settings-view" style={{ padding: '120px 5% 60px' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    return (
        <div className="settings-view" style={{ padding: '80px 5% 60px' }}>
            <div className="container" style={{ maxWidth: '1100px' }}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard', path: '/dashboard' }, { label: 'Settings' }]} />
                
                <div className="settings-header" style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '8px' }}>Account <span className="gradient-text">Settings</span></h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your professional identity, security preferences, and data.</p>
                </div>

                <div className="settings-layout" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }}>
                    {/* Navigation Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {tabs.map(tab => (
                            <button 
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                                style={{ 
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '14px 20px', borderRadius: '16px', border: '1px solid transparent',
                                    cursor: 'pointer', transition: '0.3s', textAlign: 'left',
                                    background: activeTab === tab.id ? 'var(--gradient)' : 'rgba(255,255,255,0.02)',
                                    color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                    fontWeight: '700', fontSize: '0.9rem'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {tab.icon}
                                    {tab.label}
                                </div>
                                <ChevronRight size={16} style={{ opacity: activeTab === tab.id ? 1 : 0 }} />
                            </button>
                        ))}
                    </aside>

                    {/* Main Content Area */}
                    <main>
                        {activeTab === 'profile' && (
                            <form onSubmit={handleProfileUpdate} className="fade-in">
                                <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2rem', backdropFilter: 'blur(20px)' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2.5rem' }}>Personal Information</h3>
                                    
                                    {/* Avatar Section */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '3rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border)' }}>
                                        <div style={{ position: 'relative' }}>
                                            <div style={{ 
                                                width: '110px', height: '110px', borderRadius: '24px', 
                                                background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '2.8rem', fontWeight: '900', color: 'white', overflow: 'hidden',
                                                border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                                            }}>
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    profile.full_name?.charAt(0) || authUser?.email?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <label htmlFor="avatar-upload" style={{ 
                                                position: 'absolute', bottom: '-8px', right: '-8px', 
                                                background: 'var(--primary)', padding: '10px', borderRadius: '12px', 
                                                cursor: 'pointer', boxShadow: '0 8px 15px rgba(0,210,255,0.3)', border: '2px solid var(--bg-dark)'
                                            }}>
                                                <Camera size={18} color="white" />
                                                <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} />
                                            </label>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>Profile Picture</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Recommend 400x400 JPG or PNG.</p>
                                            <label htmlFor="avatar-upload" style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>Change Avatar</label>
                                        </div>
                                    </div>

                                    {/* Form Grid */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div className="input-group">
                                            <label className="settings-label">Full Name</label>
                                            <input 
                                                type="text" 
                                                className="settings-input"
                                                value={profile.full_name}
                                                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                                                placeholder="e.g. John Doe"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="settings-label">Professional Role</label>
                                            <input 
                                                type="text" 
                                                className="settings-input"
                                                value={profile.role}
                                                onChange={(e) => setProfile({...profile, role: e.target.value})}
                                                placeholder="e.g. AI Researcher / SaaS Owner"
                                            />
                                        </div>
                                    </div>

                                    <div className="input-group" style={{ marginBottom: '3rem' }}>
                                        <label className="settings-label">Short Bio</label>
                                        <textarea 
                                            className="settings-input"
                                            style={{ minHeight: '120px', resize: 'none' }}
                                            value={profile.bio}
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                            placeholder="Write a brief intro for your public profile..."
                                        />
                                    </div>

                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2.5rem' }}>Online Presence</h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div className="input-group">
                                            <label className="settings-label">
                                                <Globe size={14} /> Website
                                            </label>
                                            <input 
                                                type="url" 
                                                className="settings-input"
                                                value={profile.website}
                                                onChange={(e) => setProfile({...profile, website: e.target.value})}
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="settings-label">
                                                <Twitter size={14} /> Twitter (X)
                                            </label>
                                            <input 
                                                type="text" 
                                                className="settings-input"
                                                value={profile.twitter}
                                                onChange={(e) => setProfile({...profile, twitter: e.target.value})}
                                                placeholder="Username"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="settings-label">
                                                <Github size={14} /> GitHub
                                            </label>
                                            <input 
                                                type="text" 
                                                className="settings-input"
                                                value={profile.github}
                                                onChange={(e) => setProfile({...profile, github: e.target.value})}
                                                placeholder="Username"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label className="settings-label">
                                                <Linkedin size={14} /> LinkedIn
                                            </label>
                                            <input 
                                                type="text" 
                                                className="settings-input"
                                                value={profile.linkedin}
                                                onChange={(e) => setProfile({...profile, linkedin: e.target.value})}
                                                placeholder="Username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px' }}>
                                    <button type="submit" disabled={saving} className="btn-primary-slim" style={{ padding: '12px 35px', borderRadius: '14px', fontSize: '1rem' }}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} Save Changes
                                    </button>
                                </div>
                            </form>
                        )}

                        {activeTab === 'security' && (
                            <form onSubmit={handlePasswordUpdate} className="fade-in">
                                <div className="glass-card" style={{ padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '2.5rem' }}>Safety & Privacy</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div className="input-group">
                                            <label className="settings-label">New Password</label>
                                            <div className="settings-input-wrapper" style={{ position: 'relative' }}>
                                                <input 
                                                    type={showNewPassword ? "text" : "password"} 
                                                    className="settings-input"
                                                    value={passwords.new}
                                                    onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                                    placeholder="Minimum 6 characters"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="visibility-toggle"
                                                >
                                                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="input-group">
                                            <label className="settings-label">Confirm New Password</label>
                                            <div className="settings-input-wrapper" style={{ position: 'relative' }}>
                                                <input 
                                                    type={showConfirmPassword ? "text" : "password"} 
                                                    className="settings-input"
                                                    value={passwords.confirm}
                                                    onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                                    placeholder="Re-type new password"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="visibility-toggle"
                                                >
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div style={{ padding: '1rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.1)', display: 'flex', gap: '12px' }}>
                                            <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Use a strong password. We recommend a mix of letters, numbers, and symbols to keep your account safe.
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                                        <button type="submit" disabled={saving} className="btn-primary-slim" style={{ padding: '10px 30px', borderRadius: '14px' }}>
                                            {saving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}

                        {activeTab === 'billing' && (
                            <div className="fade-in">
                                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                                    <div style={{ 
                                        width: '80px', height: '80px', borderRadius: '20px', background: 'rgba(56, 189, 248, 0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem',
                                        color: 'var(--primary)'
                                    }}>
                                        <CreditCard size={40} />
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px' }}>Subscription Plan</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                                        You are currently on the <span style={{ color: 'white', fontWeight: '700' }}>{profile.membership || 'Free'}</span> plan. 
                                        Upgrade to unlock premium features and increase your visibility.
                                    </p>
                                    <a href="/premium" className="btn-primary-slim" style={{ 
                                        padding: '14px 40px', borderRadius: '14px', display: 'inline-flex', 
                                        alignItems: 'center', gap: '10px', textDecoration: 'none', background: 'var(--gradient)',
                                        color: 'white', fontWeight: '800', fontSize: '1rem',
                                        boxShadow: '0 10px 20px rgba(0,210,255,0.2)'
                                    }}>
                                        <Sparkles size={18} /> Upgrade Account
                                    </a>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="fade-in">
                                <div className="glass-card" style={{ padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Notification Preferences</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                                        Manage how you want to be notified about activity on your account and tools.
                                    </p>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {[
                                            { id: 'email_notif', label: 'Email Notifications', desc: 'Receive important updates via your registered email.' },
                                            { id: 'review_notif', label: 'New Review Alerts', desc: 'Get notified when someone leaves a review on your tools.' },
                                            { id: 'promo_notif', label: 'Promotion Updates', desc: 'Receive alerts about your active tool promotions and status.' }
                                        ].map(item => (
                                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                                <div>
                                                    <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>{item.label}</h4>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                                                </div>
                                                {/* Mock Toggle Switch */}
                                                <div style={{ 
                                                    width: '50px', height: '26px', borderRadius: '20px', 
                                                    background: 'var(--gradient)', position: 'relative', cursor: 'pointer',
                                                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
                                                }}>
                                                    <div style={{ 
                                                        width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                                                        position: 'absolute', top: '3px', right: '3px', transition: '0.3s'
                                                    }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(255, 171, 0, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 171, 0, 0.1)', display: 'flex', gap: '12px' }}>
                                        <Bell size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            Note: Real-time notifications are currently active. Permanent notification history is coming soon!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .settings-view {
                    min-height: 100vh;
                }
                .settings-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 0.85rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .settings-input {
                    width: 100%;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1.5px solid var(--border);
                    padding: 14px 18px;
                    border-radius: 14px;
                    color: white;
                    font-size: 0.95rem;
                    outline: none;
                    transition: all 0.3s;
                }
                .settings-input:focus {
                    border-color: var(--primary);
                    background: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 0 20px rgba(0, 136, 204, 0.2);
                }
                .settings-tab-btn:hover:not(.active) {
                    background: rgba(255, 255, 255, 0.05) !important;
                    color: var(--text-main) !important;
                    transform: translateX(4px);
                }
                .visibility-toggle {
                    position: absolute;
                    right: 15px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .visibility-toggle:hover {
                    color: var(--primary);
                }
            `}} />
        </div>
    );
};

export default Settings;
