import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import { ArrowLeft, ExternalLink, Star, Share2, Heart, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { sendNotification } from '../utils/notifications';
import ReviewsSection from '../components/ReviewsSection';
import ReportToolModal from '../components/ReportToolModal';
import Breadcrumbs from '../components/Breadcrumbs';
import { Flag } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const ToolDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get user from AuthContext
    const { showToast } = useToast(); // Get showToast from ToastContext
    const [tool, setTool] = useState(null);
    const [relatedTools, setRelatedTools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFavorited, setIsFavorited] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Tool
                const { data, error } = await supabase
                    .from('tools')
                    .select('id, name, slug, description, short_description, image_url, url, pricing_type, rating, reviews_count, is_featured, is_verified, category_id, view_count, features, video_url, screenshots, categories(name)')
                    .eq('slug', id)
                    .single();
                
                if (error) throw error;
                setTool(data);

                // Parallel Fetching: Favorites, Related Tools, Increment View
                const promises = [
                    supabase.from('tools')
                        .select('id, name, slug, short_description, image_url, rating, reviews_count, is_verified, categories(name)')
                        .eq('category_id', data.category_id)
                        .neq('id', data.id)
                        .limit(3),
                    supabase.from('tools')
                        .update({ view_count: (data.view_count || 0) + 1 })
                        .eq('id', data.id)
                ];

                if (user) {
                    promises.push(
                        supabase.from('favorites')
                            .select('id')
                            .eq('user_id', user.id)
                            .eq('tool_id', data.id)
                            .maybeSingle()
                    );
                }

                const results = await Promise.all(promises);
                
                setRelatedTools(results[0].data || []);
                if (user && results[2]?.data) {
                    setIsFavorited(true);
                }

            } catch (error) {
                console.error('Error fetching tool detail:', error);
                showToast('Error loading tool: ' + error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, showToast]);

    const toggleFavorite = async () => {
        if (!user) {
            navigate('/auth');
            return;
        }

        try {
            if (isFavorited) {
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('tool_id', tool.id);
                if (error) throw error;
                setIsFavorited(false);
                showToast('Removed from favorites', 'info');
            } else {
                const { error } = await supabase
                    .from('favorites')
                    .insert([{ user_id: user.id, tool_id: tool.id }]);
                if (error) throw error;
                setIsFavorited(true);
                
                // Persistent Notification
                await sendNotification(
                    user.id, 
                    'Added to Favorites', 
                    `You added ${tool.name} to your favorites list.`,
                    'info'
                );

                showToast('Success! Added to your favorites. 🎉', 'success');
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showToast('Failed to save favorite.', 'error');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: tool.name,
                    text: tool.short_description,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            showToast('Link copied to clipboard! 📋', 'success');
        }
    };

    useSEO({
        title: tool?.name,
        description: tool?.description,
        image: tool?.image_url,
        url: typeof window !== 'undefined' ? window.location.href : ''
    });

    if (loading) {
        return (
            <div className="page-wrapper tool-detail-page">
                <header className="tool-detail-header" style={{ paddingTop: '140px', paddingBottom: '60px', borderBottom: '1px solid var(--border)' }}>
                    <div className="main-section">
                        <div className="tool-header-flex" style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
                            <SkeletonLoader type="avatar" width="140px" height="140px" borderRadius="24px" />
                            <div style={{ flex: 1 }}>
                                <SkeletonLoader type="text" width="100px" height="20px" style={{ marginBottom: '1rem' }} />
                                <SkeletonLoader type="title" width="60%" style={{ marginBottom: '1rem' }} />
                                <SkeletonLoader type="text" width="80%" height="24px" />
                            </div>
                        </div>
                    </div>
                </header>
                <section className="main-section" style={{ paddingTop: '5rem' }}>
                    <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
                        <div>
                            <SkeletonLoader type="title" width="40%" style={{ marginBottom: '2rem' }} />
                            <SkeletonLoader type="text" height="100px" style={{ marginBottom: '4rem' }} />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <SkeletonLoader height="150px" />
                                <SkeletonLoader height="150px" />
                            </div>
                        </div>
                        <SkeletonLoader height="400px" borderRadius="24px" />
                    </div>
                </section>
            </div>
        );
    }

    if (!tool) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Tool <span className="gradient-text">Not Found</span></h2>
                <Link to="/tools" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Directory</Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper tool-detail-page">
            <header className="tool-detail-header" style={{ paddingTop: '140px', paddingBottom: '60px', borderBottom: '1px solid var(--border)' }}>
                <div className="main-section">
                    <Breadcrumbs items={[
                        { label: 'Directory', link: '/tools' },
                        { label: tool.categories?.name, link: `/category/${tool.categories?.slug}` },
                        { label: tool.name }
                    ]} />
                    <button onClick={() => navigate(-1)} className="btn-text" style={{ marginBottom: '2rem' }}>
                        <ArrowLeft size={18} /> Back to Search
                    </button>
                    
                    <div className="tool-header-flex" style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="tool-logo-large glass-card" style={{ 
                            width: '140px', 
                            height: '140px', 
                            background: 'rgba(255, 255, 255, 0.03)', 
                            borderRadius: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontSize: '3rem', 
                            fontWeight: '900', 
                            color: 'white',
                            overflow: 'hidden',
                            padding: '0',
                            border: '1px solid var(--border)'
                        }}>
                             {tool.image_url ? (
                                 <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                             ) : (
                                 getIcon(tool.icon_name || 'Zap', 60)
                             )}
                        </div>
                        <div className="tool-header-info" style={{ flex: 1 }}>
                            <div className="badge">{tool.categories?.name}</div>
                            <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {tool.name}
                                {tool.is_verified && <CheckCircle2 size={32} color="#00d2ff" fill="rgba(0,210,255,0.1)" title="Verified Tool" />}
                            </h1>
                            <p className="tool-short-desc" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px' }}>{tool.short_description}</p>
                        </div>
                        <div className="tool-header-actions" style={{ display: 'flex', gap: '1rem' }}>
                             <a 
                                href={tool.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-primary" 
                                style={{ padding: '1.2rem 2.5rem' }}
                             >
                                Visit Website <ExternalLink size={18} />
                            </a>
                            <button 
                                className="icon-btn" 
                                onClick={toggleFavorite}
                                title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                                style={{ 
                                    height: '62px', width: '62px', borderRadius: '16px',
                                    color: isFavorited ? '#ff4757' : 'white',
                                    borderColor: isFavorited ? '#ff475733' : ''
                                }}
                            >
                                <Heart size={24} fill={isFavorited ? '#ff4757' : 'none'} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <section className="main-section" style={{ paddingTop: '5rem' }}>
                <div className="tool-grid-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '4rem' }}>
                    {/* Main Content */}
                    <div className="tool-main-info">
                        <div className="detail-section" style={{ marginBottom: '4rem' }}>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>About <span className="gradient-text">{tool.name}</span></h3>
                            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>{tool.description}</p>
                        </div>

                        <div className="detail-section" style={{ marginBottom: '4rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem' }}>Key Features</h3>
                            <div className="features-checklist" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                                {tool.features?.map((feature, i) => (
                                    <div key={i} className="glass-card" style={{ padding: '1.5rem', border: '1px solid rgba(0, 210, 255, 0.1)' }}>
                                        <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><CheckCircle2 size={24} /></div>
                                        <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{feature}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="tool-sidebar">
                        <div className="glass-card sidebar-card" style={{ position: 'sticky', top: '120px' }}>
                            <h4 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Tool Info</h4>
                            <div className="info-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Pricing</span>
                                    <span style={{ fontWeight: '700' }}>{tool.pricing_type} {tool.pricing_details ? `(${tool.pricing_details})` : ''}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Rating</span>
                                    <span style={{ fontWeight: '700', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <Star size={16} fill="#ffc107" /> {tool.rating} ({tool.reviews_count})
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Status</span>
                                    <span style={{ fontWeight: '700', color: 'var(--primary)' }}>{tool.is_featured ? 'Featured' : 'Popular'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Safety</span>
                                    <span style={{ fontWeight: '700', color: '#00e676', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <ShieldCheck size={16} /> {tool.is_verified ? 'Verified' : 'Safe to Use'}
                                    </span>
                                </div>
                            </div>
                            
                            <hr style={{ border: 'none', height: '1px', background: 'var(--border)', margin: '2rem 0' }} />
                            
                            <div className="share-section">
                                <p style={{ fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '700' }}>Share this tool</p>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button 
                                        className="icon-btn" 
                                        onClick={handleShare}
                                        style={{ flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    >
                                        <Share2 size={18} /> Share
                                    </button>
                                    <button 
                                        className="icon-btn" 
                                        onClick={toggleFavorite}
                                        style={{ 
                                            flex: 1, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                                            color: isFavorited ? '#ff4757' : '',
                                            background: isFavorited ? 'rgba(255, 71, 87, 0.05)' : ''
                                        }}
                                    >
                                        <Heart size={18} fill={isFavorited ? '#ff4757' : 'none'} /> {isFavorited ? 'Saved' : 'Save'}
                                    </button>
                                </div>
                                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                                    <button 
                                        onClick={() => setIsReportModalOpen(true)}
                                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', width: '100%' }}
                                    >
                                        <Flag size={12} /> Report this tool
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Related Tools */}
                {relatedTools.length > 0 && (
                    <div className="related-section" style={{ marginTop: '8rem', paddingBottom: '5rem' }}>
                        <div className="section-header-row">
                            <h2 className="section-title">Related <span className="gradient-text">AI Tools</span></h2>
                            <Link to="/tools" className="view-all-link">Browse Directory</Link>
                        </div>
                        <div className="featured-tools-grid">
                            {relatedTools.map(rTool => (
                                <Link to={`/tool/${rTool.slug}`} key={rTool.id} className="glass-card tool-card-premium" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="card-badge" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
                                        <div className="tool-tag">{rTool.categories?.name}</div>
                                    </div>
                                    <div className="tool-logo-box" style={{ 
                                        width: '60px', 
                                        height: '60px', 
                                        background: 'var(--gradient)', 
                                        borderRadius: '16px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        color: 'white',
                                        marginBottom: '1.5rem'
                                    }}>
                                        {getIcon(rTool.icon_name || 'Zap')}
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>{rTool.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>{rTool.short_description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Reviews Section */}
                {tool && tool.id && <ReviewsSection toolId={tool.id} />}
            </section>
            
            {/* Modals */}
            {isReportModalOpen && (
                <ReportToolModal 
                    toolId={tool.id} 
                    toolName={tool.name} 
                    onClose={() => setIsReportModalOpen(false)} 
                />
            )}
        </div>
    );
};

export default ToolDetail;
