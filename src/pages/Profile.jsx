import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import { MessageSquare } from 'lucide-react';

// Import Modular Components
import ProfileHero from '../components/Profile/ProfileHero';
import ProfileStats from '../components/Profile/ProfileStats';
import ProfileTabs from '../components/Profile/ProfileTabs';
import ProfileCollections from '../components/Profile/ProfileCollections';
import ProfileAboutSidebar from '../components/Profile/ProfileAboutSidebar';
import ProfileMembershipSidebar from '../components/Profile/ProfileMembershipSidebar';

// Import Modular CSS
import '../styles/Pages/Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();

    useSEO({
        title: user?.full_name ? `${user.full_name}'s Profile` : 'Member Profile',
        description: `View the profile and favorite tools of ${user?.full_name || 'a member'} on HUBly.`,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('favorites');
    const [loadingFavorites, setLoadingFavorites] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        if (!user) { navigate('/auth'); return; }

        const fetchProfileData = async () => {
            try {
                const [profileRes, favsRes] = await Promise.all([
                    supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
                    supabase.from('favorites').select('tool_id, tools(*, categories(name))').eq('user_id', user.id)
                ]);

                if (profileRes.error && profileRes.error.code !== 'PGRST116') throw profileRes.error;
                setProfile({ ...user, ...(profileRes.data || {}) });
                setFavorites((favsRes.data || []).map(f => f.tools).filter(Boolean));
            } catch (error) {
                console.error('Profile Fetch Error:', error);
            } finally {
                setLoading(false);
                setLoadingFavorites(false);
            }
        };
        fetchProfileData();
    }, [user, authLoading, navigate]);

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) showToast('Error signing out', 'error');
        else navigate('/');
    };

    if (loading || authLoading) {
        return (
            <div className="profile-page">
                <div className="profile-container">
                    <SkeletonLoader height="200px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
                    <div className="profile-grid-slim">
                        <SkeletonLoader height="400px" borderRadius="24px" />
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Profile' }]} />

                <ProfileHero profile={profile} user={user} handleSignOut={handleSignOut} />

                <div className="profile-grid-slim">
                    {/* Main Content Area */}
                    <main>
                        <div className="profile-main-header">
                            <ProfileTabs 
                                activeTab={activeTab} setActiveTab={setActiveTab} 
                                favoritesCount={favorites.length} 
                            />
                            <ProfileStats favoritesCount={favorites.length} />
                        </div>

                        {activeTab === 'favorites' && (
                            <ProfileCollections loadingFavorites={loadingFavorites} favorites={favorites} />
                        )}

                        {activeTab === 'reviews' && (
                            <div className="glass-card empty-state-card fade-in">
                                <MessageSquare size={64} className="empty-state-icon" />
                                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white' }}>No reviews yet</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Your feedback helps the community discover the best tools.</p>
                            </div>
                        )}
                    </main>

                    {/* Sidebar Area */}
                    <aside className="profile-sidebar-aside fade-in">
                        <ProfileAboutSidebar profile={profile} />
                        <ProfileMembershipSidebar profile={profile} />
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Profile;
