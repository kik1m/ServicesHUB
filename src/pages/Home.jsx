import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, Cpu, PenTool, Code, Globe, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import SkeletonLoader from '../components/SkeletonLoader';
import SmartBanner from '../components/SmartBanner';
import VideoGuide from '../components/VideoGuide';

const UsersGroup = () => (
    <div className="users-group" style={{ display: 'flex', alignItems: 'center', marginLeft: '1rem' }}>
        {[1, 2, 3, 4].map(i => (
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
        document.title = "ServicesHUB | The Ultimate AI & SaaS Tools Directory";
        // Meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', 'Discover and compare the worlds most innovative AI and SaaS tools. Curated for founders, developers, and creators.');
    }, []);

    useEffect(() => {
        const fetchHomeData = async () => {
            const timeout = setTimeout(() => {
                if (loading) setLoading(false);
            }, 6000); // 6s safety timeout

            try {
                // Fetch Categories
                const { data: catData, error: catError } = await supabase
                    .from('categories')
                    .select('*')
                    .limit(4);

                if (catError) console.error('Categories Fetch Error:', catError);

                // Fetch Featured Tools (Active ones)
                const now = new Date().toISOString();
                const { data: toolData, error: toolError } = await supabase
                    .from('tools')
                    .select('*, categories(name)')
                    .eq('is_featured', true)
                    .gt('featured_until', now)
                    .limit(3);

                if (toolError) console.error('Featured Tools Fetch Error:', toolError);

                setCategories(catData || []);
                setFeaturedTools(toolData || []);
            } catch (error) {
                console.error('Home Data Fetch Exception:', error);
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        fetchHomeData();
    }, []);

    return (
        <div className="home-container">
            <SmartBanner />
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
                        [1, 2, 3, 4].map(i => (
                            <div key={i} className="glass-card skeleton" style={{ height: '80px', borderRadius: '20px' }}></div>
                        ))
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
                        [1, 2, 3].map(i => (
                            <SkeletonLoader key={i} type="card" />
                        ))
                    ) : featuredTools.length > 0 ? (
                        featuredTools.map((tool, i) => (
                            <div key={i} className="glass-card tool-preview-card">
                                <div className="tool-logo-box" style={{
                                    width: '60px',
                                    height: '60px',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    marginBottom: '1.5rem',
                                    overflow: 'hidden',
                                    border: '1px solid var(--border)'
                                }}>
                                    {tool.image_url ? (
                                        <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        getIcon(tool.icon_name || 'Zap')
                                    )}
                                </div>
                                <div className="tool-tag" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    {tool.categories?.name}
                                    {tool.is_verified && <CheckCircle2 size={14} color="#00d2ff" style={{ marginLeft: '5px' }} title="Verified Tool" />}
                                </div>
                                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {tool.name}
                                </h3>
                                <p>{tool.short_description}</p>
                                <Link to={`/tool/${tool.slug}`} className="btn-text">View Details <ArrowRight size={16} /></Link>
                            </div>
                        ))
                    ) : (
                        <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <Zap size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>No featured tools at the moment. Check back later!</p>
                            <Link to="/tools" className="btn-text" style={{ color: 'var(--primary)', marginTop: '1rem', display: 'inline-block' }}>Browse All Tools</Link>
                        </div>
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

            <VideoGuide />
        </div>
    );
};


export default Home;
