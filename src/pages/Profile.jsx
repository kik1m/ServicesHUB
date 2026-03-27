import React, { useState, useEffect } from 'react';
import { User, Settings, Heart, MessageSquare, Award, Clock, Star, Edit3, LayoutGrid, LogOut, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                
                if (!user) {
                    navigate('/auth');
                    return;
                }

                let { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                
                // If profile doesn't exist, create it
                if (error && error.code === 'PGRST116') {
                    const { data: newProfile, error: insertError } = await supabase
                        .from('profiles')
                        .insert([
                            { 
                                id: user.id, 
                                full_name: user.user_metadata.full_name || user.email.split('@')[0], 
                                avatar_url: user.user_metadata.avatar_url,
                                membership: 'Free'
                            }
                        ])
                        .select()
                        .single();
                    
                    if (insertError) throw insertError;
                    data = newProfile;
                    error = null;
                } else if (error) {
                    throw error;
                }

                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const handleUpgrade = async () => {
        if (!profile) {
            alert('بيانات الملف الشخصي غير مكتملة، يرجى تحديث الصفحة.');
            return;
        }

        setUpgrading(true);
        try {
            console.log('Initiating upgrade for user:', profile.id);
            const { data: { session } } = await supabase.auth.getSession();
            
            // Allow calling production API from localhost for testing
            const apiBase = import.meta.env.DEV ? 'https://services-hub-kohl.vercel.app' : '';
            
            const { data } = await axios.post(`${apiBase}/api/create-checkout-session`, {
                userId: profile.id,
                planName: 'Premium',
                priceAmount: 20
            });

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Upgrade Error Detail:', error.response?.data || error.message);
            alert('فشل بدء عملية الترقية: ' + (error.response?.data?.error || 'يرجى المحاولة لاحقاً'));
        } finally {
            setUpgrading(false);
        }
    };

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div className="page-wrapper dashboard-wrapper">
             <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '30px' }}>
                <div className="hero-content">
                    <div className="profile-hero-main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div className="avatar-preview" style={{ 
                            width: '120px', 
                            height: '120px', 
                            background: 'var(--gradient)',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            boxShadow: '0 10px 30px var(--primary-glow)',
                            color: 'white'
                        }}>
                             {profile?.avatar_url ? (
                                 <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                             ) : (
                                 <User size={64} />
                             )}
                        </div>
                        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                            {profile?.full_name || 'Service'} <span className="gradient-text">Member</span>
                        </h1>
                        <p className="section-desc" style={{ fontSize: '0.9rem' }}>
                            {profile?.role || 'User'} • Member since {new Date(profile?.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </header>

            <section className="main-section profile-content">
                <div className="dashboard-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '3rem'
                }}>
                    <div className="glass-card stat-card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
                        <div className="cat-icon-wrapper" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}><Heart size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: '900' }}>--</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Saved Tools</p>
                        </div>
                    </div>
                    <div className="glass-card stat-card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
                        <div className="cat-icon-wrapper" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}><Star size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Active</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Account Status</p>
                        </div>
                    </div>
                    <div className="glass-card stat-card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem' }}>
                        <div className="cat-icon-wrapper" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}><Award size={24} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: '900' }}>{profile?.membership || 'Free'}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Plan Tier</p>
                        </div>
                    </div>
                </div>

                <div className="profile-layout-secondary" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="activity-feed">
                        <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Account <span className="gradient-text">Bio</span></h3>
                        </div>
                        <div className="glass-card activity-list" style={{ padding: '2rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            {profile?.bio || "No biography provided yet. Tell the community about yourself!"}
                        </div>
                    </div>

                    <div className="profile-sidebar">
                         <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Actions</h3>
                        </div>
                        <div className="glass-card settings-sidebar-card" style={{ padding: '1.5rem' }}>
                            {profile?.membership !== 'Premium' && (
                                <button 
                                    onClick={handleUpgrade}
                                    disabled={upgrading}
                                    className="btn-primary" 
                                    style={{ 
                                        width: '100%', 
                                        marginBottom: '1rem', 
                                        display: 'flex', 
                                        justifyContent: 'center', 
                                        alignItems: 'center',
                                        gap: '8px', 
                                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                                        color: '#000',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {upgrading ? <Loader2 className="animate-spin" size={16} /> : <Award size={16} />} 
                                    {upgrading ? 'Processing...' : 'Upgrade to Premium'}
                                </button>
                            )}
                            <Link to="/dashboard" className="btn-primary" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
                                <LayoutGrid size={16} /> Creator Dashboard
                            </Link>
                            <Link to="/settings" className="btn-secondary" style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                                <Edit3 size={16} /> Edit Profile
                            </Link>
                            <button 
                                onClick={handleSignOut}
                                className="btn-secondary" 
                                style={{ 
                                    width: '100%', 
                                    background: 'rgba(255, 71, 87, 0.1)', 
                                    border: '1px solid rgba(255, 71, 87, 0.2)',
                                    color: '#ff4757',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
