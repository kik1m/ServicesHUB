import React, { useState, useEffect } from 'react';
import { 
    User, Heart, Award, Star, Edit3, LayoutGrid, LogOut, Globe, Twitter, Linkedin, 
    CheckCircle2, TrendingUp, Sparkles, Mail, Calendar, Settings, Camera, Github, 
    MessageSquare, Shield, ExternalLink, ChevronRight
} from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Breadcrumbs from '../components/Breadcrumbs';
import ToolCard from '../components/ToolCard';

import useSEO from '../hooks/useSEO';

const Profile = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, signOut } = useAuth();
    const { showToast } = useToast();

    useSEO({
        title: user?.full_name ? `${user.full_name}'s Profile` : 'Member Profile',
        description: `View the profile and favorite tools of ${user?.full_name || 'a member'} on ServicesHUB.`,
        url: window.location.href
    });

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites');
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchProfileData = async () => {
            try {
                // Fetch additional profile data and favorites
                const [profileRes, favsRes] = await Promise.all([
                    supabase.from('profiles')
                        .select('full_name, avatar_url, bio, role, website, twitter, github, linkedin, is_premium')
                        .eq('id', user.id)
                        .maybeSingle(),
                    supabase.from('favorites')
                        .select('tool_id, tools(*, categories(name))')
                        .eq('user_id', user.id)
                ]);

                if (profileRes.error) console.error('Profile Fetch Error:', profileRes.error);
                if (favsRes.error) console.error('Favorites Fetch Error:', favsRes.error);

                setProfile({ ...user, ...(profileRes.data || {}) });
                setFavorites((favsRes.data || []).map(f => f.tools).filter(Boolean));

            } catch (error) {
                console.error('Profile Data Fetch Exception:', error);
            } finally {
                setLoading(false);
                setLoadingFavorites(false);
            }
        };

        fetchProfileData();
        return () => {};
    }, [user, authLoading, navigate]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            showToast('Error signing out', 'error');
        } else {
            navigate('/');
        }
    };

    if (loading || authLoading) {
        return (
            <div className="profile-page" style={{ padding: '100px 5% 60px' }}>
                <div className="container">
                    <SkeletonLoader height="200px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page" style={{ padding: '80px 5% 60px' }}>
            <div className="container">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} />

                {/* Profile Header - Slim Design */}
                <div className="glass-card hero-section-slim" style={{ marginBottom: '2.5rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        {/* Avatar Section */}
                        <div style={{ position: 'relative' }}>
                            <div style={{ 
                                width: '100px', height: '100px', borderRadius: '24px', 
                                background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2.5rem', fontWeight: '900', color: 'white', overflow: 'hidden',
                                border: '2px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                            }}>
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    user.email?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <button className="icon-btn-small" style={{ 
                                position: 'absolute', bottom: '-5px', right: '-5px', 
                                background: 'var(--primary)', color: 'white', border: 'none',
                                width: '32px', height: '32px', borderRadius: '10px'
                            }}>
                                <Camera size={14} />
                            </button>
                        </div>

                        {/* User Info Section */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>{profile?.full_name || 'Anonymous User'}</h1>
                                {profile?.is_premium && <Sparkles size={20} color="#FFD700" title="Premium Member" />}
                                <span style={{ 
                                    background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '20px', 
                                    fontSize: '0.7rem', fontWeight: '600', color: 'var(--text-muted)'
                                }}>
                                    ID: {user.id.substring(0, 8)}...
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={14} /> {user.email}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> Joined {new Date(profile?.created_at || user.created_at).getFullYear()}</span>
                            </p>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <Link to={`/u/${user.id}`} className="btn-secondary" style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <ExternalLink size={14} /> View Public Profile
                                </Link>
                                <Link to="/dashboard" className="btn-text" style={{ fontSize: '0.85rem' }}>Creator Dashboard</Link>
                                <button onClick={handleSignOut} style={{ background: 'transparent', border: 'none', color: '#ff4757', marginLeft: 'auto', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', padding: '0 10px' }}>
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        </div>

                        {/* Compact Stats */}
                        <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem 1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{favorites.length}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Saved</div>
                            </div>
                            <div style={{ width: '1px', background: 'var(--border)', opacity: 0.2 }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--secondary)' }}>0</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-grid-slim">
                    {/* Main Content Area */}
                    <main>
                        <div style={{ display: 'flex', gap: '2.5rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                            <button 
                                onClick={() => setActiveTab('favorites')}
                                style={{ 
                                    padding: '1rem 0', background: 'none', border: 'none', color: activeTab === 'favorites' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: '800', fontSize: '0.95rem', borderBottom: activeTab === 'favorites' ? '3px solid var(--primary)' : '3px solid transparent',
                                    cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase', letterSpacing: '1px'
                                }}
                            >
                                My Collection ({favorites.length})
                            </button>
                            <button 
                                onClick={() => setActiveTab('reviews')}
                                style={{ 
                                    padding: '1rem 0', background: 'none', border: 'none', color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: '800', fontSize: '0.95rem', borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent',
                                    cursor: 'pointer', transition: '0.3s', textTransform: 'uppercase', letterSpacing: '1px'
                                }}
                            >
                                My Reviews (0)
                            </button>
                        </div>

                        {activeTab === 'favorites' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                {loadingFavorites ? (
                                    [1,2,3].map(i => <SkeletonLoader key={i} height="240px" borderRadius="16px" />)
                                ) : favorites.length > 0 ? (
                                    favorites.map(tool => (
                                        <ToolCard key={tool.id} tool={tool} />
                                    ))
                                ) : (
                                    <div className="glass-card compact-glass-card empty-state-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', opacity: 0.8 }}>
                                        <Heart size={64} style={{ marginBottom: '1.5rem', color: 'var(--primary)', opacity: 0.2 }} />
                                        <h4 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '10px', color: 'white' }}>Your collection is empty</h4>
                                        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Discover amazing AI tools and save them to your profile to build your personal toolkit.</p>
                                        <Link to="/tools" className="btn-primary" style={{ marginTop: '2.5rem', display: 'inline-flex', padding: '14px 32px', textDecoration: 'none', borderRadius: '14px' }}>Explore Directory</Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="glass-card compact-glass-card" style={{ textAlign: 'center', padding: '5rem', opacity: 0.6 }}>
                                <MessageSquare size={64} style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.1)' }} />
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No reviews yet</h4>
                                <p style={{ fontSize: '0.9rem' }}>Your feedback helps the community discover the best tools.</p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar Area */}
                    <aside>
                        <div className="glass-card compact-glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={18} color="var(--primary)" /> About Me
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                {profile?.bio || 'No bio provided yet. Add a bio in settings to tell the community about yourself.'}
                            </p>
                            
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Identity</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
                                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '6px', borderRadius: '8px' }}><Award size={14} color="var(--secondary)" /></div>
                                    {profile?.role || 'User / Seeker'}
                                </div>
                                {profile?.website && (
                                    <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', textDecoration: 'none' }} className="social-link-hover">
                                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '8px' }}><Globe size={14} /></div>
                                        Website <ExternalLink size={12} style={{ opacity: 0.5 }} />
                                    </a>
                                )}
                            </div>

                            <h4 style={{ fontSize: '0.85rem', marginBottom: '1rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Social Profiles</h4>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {profile?.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="social-icon-box"><Twitter size={16} /></a>}
                                {profile?.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="social-icon-box"><Github size={16} /></a>}
                                {profile?.linkedin && <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-icon-box"><Linkedin size={16} /></a>}
                                {!profile?.twitter && !profile?.github && !profile?.linkedin && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', italic: 'true' }}>No social links connected.</p>
                                )}
                            </div>
                        </div>

                        <div className="glass-card compact-glass-card" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', fontWeight: '800' }}>Membership</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: profile?.is_premium ? '1px solid rgba(255, 215, 0, 0.2)' : '1px solid var(--border)' }}>
                                <Shield size={24} color={profile?.is_premium ? '#FFD700' : 'var(--primary)'} />
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>{profile?.is_premium ? 'PREMIUM MEMBER' : 'FREE PLAN'}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{profile?.is_premium ? 'Elite Access Enabled' : 'Basic Community Access'}</div>
                                </div>
                            </div>
                            {!profile?.is_premium && (
                                <Link to="/premium" className="btn-primary" style={{ width: '100%', marginTop: '1.2rem', padding: '12px', fontSize: '0.8rem', fontWeight: '700', display: 'block', textAlign: 'center', textDecoration: 'none' }}>UPGRADE NOW</Link>
                            )}
                            
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                <Link to="/settings" className="btn-secondary" style={{ width: '100%', padding: '10px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}>
                                    <Settings size={14} /> Profile Settings
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .social-icon-box {
                    width: 42px;
                    height: 42px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-muted);
                    transition: all 0.3s ease;
                }
                .social-icon-box:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(0,210,255,0.2);
                }
                .social-link-hover:hover {
                    color: white !important;
                }
                .social-link-hover:hover div {
                    background: var(--secondary) !important;
                    color: white;
                }
                .profile-grid-slim {
                    display: grid;
                    grid-template-columns: 1.8fr 1fr;
                    gap: 3.5rem;
                    align-items: start;
                }
                .empty-state-card {
                    background: linear-gradient(135deg, rgba(255,255,255,0.01) 0%, rgba(255,255,255,0.03) 100%);
                    border: 1px dashed rgba(255,255,255,0.1) !important;
                }
                @media (max-width: 1100px) {
                    .profile-grid-slim {
                        grid-template-columns: 1fr;
                        gap: 2rem;
                    }
                    .hero-section-slim {
                        padding: 1.5rem !important;
                        text-align: center;
                    }
                    .hero-section-slim > div {
                        justify-content: center;
                    }
                }
            `}} />
        </div>
    );
};

export default Profile;
