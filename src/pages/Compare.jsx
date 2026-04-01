import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, X, Check, Minus, ExternalLink, RefreshCcw, Star, ArrowRight } from 'lucide-react';
import SmartBanner from '../components/SmartBanner';

const Compare = () => {
    const [tool1, setTool1] = useState(null);
    const [tool2, setTool2] = useState(null);
    const [isSelectingFor, setIsSelectingFor] = useState(null); // 'tool1' or 'tool2'
    const [searchQuery, setSearchQuery] = useState('');
    const [availableTools, setAvailableTools] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        document.title = "Compare AI Tools | ServicesHUB";
    }, []);

    useEffect(() => {
        if (!isSelectingFor) return;

        const fetchTools = async () => {
            setLoading(true);
            try {
                let query = supabase.from('tools').select('id, name, slug, short_description, description, image_url, pricing_type, rating, reviews_count, is_verified, features, url, categories(name)').eq('is_approved', true);
                if (searchQuery) {
                    query = query.ilike('name', `%${searchQuery}%`);
                }
                const { data } = await query.limit(10);
                setAvailableTools(data || []);
            } catch (err) {
                console.error('Fetch comparison tools error:', err);
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
            <div className="feature-matrix glass-card" style={{ marginTop: '4rem', padding: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontSize: '1.8rem', fontWeight: '800' }}>
                    Feature <span className="gradient-text">Comparison</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {allFeatures.length > 0 ? allFeatures.map((feature, i) => (
                        <div key={i} style={{ 
                            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', 
                            padding: '1.2rem', background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '12px', alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{feature}</span>
                            <div style={{ textAlign: 'center' }}>
                                {(tool1.features || []).includes(feature) ? <Check size={20} color="#00ffaa" /> : <Minus size={20} color="rgba(255,255,255,0.1)" />}
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                {(tool2.features || []).includes(feature) ? <Check size={20} color="#00ffaa" /> : <Minus size={20} color="rgba(255,255,255,0.1)" />}
                            </div>
                        </div>
                    )) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}> No specific features listed for comparison. </div>
                    )}
                </div>

                <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
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
                <div className="glass-card active-tool-card" style={{ padding: '2.5rem', textAlign: 'center', position: 'relative' }}>
                    <button onClick={() => slot === 1 ? setTool1(null) : setTool2(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} />
                    </button>
                    <div className="tool-logo-large" style={{ 
                        width: '100px', 
                        height: '100px', 
                        margin: '0 auto 2rem', 
                        background: 'rgba(255,255,255,0.03)', 
                        borderRadius: '24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '2.5rem', 
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
                    <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>{tool.name}</h3>
                    <div style={{ color: 'var(--secondary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         {tool.categories?.name}
                         {tool.is_verified && <Star size={14} fill="var(--secondary)" color="var(--secondary)" />}
                    </div>
                    
                    <div className="compare-stats" style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '1.5rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}><Star size={18} fill="#ffc107" /> {tool.rating || '5.0'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rating</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '900' }}>{tool.reviews_count || '0'}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Reviews</div>
                        </div>
                    </div>

                    <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                         <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px' }}>
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Pricing</div>
                             <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>{tool.pricing_type}</div>
                         </div>
                         <a href={tool.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', textDecoration: 'none', fontSize: '0.9rem', padding: '12px' }}>
                             Visit Site <ExternalLink size={16} />
                         </a>
                    </div>
                </div>
            ) : (
                <div 
                    className="glass-card select-tool-placeholder" 
                    onClick={() => setIsSelectingFor(slot === 1 ? 'tool1' : 'tool2')}
                    style={{ 
                        padding: '6rem 2rem', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        border: '2px dashed var(--border)',
                        background: 'rgba(255,255,255,0.01)',
                        borderRadius: '30px',
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
            <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">DECISION TOOL</div>
                    <h1 className="hero-title">Compare <span className="gradient-text">AI Tools</span> Side-by-Side</h1>
                    <p className="hero-subtitle">Make data-driven decisions by comparing features, pricing, and ratings.</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="comparison-container" style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', position: 'relative' }}>
                    <ToolColumn tool={tool1} slot={1} />
                    
                    <div className="vs-divider" style={{ 
                        marginTop: '100px',
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
                                [1,2,3,4].map(i => (
                                    <div key={i} className="skeleton" style={{ height: '45px', borderRadius: '10px', marginBottom: '0.5rem' }}></div>
                                ))
                            ) : availableTools.map(t => (
                                <button 
                                    key={t.id} 
                                    onClick={() => handleSelect(t)}
                                    className="select-item"
                                    style={{ 
                                        padding: '12px 20px', 
                                        textAlign: 'left', 
                                        background: 'rgba(255,255,255,0.03)', 
                                        border: '1px solid var(--border)', 
                                        borderRadius: '10px', 
                                        color: 'white', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span>{t.name} <small style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({t.categories?.name})</small></span>
                                    <ArrowRight size={14} opacity={0.5} />
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
