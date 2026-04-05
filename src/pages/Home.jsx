import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Zap, Shield, CheckCircle2, Search } from 'lucide-react';
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
    const [latestTools, setLatestTools] = useState([]);
    const [latestPosts, setLatestPosts] = useState([]);
    const [statsCount, setStatsCount] = useState({ tools: 0, users: 0 });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState(null);

    useSEO({
        title: "The Ultimate AI & SaaS Tools Directory",
        description: "Discover and compare the worlds most innovative AI and SaaS tools. Curated for founders, developers, and creators.",
        url: typeof window !== 'undefined' ? window.location.href : 'https://serviceshub.com'
    });

    useEffect(() => {
        let mounted = true;

        const fetchHomeData = async () => {
            setLoading(true);
            setError(null);
            
            const safeFetch = async (queryFn, label) => {
                try {
                    const { data, count, error } = await queryFn();
                    if (error) throw error;
                    return { data, count };
                } catch (err) {
                    console.warn(`Home: ${label} fetch partially failed:`, err.message);
                    return { data: [], count: 0 };
                }
            };

            try {
                // 1. Categories first
                const catRes = await safeFetch(() => supabase.from('categories').select('id, name, icon_name, slug').limit(8), 'Categories');
                if (mounted) setCategories(catRes.data);

                // 2. Featured Tools (Most important)
                const toolRes = await safeFetch(() => supabase.from('tools').select('id, name, slug, short_description, image_url, icon_name, is_verified, categories(name)').eq('is_approved', true).eq('is_featured', true).limit(6), 'Featured');
                if (mounted) setFeaturedTools(toolRes.data);

                // 3. Latest Tools
                const latestRes = await safeFetch(() => supabase.from('tools').select('id, name, slug, short_description, image_url, icon_name, is_verified, categories(name)').eq('is_approved', true).order('created_at', { ascending: false }).limit(4), 'Latest');
                if (mounted) setLatestTools(latestRes.data);

                // 4. Blog Posts
                const blogRes = await safeFetch(() => supabase.from('blog_posts').select('id, title, excerpt, image_url, category, author_name, created_at').order('created_at', { ascending: false }).limit(3), 'Blog');
                if (mounted) setLatestPosts(blogRes.data);

                // 5. Stats (last)
                const toolsCountRes = await safeFetch(() => supabase.from('tools').select('id', { count: 'exact', head: true }).eq('is_approved', true), 'ToolsCount');
                const usersCountRes = await safeFetch(() => supabase.from('profiles').select('id', { count: 'exact', head: true }), 'UsersCount');
                
                console.log('Home Data Ready:', { tools: toolRes.data.length, cats: catRes.data.length });
                if (mounted) {
                    setStatsCount({
                        tools: toolsCountRes.count || 0,
                        users: usersCountRes.count || 0
                    });
                }
            } catch (err) {
                console.error('Home Critical Fetch Error:', err);
                if (mounted) setError("Could not load some content. Please check your connection.");
            } finally {
                setLoading(false);
                console.log('Home Loading Finished.');
            }
        };

        fetchHomeData();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="home-container">
            <SmartBanner />
            {/* Hero Section */}
            <header className="hero-section-slim">
                <div className="hero-content">
                    <div className="badge">Trusted by {statsCount.users > 0 ? statsCount.users.toLocaleString() : '10,000'}+ Professionals</div>
                    <h1 className="hero-title-slim">
                        Discover the Power of <span className="gradient-text">Modern AI</span>
                    </h1>
                    <p className="hero-subtitle-slim">
                        Stop searching, start building. Explore {statsCount.tools > 0 ? statsCount.tools.toLocaleString() : '500'}+ innovative tools curated for your success.
                    </p>

                    <div className="hero-search-wrapper-large glass-card">
                        <Search size={22} color="var(--primary)" />
                        <input 
                            type="text" 
                            placeholder="Search for tools, categories, or keywords..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && navigate(`/search?q=${searchQuery}`)}
                        />
                        <button onClick={() => navigate(`/search?q=${searchQuery}`)} className="btn-primary">Search</button>
                    </div>

                    <div className="hero-cta">
                        <div className="user-trust">
                            <UsersGroup /> <span>Used by makers worldwide</span>
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

            {/* Latest Arrivals Section */}
            <section className="main-section latest-arrivals">
                <div className="section-header-row">
                    <div className="text-left">
                        <h2 className="section-title">New <span className="gradient-text">Arrivals</span></h2>
                        <p className="section-desc">The freshest AI solutions added to our directory this week.</p>
                    </div>
                    <Link to="/tools" className="view-all-link">Browse All <ArrowRight size={18} /></Link>
                </div>

                <div className="latest-tools-grid-mini" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {loading ? (
                        [1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)
                    ) : (
                        latestTools.map((tool) => (
                            <Link to={`/tool/${tool.slug}`} key={tool.id} className="glass-card latest-tool-mini" style={{ textDecoration: 'none', color: 'inherit', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    {tool.image_url ? (
                                        <img src={tool.image_url} alt={tool.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = '<svg ...></svg>'; }} />
                                    ) : (
                                        getIcon(tool.icon_name || 'Zap')
                                    )}
                                </div>
                                <div style={{ overflow: 'hidden' }}>
                                    <h4 style={{ fontSize: '0.95rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tool.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0' }}>{tool.categories?.name}</p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </section>

            {/* Featured Tools Preview */}
            <section className="main-section featured-preview">
                <div className="section-header-row">
                    <div className="text-left">
                        <h2 className="section-title">Editor&apos;s <span className="gradient-text">Choice</span></h2>
                        <p className="section-desc">Hand-picked premium tools for maximum productivity.</p>
                    </div>
                </div>

                <div className="featured-tools-grid">
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <SkeletonLoader key={i} type="card" />
                            ))
                        ) : error ? (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem' }}>
                                <p style={{ color: '#ff4444' }}>{error}</p>
                                <button onClick={() => window.location.reload()} className="btn-outline" style={{ marginTop: '1rem' }}>Retry Now</button>
                            </div>
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
                            <p>No featured tools yet.</p>
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

            {/* Publisher CTA Section */}
            <section className="main-section publisher-cta-bg" style={{ 
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.05) 0%, rgba(102, 51, 255, 0.05) 100%)',
                borderRadius: '40px',
                padding: '5rem 3rem',
                margin: '4rem 0',
                border: '1px solid rgba(255,255,255,0.05)',
                textAlign: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <div className="badge" style={{ background: 'rgba(102, 51, 255, 0.1)', color: '#6633ff' }}>FOR TOOL OWNERS</div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>Are you building something <span className="gradient-text">Great</span>?</h2>
                    <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        Reach thousands of developers, entrepreneurs, and AI enthusiasts. Submit your tool for free today and get the exposure your product deserves.
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/submit" className="btn-primary" style={{ padding: '1rem 2.5rem' }}>Submit My Tool <Zap size={18} style={{ marginLeft: '8px' }} /></Link>
                        <Link to="/promote" className="btn-secondary" style={{ padding: '1rem 2.5rem', border: '1px solid var(--border)', background: 'transparent', color: 'white', textDecoration: 'none', borderRadius: '12px' }}>Explore Advertising <ArrowRight size={18} style={{ marginLeft: '8px' }} /></Link>
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
