import React, { useState, useEffect } from 'react';
import { User, Settings, Heart, MessageSquare, Award, Clock, Star, Edit3, LayoutGrid, LogOut, Loader2, Globe, Twitter, Linkedin } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, signOut } = useAuth();
    const { showToast } = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [upgrading, setUpgrading] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            if (authLoading) return;
            if (!user) {
                navigate('/auth');
                return;
            }

            setLoading(true);
            try {

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

                    // Create Welcome Notification
                    await supabase.from('notifications').insert([{
                        user_id: user.id,
                        title: 'أهلاً بك في ServicesHUB! 🎉',
                        message: 'شكرًا لانضمامك إلينا. يمكنك الآن استكشاف أفضل الأدوات البرمجية وحفظ مفضلاتك والمزيد.',
                        type: 'info',
                        is_unread: true
                    }]);
                } else if (error) {
                    throw error;
                }

                setProfile(data);

                // Fetch Favorites
                if (user) {
                    const { data: favs } = await supabase
                        .from('favorites')
                        .select('*, tools(*, categories(name))')
                        .eq('user_id', user.id);
                    setFavorites(favs || []);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [navigate]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    const handleUpgrade = () => {
        navigate('/premium');
    };

    if (loading) {
        return (
            <div className="page-wrapper dashboard-wrapper">
                 <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '30px' }}>
                    <div className="hero-content">
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                             <SkeletonLoader type="avatar" />
                             <SkeletonLoader type="title" width="40%" style={{ marginTop: '1.5rem', marginBottom: '0.5rem' }} />
                             <SkeletonLoader type="text" width="20%" />
                        </div>
                    </div>
                </header>
                <section className="main-section profile-content">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <SkeletonLoader height="120px" borderRadius="16px" />
                        <SkeletonLoader height="120px" borderRadius="16px" />
                        <SkeletonLoader height="120px" borderRadius="16px" />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </section>
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
                        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {profile?.full_name || 'Member'}
                            {user?.is_premium && <Award size={24} color="#FFD700" title="Premium Member" />}
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
                        <div className="cat-icon-wrapper" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}><Heart size={24} color={favorites.length > 0 ? '#ff4757' : 'inherit'} /></div>
                        <div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: '900' }}>{favorites.length}</h4>
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
                    <div className="glass-card stat-card-premium" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '2rem', border: user?.is_premium ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid var(--border)' }}>
                        <div className="cat-icon-wrapper" style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '14px' }}>
                            <Award size={24} color={user?.is_premium ? '#FFD700' : 'inherit'} />
                        </div>
                        <div>
                            <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: user?.is_premium ? '#FFD700' : 'white' }}>
                                {user?.is_premium ? 'Premium 💎' : 'Free'}
                            </h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Plan Tier</p>
                        </div>
                    </div>
                </div>

                <div className="profile-layout-secondary" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    <div className="activity-feed">
                        <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>My <span className="gradient-text">Favorites</span></h3>
                        </div>
                        
                        {favorites.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                                {favorites.map(fav => fav.tools && (
                                    <Link key={fav.id} to={`/tool/${fav.tools?.slug || fav.id}`} className="glass-card" style={{ 
                                        padding: '1.5rem', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '1.5rem', 
                                        textDecoration: 'none', 
                                        color: 'inherit',
                                        transition: '0.2s',
                                        border: '1px solid var(--border)'
                                    }}>
                                        <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {fav.tools?.image_url ? (
                                                <img src={fav.tools.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <LayoutGrid size={24} color="var(--primary)" />
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{fav.tools?.name || 'Unknown Tool'}</h4>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fav.tools?.categories?.name || 'Misc'}</p>
                                        </div>
                                        <Star size={16} fill="#ffcc00" color="#ffcc00" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                                <Heart size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                <p>You haven't saved any tools yet.</p>
                                <Link to="/tools" className="btn-text" style={{ color: 'var(--primary)' }}>Explore Tools</Link>
                            </div>
                        )}

                        <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Account <span className="gradient-text">Bio</span></h3>
                        </div>
                        <div className="glass-card activity-list" style={{ padding: '2rem', fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem' }}>
                            {profile?.bio || "No biography provided yet. Tell the community about yourself!"}
                        </div>

                        {(profile?.website_url || profile?.twitter_url || profile?.linkedin_url) && (
                            <div className="social-presence">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Social <span className="gradient-text">Presence</span></h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    {profile?.website_url && (
                                        <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', border: '1px solid var(--border)' }}>
                                            <Globe size={18} color="var(--primary)" /> Website
                                        </a>
                                    )}
                                    {profile?.twitter_url && (
                                        <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', border: '1px solid var(--border)' }}>
                                            <Twitter size={18} color="#1DA1F2" /> Twitter
                                        </a>
                                    )}
                                    {profile?.linkedin_url && (
                                        <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'white', border: '1px solid var(--border)' }}>
                                            <Linkedin size={18} color="#0077B5" /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="profile-sidebar">
                         <div className="section-header-row" style={{ marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Actions</h3>
                        </div>
                        <div className="glass-card settings-sidebar-card" style={{ padding: '1.5rem' }}>
                            {!user?.is_premium && (
                                <button 
                                    onClick={handleUpgrade}
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
                                    <Award size={16} /> Upgrade to Premium
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
