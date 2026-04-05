import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, X, Check, Minus, ExternalLink, RefreshCcw, Star, ArrowRight, Scale, Plus } from 'lucide-react';
import SmartBanner from '../components/SmartBanner';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import SkeletonLoader from '../components/SkeletonLoader';
import { getIcon } from '../utils/iconMap';

const Compare = () => {
    const [tool1, setTool1] = useState(null);
    const [tool2, setTool2] = useState(null);
    const [isSelectingFor, setIsSelectingFor] = useState(null); // 'tool1' or 'tool2'
    const [searchQuery, setSearchQuery] = useState('');
    const [availableTools, setAvailableTools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useSEO({
        title: "Compare AI Tools | Side-by-Side Comparison",
        description: "Compare the best AI tools and services side-by-side to find the perfect fit for your workflow.",
        keywords: "compare ai tools, ai comparison, software comparison, services comparison"
    });

    useEffect(() => {
        if (!isSelectingFor) return;

        const fetchTools = async () => {
            setLoading(true);
            setError(null);
            try {
                let query = supabase.from('tools').select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, categories(name)').eq('is_approved', true);
                if (searchQuery) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }
                const { data, error: fetchError } = await query.limit(10);
                if (fetchError) throw fetchError;
                setAvailableTools(data || []);
            } catch (err) {
                console.error('Fetch comparison tools error:', err);
                setError('Failed to load tools. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchTools, 300);
        return () => clearTimeout(timer);
    }, [isSelectingFor, searchQuery]);

    const handleSelect = (tool) => {
        if (isSelectingFor === 'tool1') setTool1(tool);
        if (isSelectingFor === 'tool2') setTool2(tool);
        setIsSelectingFor(null);
        setSearchQuery('');
    };

    const resetComparison = () => {
        setTool1(null);
        setTool2(null);
    };

    const FeatureMatrix = () => {
        if (!tool1 || !tool2) return null;

        const allFeatures = Array.from(new Set([
            ...(tool1.features || []),
            ...(tool2.features || [])
        ]));

        return (
            <div className="feature-matrix glass-card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '800' }}>
                    Feature <span className="gradient-text">Comparison</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {allFeatures.length > 0 ? allFeatures.map((feature, i) => (
                        <div key={i} style={{ 
                            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', 
                            padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '10px', alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{feature}</span>
                            <div style={{ textAlign: 'center' }}>
                                {(tool1.features || []).includes(feature) ? <Check size={18} color="#00ffaa" /> : <Minus size={18} color="rgba(255,255,255,0.1)" />}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                {(tool2.features || []).includes(feature) ? <Check size={18} color="#00ffaa" /> : <Minus size={18} color="rgba(255,255,255,0.1)" />}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}> No specific features listed for comparison. </div>
                    )}
                </div>

                <div className="comparison-desc-grid" style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    <div className="comparison-desc">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '800' }}>About {tool1.name}</h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>{tool1.description}</p>
                    </div>
                    <div className="comparison-desc">
                        <h4 style={{ color: 'var(--primary)', marginBottom: '1rem', fontWeight: '800' }}>About {tool2.name}</h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: '1.7', color: 'var(--text-muted)' }}>{tool2.description}</p>
                    </div>
                </div>
            </div>
        );
    };

    const ToolColumn = ({ tool, slot }) => (
        <div className="compare-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tool ? (
                <div className="glass-card active-tool-card" style={{ padding: '1.5rem', textAlign: 'center', position: 'relative' }}>
                    <button onClick={() => slot === 1 ? setTool1(null) : setTool2(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} />
                    </button>
                    <div className="tool-logo-large" style={{ 
                        width: '80px', 
                        height: '80px', 
                        margin: '0 auto 1.2rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '20px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '2rem', 
                        fontWeight: '900', 
                        color: 'white',
                        overflow: 'hidden',
                        border: '1px solid var(--border)'
                    }}>
                        {tool.image_url ? (
                            <img src={tool.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            tool.name.charAt(0)
                        )}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.2rem' }}>{tool.name}</h3>
                    <div style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         {tool.categories?.name}
                         {tool.is_verified && <Star size={12} fill="var(--secondary)" color="var(--secondary)" />}
                    </div>
                    
                    <div className="compare-stats" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={16} fill="#ffc107" /> {tool.rating || '5.0'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '900' }}>{tool.reviews_count || '0'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reviews</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                         <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                             <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Pricing</div>
                             <div style={{ fontWeight: '800', fontSize: '1rem' }}>{tool.pricing_type}</div>
                         </div>
                         <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textDecoration: 'none', fontSize: '0.85rem', padding: '10px' }}>
                             Visit Site <ExternalLink size={14} />
                         </a>
                    </div>
                </div>
            ) : (
                <div 
                    className="glass-card select-tool-placeholder" 
                    onClick={() => setIsSelectingFor(slot === 1 ? 'tool1' : 'tool2')}
                    style={{ 
                        padding: '3rem 1.5rem', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        border: '2px dashed var(--border)',
                        background: 'rgba(255,255,255,0.01)',
                        borderRadius: '24px',
                        transition: '0.3s'
                    }}
                >
                    <div style={{ width: '70px', height: '70px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <Search size={30} />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem' }}>Select Tool {slot === 1 ? '#1' : '#2'}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose an AI tool to compare side-by-side.</p>
                </div>
            )}
        </div>
    );

    return (
        <div className="page-wrapper compare-page">
            <SmartBanner />
            <header className="page-header hero-section-slim">
                <div className="hero-content">
                    <Breadcrumbs items={[
                        { label: 'Directory', link: '/tools' },
                        { label: 'Comparison', link: '/compare' }
                    ]} />
                    <div className="badge">DECISION TOOL</div>
                    <h1 className="hero-title-slim">Compare <span className="gradient-text">AI Tools</span></h1>
                    <p className="hero-subtitle-slim">Make data-driven decisions by comparing features and pricing side-by-side.</p>
                </div>
            </header>

            <section className="main-section compare-main" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
                <div className="comparison-container" style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', position: 'relative' }}>
                    <ToolColumn tool={tool1} slot={1} />
                    
                    <div className="vs-divider" style={{ 
                        marginTop: '40px',
                        fontSize: '1.2rem',
                        fontWeight: '900',
                        color: 'var(--primary)',
                        padding: '10px',
                        background: 'rgba(0,136,204,0.1)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--primary)'
                    }}>VS</div>

                    <ToolColumn tool={tool2} slot={2} />
                </div>

                <FeatureMatrix />

                {tool1 && tool2 && (
                    <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                        <button onClick={resetComparison} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <RefreshCcw size={18} /> Reset Comparison
                        </button>
                    </div>
                )}
            </section>

            {/* Selection Modal */}
            {isSelectingFor && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                    <div className="glass-card modal-content" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ margin: 0 }}>Select a Tool</h3>
                            <button onClick={() => setIsSelectingFor(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        
                        <div className="nav-search-wrapper" style={{ marginBottom: '2rem', padding: '10px' }}>
                            <Search className="search-icon" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search tools..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', outline: 'none' }}
                            />
                        </div>

                        <div className="tool-select-list" style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {loading ? (
                                <SkeletonLoader type="card" count={4} />
                            ) : error ? (
                                <div style={{ textAlign: 'center', padding: '1rem', color: '#ff4b4b' }}>{error}</div>
                            ) : availableTools.map(t => (
                                <button 
                                    key={t.id} 
                                    onClick={() => handleSelect(t)}
                                    className="select-item"
                                    style={{ 
                                        padding: '10px 15px', 
                                        textAlign: 'left', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        border: '1px solid var(--border)', 
                                        borderRadius: '10px', 
                                        color: 'white', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: '0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {t.image_url ? <img src={t.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span>{t.name.charAt(0)}</span>}
                                        </div>
                                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{t.name} <small style={{ color: 'var(--text-muted)', marginLeft: '4px', fontWeight: '400' }}>({t.categories?.name})</small></span>
                                    </div>
                                    <Plus size={14} opacity={0.6} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Compare;
