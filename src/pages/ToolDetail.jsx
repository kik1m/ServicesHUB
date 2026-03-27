import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import { ArrowLeft, ExternalLink, Star, Share2, Heart, ShieldCheck, CheckCircle2, LayoutGrid, Zap, Loader2 } from 'lucide-react';

const ToolDetail = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const [tool, setTool] = useState(null);
    const [relatedTools, setRelatedTools] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchToolData = async () => {
            setLoading(true);
            try {
                // Fetch current tool
                const { data: toolData, error: toolError } = await supabase
                    .from('tools')
                    .select('*, categories(*)')
                    .eq('slug', slug)
                    .single();
                
                if (toolError) throw toolError;
                setTool(toolData);

                // Fetch related tools
                if (toolData) {
                    const { data: relatedData } = await supabase
                        .from('tools')
                        .select('*, categories(name)')
                        .eq('category_id', toolData.category_id)
                        .neq('id', toolData.id)
                        .eq('is_approved', true)
                        .limit(3);
                    setRelatedTools(relatedData || []);
                }
            } catch (error) {
                console.error('Error fetching tool details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchToolData();
    }, [slug]);

    if (loading) {
        return (
            <div className="page-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
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
                    <button onClick={() => navigate(-1)} className="btn-text" style={{ marginBottom: '2rem' }}>
                        <ArrowLeft size={18} /> Back to Search
                    </button>
                    
                    <div className="tool-header-flex" style={{ display: 'flex', gap: '3rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div className="tool-logo-large glass-card" style={{ 
                            width: '120px', 
                            height: '120px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            background: 'var(--gradient)',
                            color: 'white',
                            borderRadius: '30px'
                        }}>
                             {getIcon(tool.icon_name || 'Zap', 60)}
                        </div>
                        <div className="tool-header-info" style={{ flex: 1 }}>
                            <div className="badge">{tool.categories?.name}</div>
                            <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1rem', textAlign: 'left' }}>{tool.name}</h1>
                            <p className="tool-short-desc" style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '700px' }}>{tool.short_description}</p>
                        </div>
                        <div className="tool-header-actions" style={{ display: 'flex', gap: '1rem' }}>
                             <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '1.2rem 2.5rem' }}>
                                Visit Website <ExternalLink size={18} />
                            </a>
                            <button className="icon-btn" style={{ height: '62px', width: '62px', borderRadius: '16px' }}><Heart size={24} /></button>
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
                                    <button className="icon-btn" style={{ flex: 1, borderRadius: '12px' }}><Share2 size={18} /></button>
                                    <button className="icon-btn" style={{ flex: 1, borderRadius: '12px' }}><Zap size={18} /></button>
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
            </section>
        </div>
    );
};

export default ToolDetail;
