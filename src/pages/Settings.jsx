import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Lock, Bell, Link as LinkIcon, Save, Camera, ShieldCheck, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    useEffect(() => {
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
                    updated_at: new Date()
                })
                .eq('id', user.id);
            
            if (error) throw error;
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwords.new !== passwords.confirm) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }
        setSaving(true);
        setMessage(null);
        try {
            const { error } = await supabase.auth.updateUser({ password: passwords.new });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ new: '', confirm: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> }
    ];

    if (loading) return <div style={{ padding: '120px 5%', textAlign: 'center' }}><Loader2 className="animate-spin" size={48} color="var(--primary)" /></div>;

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
                                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '900', color: 'white' }}>
                                            {profile.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{profile.full_name || 'Your Profile'}</h3>
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
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)', minHeight: '100px' }} 
                                            placeholder="Tell us about yourself..."
                                            value={profile.bio}
                                            onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                        ></textarea>
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
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="nav-search-wrapper" 
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)' }} 
                                            value={passwords.new}
                                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Confirm New Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            className="nav-search-wrapper" 
                                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border)' }} 
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                        />
                                    </div>
                                    <button onClick={handlePasswordUpdate} className="btn-primary" disabled={saving}>
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />} Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'notifications' && (
                            <div className="tab-content">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>System Preferences</h3>
                                <div style={{ padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--border)' }}>
                                    <Bell size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ color: 'var(--text-muted)' }}>Notification preferences are coming soon to your region.</p>
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
