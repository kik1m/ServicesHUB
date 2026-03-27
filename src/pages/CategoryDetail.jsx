import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import { ArrowLeft, Star, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

const CategoryDetail = () => {
    const { id: slug } = useParams();
    const navigate = useNavigate();
    const [category, setCategory] = useState(null);
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const fetchCategoryData = async () => {
            setLoading(true);
            try {
                // Fetch Category
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('slug', slug)
                    .single();
                
                if (catError) throw catError;
                setCategory(catData);
                
                // SEO
                if (catData) {
                    document.title = `Best ${catData.name} Tools | ServicesHUB`;
                }

                // Fetch Tools
                if (catData) {
                    const { data: toolData } = await supabase
                        .from('tools')
                        .select('*, categories(name)')
                        .eq('category_id', catData.id)
                        .eq('is_approved', true);
                    setTools(toolData || []);
                }
            } catch (error) {
                console.error('Error fetching category detail:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryData();
    }, [slug]);

    if (loading) {
        return (
            <div className="page-wrapper">
                <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="text" width="100px" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="title" width="60%" style={{ margin: '0 auto 1.5rem' }} />
                        <SkeletonLoader type="text" width="40%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                        {[1,2,3,4,5,6].map(i => (
                            <SkeletonLoader key={i} type="card" />
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '150px 5%' }}>
                <h2 className="hero-title">Category <span className="gradient-text">Not Found</span></h2>
                <Link to="/categories" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Categories</Link>
            </div>
        );
    }

    const categoryColor = 'var(--primary)'; // Default color for all categories now

    return (
        <div className="page-wrapper category-detail-page">
            <header className="category-header hero-section" style={{ 
                minHeight: '45vh', 
                paddingBottom: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '400px',
                    height: '400px',
                    background: categoryColor,
                    filter: 'blur(150px)',
                    opacity: 0.1,
                    zIndex: 0
                }}></div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
                    <button onClick={() => navigate('/categories')} className="btn-text" style={{ marginBottom: '2rem', color: 'white' }}>
                        <ArrowLeft size={18} /> All Categories
                    </button>
                    
                    <div className="cat-header-icon" style={{ 
                        color: categoryColor, 
                        marginBottom: '1.5rem',
                        background: 'rgba(255,255,255,0.03)',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '20px',
                        margin: '0 auto 2rem',
                        border: `1px solid var(--border)`
                    }}>
                         {getIcon(category.icon_name || 'LayoutGrid', 40)}
                    </div>

                    <h1 className="hero-title" style={{ fontSize: '3.5rem' }}>
                        Best <span className="gradient-text">{category.name}</span> Tools
                    </h1>
                    <p className="hero-subtitle" style={{ maxWidth: '800px', margin: '1.5rem auto' }}>
                        Expertly curated {category.name} tools to help you build better and faster.
                    </p>
                    <div className="badge" style={{ borderColor: categoryColor, color: 'white' }}>
                        {tools.length} Tools Available
                    </div>
                </div>
            </header>

            <section className="main-section" style={{ paddingTop: '4rem' }}>
                <div className="section-header-row">
                    <h2 className="section-title">Explore <span className="gradient-text">Top Picks</span></h2>
                    <div className="filter-count">Showing {tools.length} results</div>
                </div>

                {tools.length > 0 ? (
                    <div className="tools-grid-main" style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '2.5rem',
                        marginTop: '3rem'
                    }}>
                        {tools.map(tool => (
                            <div key={tool.id} className="glass-card tool-card-premium">
                                <div className="tool-card-image" style={{ 
                                    height: '160px', 
                                    background: 'rgba(255,255,255,0.03)', 
                                    borderRadius: '16px',
                                    marginBottom: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)'
                                }}>
                                     {tool.image_url ? (
                                         <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                     ) : (
                                         getIcon(tool.icon_name || 'Zap', 50)
                                     )}
                                </div>
                                <div className="tool-card-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <span className="tool-tag">{category.name}</span>
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
                        ))}
                    </div>
                ) : (
                    <div className="empty-state" style={{ textAlign: 'center', padding: '100px 0' }}>
                        <div style={{ marginBottom: '2rem', opacity: 0.3 }}><LayoutGrid size={80} /></div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>No tools found in this category yet.</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>We are constantly adding new tools. Check back soon!</p>
                        <Link to="/tools" className="btn-secondary" style={{ marginTop: '2rem' }}>Browse All Tools</Link>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryDetail;
