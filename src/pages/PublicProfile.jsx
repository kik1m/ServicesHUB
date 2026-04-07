import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';

// Import Modular Components
import PublicProfileHero from '../components/Profile/PublicProfileHero';
import ProfilePortfolio from '../components/Profile/ProfilePortfolio';
import ProfileNotFound from '../components/Profile/ProfileNotFound';

// Import Modular CSS
import '../styles/pages/PublicProfile.css';

const PublicProfile = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [tools, setTools] = useState([]);
    const [copied, setCopied] = useState(false);

    useSEO({
        title: profile ? `${profile.full_name}'s Professional Portfolio | HUBly` : 'Publisher Profile | HUBly',
        description: profile?.bio || 'Discover high-quality AI tools and services published by this creator on HUBly.',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPublicData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // Fetch Approved Tools
                const { data: toolsData, error: toolsError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('user_id', id)
                    .eq('is_approved', true)
                    .order('created_at', { ascending: false });

                if (toolsError) throw toolsError;
                setTools(toolsData || []);

            } catch (err) {
                console.error('Error fetching public profile:', err);
                showToast('User not found or error loading data.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPublicData();
    }, [id, showToast]);

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setCopied(true);
        showToast('Profile link copied!', 'success');
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="public-profile-view container" style={{ padding: '100px 5% 60px' }}>
                <SkeletonLoader height="220px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3].map(i => <SkeletonLoader key={i} height="300px" borderRadius="16px" />)}
                </div>
            </div>
        );
    }

    if (!profile) return <ProfileNotFound />;

    return (
        <div className="public-profile-view">
            <div className="container" style={{ padding: '80px 5% 60px' }}>
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Publishers', path: '/tools' }, { label: profile.full_name }]} />

                <PublicProfileHero 
                    profile={profile} 
                    toolCount={tools.length} 
                    handleCopyLink={handleCopyLink} 
                    copied={copied} 
                />

                <ProfilePortfolio tools={tools} />
            </div>
        </div>
    );
};

export default PublicProfile;
