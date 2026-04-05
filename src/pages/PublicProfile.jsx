import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
    User, Globe, Twitter, Linkedin, Github, ExternalLink, 
    CheckCircle2, TrendingUp, Calendar, Mail, Share2, Check,
    LayoutGrid, Award, Sparkles, ShieldCheck
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import SkeletonLoader from '../components/SkeletonLoader';
import ToolCard from '../components/ToolCard';
import useSEO from '../hooks/useSEO';
import Breadcrumbs from '../components/Breadcrumbs';

const PublicProfile = () => {
    const { id } = useParams();
    const { showToast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [tools, setTools] = useState([]);
    const [copied, setCopied] = useState(false);

    useSEO({
        title: profile ? `${profile.full_name}'s Professional Portfolio | ServicesHUB` : 'Publisher Profile | ServicesHUB',
        description: profile?.bio || 'Discover high-quality AI tools and services published by this creator on ServicesHUB.',
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPublicData = async () => {
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

        if (id) fetchPublicData();
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
            <div className="page-wrapper" style={{ padding: '100px 5% 60px' }}>
                <div className="container">
                    <SkeletonLoader height="220px" borderRadius="24px" style={{ marginBottom: '2rem' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                        {[1, 2, 3].map(i => <SkeletonLoader key={i} height="300px" borderRadius="16px" />)}
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-wrapper" style={{ padding: '120px 5%', textAlign: 'center' }}>
                <User size={80} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Publisher not found</h2>
                <p style={{ color: 'var(--text-muted)' }}>The profile you are looking for does not exist or has been removed.</p>
                <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Return Home</Link>
            </div>
        );
    }

    return (
        <div className="public-profile-view" style={{ padding: '80px 5% 60px' }}>
            <div className="container">
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Publishers', path: '/tools' }, { label: profile.full_name }]} />

                {/* Profile Hero - High Density Slim Design */}
                <div className="glass-card public-hero-card" style={{ 
                    padding: '2.5rem', 
                    marginBottom: '3rem', 
                    display: 'flex', 
                    gap: '2.5rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    background: 'radial-gradient(circle at top right, rgba(0, 210, 255, 0.05), transparent 40%)',
                    overflow: 'hidden',
                    position: 'relative',
                    backdropFilter: 'blur(20px)'
                }}>

                    {/* Left: Avatar */}
                    <div style={{ position: 'relative' }}>
                        <div style={{ 
                            width: '120px', height: '120px', borderRadius: '24px', 
                            background: 'var(--gradient)', border: '2px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', fontWeight: '900', color: 'white', overflow: 'hidden',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.3)'
                        }}>
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                profile.full_name?.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div style={{ 
                            position: 'absolute', bottom: '-8px', right: '-8px', 
                            background: 'var(--bg-dark)', padding: '5px', borderRadius: '50%' 
                        }}>
                            <ShieldCheck size={24} color="var(--primary)" />
                        </div>
                    </div>

                    {/* Middle: Info */}
                    <div style={{ flex: 1, minWidth: '300px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <h1 style={{ fontSize: '2.4rem', fontWeight: '800' }}>{profile.full_name}</h1>
                            {profile.is_premium && <Sparkles size={22} color="#FFD700" title="Premium Publisher" />}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px', marginBottom: '1.2rem', alignItems: 'center' }}>
                            <span style={{ 
                                background: 'rgba(56, 189, 248, 0.1)', color: 'var(--secondary)', 
                                padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800',
                                textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}>
                                {profile.role || 'Verified Publisher'}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} /> Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '...'}
                            </span>
                        </div>

                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem', maxWidth: '650px', marginBottom: '1.5rem' }}>
                            {profile.bio || 'Professional creator and dedicated community member of ServicesHUB directory.'}
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noopener noreferrer" className="social-box-slim">
                                    <Globe size={18} />
                                </a>
                            )}
                            {profile.twitter && (
                                <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="social-box-slim">
                                    <Twitter size={18} />
                                </a>
                            )}
                            {profile.github && (
                                <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer" className="social-box-slim">
                                    <Github size={18} />
                                </a>
                            )}
                            {profile.linkedin && (
                                <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="social-box-slim">
                                    <Linkedin size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right: Stats & Share Stack */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '180px' }}>
                        <button 
                            onClick={handleCopyLink}
                            className="share-trigger-btn"
                            style={{ 
                                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', 
                                padding: '12px', borderRadius: '14px', cursor: 'pointer',
                                color: 'var(--text-muted)', transition: '0.3s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                width: '100%'
                            }}
                        >
                            {copied ? <Check size={18} color="#00e676" /> : <Share2 size={18} />}
                            <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>{copied ? 'Link Copied!' : 'Share Profile'}</span>
                        </button>
                        
                        <div style={{ 
                            background: 'rgba(255,255,255,0.02)', 
                            border: '1px solid var(--border)',
                            padding: '1.5rem', 
                            borderRadius: '24px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2.8rem', fontWeight: '900', color: 'var(--primary)', lineHeight: 1 }}>{tools.length}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '8px' }}>Tools Created</div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Published <span className="gradient-text">Portfolio</span></h2>
                        <div style={{ flex: 1, h: '1px', background: 'var(--border)', opacity: 0.5 }}></div>
                    </div>

                    {tools.length > 0 ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {tools.map(tool => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card compact-glass-card" style={{ padding: '6rem', textAlign: 'center', opacity: 0.6 }}>
                            <LayoutGrid size={64} style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.05)' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '700' }}>No active tools to show</h3>
                            <p style={{ maxWidth: '400px', margin: '10px auto 0' }}>This user has a profile but hasn't listed any tools in our directory yet.</p>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .public-profile-view {
                    min-height: 100vh;
                }
                .social-box-slim {
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 14px;
                    color: var(--text-muted);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .social-box-slim:hover {
                    background: var(--primary);
                    color: white;
                    transform: translateY(-4px);
                    box-shadow: 0 8px 20px rgba(0, 210, 255, 0.2);
                    border-color: var(--primary);
                }
                .share-trigger-btn:hover {
                    background: rgba(255,255,255,0.08) !important;
                    color: var(--text-main) !important;
                    border-color: var(--primary) !important;
                }
            `}} />
        </div>
    );
};

export default PublicProfile;
