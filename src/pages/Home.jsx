import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, Cpu, PenTool, Code, Globe } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';

const UsersGroup = () => (
    <div className="users-group" style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
        {[1,2,3,4].map(i => (
            <div key={i} style={{ 
                width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--bg-dark)',
                background: 'var(--gradient)', marginLeft: '-12px', overflow: 'hidden'
            }}></div>
        ))}
    </div>
);

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [featuredTools, setFeaturedTools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                // Fetch Categories
                const { data: catData } = await supabase
                    .from('categories')
                    .select('*')
                    .limit(4);
                
                // Fetch Featured Tools with Category Info
                const { data: toolData } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_featured', true)
                    .limit(3);

                setCategories(catData || []);
                setFeaturedTools(toolData || []);
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-content">
                    <div className="badge">✨ Join 10,000+ Creators</div>
                    <h1 className="hero-title">
                        Discover the Power of <span className="gradient-text">Modern Tools</span>
                    </h1>
                    <p className="hero-subtitle">
                        Stop searching, start building. We curate the world's most innovative AI and SaaS tools to help you scale faster than ever.
                    </p>
                    
                    <div className="hero-cta">
                        <Link to="/tools" className="btn-primary main-cta-btn">
                            Explore Tools <ArrowRight size={20} />
                        </Link>
                        <div className="user-trust">
                            <UsersGroup /> <span>Trusted by developers & founders</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Categories Preview */}
            <section className="main-section categories-preview">
                <div className="section-header-row">
                    <div className="text-left">
                        <h2 className="section-title">Top Categories</h2>
                        <p className="section-desc">Find tools by your specific niche and needs.</p>
                    </div>
                    <Link to="/categories" className="view-all-link">View All Categories <ArrowRight size={18} /></Link>
                </div>
                
                <div className="categories-grid-small">
                    {loading ? (
                        <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading Categories...</div>
                    ) : (
                        categories.map((cat, i) => (
                            <Link to={`/category/${cat.slug}`} key={i} className="glass-card category-item-small">
                                <div className="cat-icon-wrapper">{getIcon(cat.icon_name)}</div>
                                <div className="cat-info">
                                    <h3>{cat.name}</h3>
                                    <p>Browse Category</p>
                                </div>
                                <ArrowRight className="cat-arrow" size={16} />
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Featured Tools Preview */}
            <section className="main-section featured-preview">
                <div className="section-header-row">
                    <div className="text-left">
                        <h2 className="section-title">Featured Tools</h2>
                        <p className="section-desc">Hand-picked premium tools for maximum productivity.</p>
                    </div>
                    <Link to="/tools" className="view-all-link">Explore All Tools <ArrowRight size={18} /></Link>
                </div>
                
                <div className="featured-tools-grid">
                    {loading ? (
                         <div style={{ color: 'var(--text-muted)', padding: '2rem' }}>Loading Tools...</div>
                    ) : (
                        featuredTools.map((tool, i) => (
                            <div key={i} className="glass-card tool-preview-card">
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
                                    {getIcon(tool.icon_name || 'Zap')}
                                </div>
                                <div className="tool-tag">{tool.categories?.name}</div>
                                <h3>{tool.name}</h3>
                                <p>{tool.short_description}</p>
                                <Link to={`/tool/${tool.slug}`} className="btn-text">View Details <ArrowRight size={16} /></Link>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Why Us / Value Prop */}
            <section className="main-section value-prop-section">
                <div className="section-header" style={{ marginBottom: '4rem' }}>
                    <h2 className="section-title">Built for <span className="gradient-text">Efficiency</span></h2>
                    <p className="section-desc">We simplify world-class tool discovery so you can focus on building.</p>
                </div>

                <div className="prop-grid-new">
                    <div className="glass-card prop-card-premium">
                        <div className="prop-icon-bg"><Zap size={28} /></div>
                        <h4>Fast Access</h4>
                        <p>No more digging through search results. Get direct, tested links to the world's most innovative tools instantly.</p>
                    </div>
                    <div className="glass-card prop-card-premium">
                        <div className="prop-icon-bg"><Shield size={28} /></div>
                        <h4>Curated Quality</h4>
                        <p>We only list tools that meet our high standards of quality, reliability, and actual value for your business.</p>
                    </div>
                    <div className="glass-card prop-card-premium">
                        <div className="prop-icon-bg"><Sparkles size={28} /></div>
                        <h4>Latest Trends</h4>
                        <p>Stay updated with daily additions of the newest AI breakthroughs and SaaS innovations before they go viral.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};


export default Home;
