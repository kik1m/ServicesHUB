import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Search, X, Check, Minus, MessageSquare, ExternalLink, RefreshCcw, Star, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
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
                let query = supabase.from('tools').select('*, categories(name)').eq('is_approved', true);
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

    const ToolColumn = ({ tool, slot }) => (
        <div className="compare-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {tool ? (
                <div className="glass-card active-tool-card" style={{ padding: '2rem', textAlign: 'center', position: 'relative' }}>
                    <button onClick={() => slot === 1 ? setTool1(null) : setTool2(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <X size={20} />
                    </button>
                    <div className="tool-logo-large" style={{ 
                        width: '80px', 
                        height: '80px', 
                        margin: '0 auto 1.5rem', 
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
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{tool.name}</h3>
                    <div style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{tool.categories?.name}</div>
                    
                    <div className="compare-stats" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{tool.rating || '5.0'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rating</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{tool.reviews_count || '0'}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reviews</div>
                        </div>
                    </div>
                </div>
            ) : (
                <div 
                    className="glass-card select-tool-placeholder" 
                    onClick={() => setIsSelectingFor(slot === 1 ? 'tool1' : 'tool2')}
                    style={{ 
                        padding: '4rem 2rem', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        border: '2px dashed var(--border)',
                        background: 'rgba(255,255,255,0.01)'
                    }}
                >
                    <div style={{ width: '60px', height: '60px', margin: '0 auto 1.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Search size={24} />
                    </div>
                    <h4 style={{ color: 'var(--text-muted)' }}>Select {slot === 1 ? 'First' : 'Second'} Tool</h4>
                </div>
            )}

            <div className="feature-comparison" style={{ marginTop: '1rem' }}>
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pricing Model</div>
                    <div style={{ fontWeight: '700' }}>{tool?.pricing_type || '---'}</div>
                </div>
                <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.1rem' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Last Update</div>
                    <div style={{ fontWeight: '700' }}>{tool ? new Date(tool.created_at).toLocaleDateString() : '---'}</div>
                </div>
                {tool && (
                    <Link to={`/tool/${tool.slug}`} className="btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '1rem', textDecoration: 'none' }}>
                        View Details
                    </Link>
                )}
            </div>
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
