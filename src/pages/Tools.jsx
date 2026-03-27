import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Star, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceFilter, setPriceFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Categories
                const { data: catData } = await supabase
                    .from('categories')
                    .select('*');
                setCategories(catData || []);

                // Fetch Tools
                let query = supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_approved', true);
                
                if (selectedCategory !== 'All') {
                    query = query.eq('category_id', categories.find(c => c.name === selectedCategory)?.id);
                }

                if (priceFilter !== 'All') {
                    query = query.eq('pricing_type', priceFilter);
                }

                if (sortBy === 'newest') {
                    query = query.order('created_at', { ascending: false });
                } else if (sortBy === 'rating') {
                    query = query.order('rating', { ascending: false });
                }

                const { data: toolData } = await query;
                setTools(toolData || []);
            } catch (error) {
                console.error('Error fetching tools:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedCategory, priceFilter, sortBy, categories]);

    return (
        <div className="page-wrapper">
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">DIRECTORY</div>
                    <h1 className="hero-title">Explore All <span className="gradient-text">Tools</span></h1>
                    <p className="hero-subtitle">Discover the most powerful AI and SaaS solutions curated for professionals.</p>
                </div>
            </header>

            <section className="main-section">
                <div className="filter-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div className="filter-tabs" style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '10px' }}>
                        <button 
                            className={`tab-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('All')}
                            style={{
                                padding: '0.6rem 1.2rem',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: selectedCategory === 'All' ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            All Tools
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id} 
                                className={`tab-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.name)}
                                style={{
                                    padding: '0.6rem 1.2rem',
                                    borderRadius: '100px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: selectedCategory === cat.name ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="filter-options" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select 
                            value={priceFilter} 
                            onChange={(e) => setPriceFilter(e.target.value)}
                            style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                        >
                            <option value="All">All Pricing</option>
                            <option value="Free">Free</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Paid">Paid</option>
                        </select>

                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            style={{ padding: '0.6rem 1rem', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
                        >
                            <option value="newest">Newest</option>
                            <option value="rating">Top Rated</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                        <Loader2 className="animate-spin" size={40} color="var(--primary)" />
                    </div>
                ) : (
                    <div className="tools-grid-main" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {tools.length > 0 ? (
                            tools.map(tool => (
                                <div key={tool.id} className="glass-card tool-card-premium">
                                    <div className="tool-card-image" style={{ 
                                        height: '160px', 
                                        background: 'var(--gradient)', 
                                        borderRadius: '16px',
                                        marginBottom: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white'
                                    }}>
                                        {getIcon(tool.icon_name || 'Zap', 50)}
                                    </div>
                                    <div className="tool-card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <span className="tool-tag">{tool.categories?.name}</span>
                                        <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffcc00', fontSize: '0.9rem' }}>
                                            <Star size={14} fill="#ffcc00" /> {tool.rating}
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>{tool.name}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>{tool.short_description}</p>
                                    <div className="tool-card-actions" style={{ display: 'flex', gap: '1rem' }}>
                                        <Link to={`/tool/${tool.slug}`} className="btn-primary" style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            View Details <ArrowRight size={16} />
                                        </Link>
                                        <button className="icon-btn" style={{ borderRadius: '12px' }}><Sparkles size={18} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                No tools found in this category yet.
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Tools;
