import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getIcon } from '../utils/iconMap';
import SkeletonLoader from '../components/SkeletonLoader';
import SmartBanner from '../components/SmartBanner';
import VideoGuide from '../components/VideoGuide';
import useSEO from '../hooks/useSEO';

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
    const [latestPosts, setLatestPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useSEO({
        title: "The Ultimate AI & SaaS Tools Directory",
        description: "Discover and compare the worlds most innovative AI and SaaS tools. Curated for founders, developers, and creators.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://serviceshub.com'
    });

    useEffect(() => {
        const fetchHomeData = async () => {
            setLoading(true);
            try {
                const now = new Date().toISOString();

                // Parallel Fetching
                const [catRes, toolRes, blogRes] = await Promise.all([
                    supabase.from('categories').select('*').limit(4),
                    supabase.from('tools')
                        .select('id, name, slug, short_description, image_url, icon_name, is_verified, categories(name)')
                        .eq('is_approved', true)
                        .eq('is_featured', true)
                        .gt('featured_until', now)
                        .limit(3),
                    supabase.from('blog_posts')
                        .select('*')
                        .order('created_at', { ascending: false })
                        .limit(3)
                ]);

                if (catRes.error) console.error('Categories Fetch Error:', catRes.error);
                if (toolRes.error) console.error('Featured Tools Fetch Error:', toolRes.error);
                if (blogRes.error) console.error('Blog Fetch Error:', blogRes.error);

                setCategories(catRes.data || []);
                setFeaturedTools(toolRes.data || []);
                setLatestPosts(blogRes.data || []);
            } catch (error) {
                console.error('Home Data Fetch Exception:', error);
            } finally {
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
                        Stop searching, start building. We curate the world&apos;s most innovative AI and SaaS tools to help you scale faster than ever.
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

                <div className="prop-grid-new" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
                    <div className="glass-card prop-card-premium" style={{ padding: '2.5rem' }}>
                        <div className="prop-icon-bg" style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}><Zap size={28} /></div>
                        <h4>Fast Access</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>No more digging through search results. Get direct, tested links to the world&apos;s most innovative tools instantly.</p>
                    </div>
                    <div className="glass-card prop-card-premium" style={{ padding: '2.5rem' }}>
                        <div className="prop-icon-bg" style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}><Shield size={28} /></div>
                        <h4>Curated Quality</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>We only list tools that meet our high standards of quality, reliability, and actual value for your business.</p>
                    </div>
                    <div className="glass-card prop-card-premium" style={{ padding: '2.5rem' }}>
                        <div className="prop-icon-bg" style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(0,210,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}><Sparkles size={28} /></div>
                        <h4>Latest Trends</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Stay updated with daily additions of the newest AI breakthroughs and SaaS innovations before they go viral.</p>
                    </div>
                </div>
            </section>

            {/* Latest Blog Posts */}
            {latestPosts.length > 0 && (
                <section className="main-section latest-blog-section" style={{ backgroundColor: 'rgba(255,255,255,0.01)', borderRadius: '40px', padding: '6rem 2rem' }}>
                    <div className="section-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title">Latest <span className="gradient-text">Insights</span></h2>
                        <Link to="/blog" className="view-all-link" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
                            View Magazine <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                        </Link>
                    </div>

                    <div className="blog-posts-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {latestPosts.map(post => (
                            <Link key={post.id} to={`/blog/${post.id}`} className="blog-card glass-card" style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="blog-card-image" style={{ height: '200px', borderRadius: '15px', overflow: 'hidden', marginBottom: '1.5rem' }}>
                                    <img src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div className="blog-meta" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span style={{ color: 'var(--primary)' }}>{post.category}</span>
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: '1.4', marginBottom: '1rem' }}>{post.title}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '700' }}>
                                    Read Article <ArrowRight size={14} style={{ marginLeft: '6px' }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <VideoGuide />
        </div>
    );
};


export default Home;
