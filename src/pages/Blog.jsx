import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { supabase } from '../lib/supabaseClient';
import SmartBanner from '../components/SmartBanner';
const Blog = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState(['All']);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        const fetchInitialData = async () => {
            const { data: catData } = await supabase.from('blog_categories').select('name');
            if (catData) setCategories(['All', ...catData.map(c => c.name)]);

            // SEO
            document.title = "ServicesHUB Magazine | AI & SaaS Insights";
        };
        fetchInitialData();
    }, []);

    // Reset on filter change
    useEffect(() => {
        setPage(0);
        setPosts([]);
        setHasMore(true);
    }, [searchQuery, selectedCategory]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (page === 0) setLoading(true);
            else setLoadingMore(true);

            try {
                let query = supabase.from('blog_posts')
                    .select('id, title, excerpt, image_url, category, author_name, created_at');

                if (searchQuery) {
                    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
                }

                if (selectedCategory !== 'All') {
                    query = query.eq('category', selectedCategory);
                }

                const from = page * ITEMS_PER_PAGE;
                const to = from + ITEMS_PER_PAGE - 1;

                const { data, error } = await query
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) throw error;
                
                if (data) {
                    if (page === 0) setPosts(data);
                    else setPosts(prev => [...prev, ...data]);
                    
                    if (data.length < ITEMS_PER_PAGE) setHasMore(false);
                }
            } catch (err) {
                console.error('Fetch posts error:', err);
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        const timer = setTimeout(fetchPosts, page === 0 ? 400 : 0);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, page]);

    return (
        <div className="page-wrapper blog-page">
            <SmartBanner />
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">SERVICESHUB MAGAZINE</div>
                    <h1 className="hero-title">Insights on the <span className="gradient-text">AI Revolution</span></h1>
                    <p className="hero-subtitle">Expert guides, industry news, and SaaS growth strategies delivered to you.</p>

                    <div className="search-container" style={{ maxWidth: '600px', margin: '3rem auto 0' }}>
                        <div className="nav-search-wrapper" style={{ padding: '15px 25px', background: 'rgba(255,255,255,0.05)' }}>
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: '100%', border: 'none', background: 'transparent', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <section className="main-section">
                {/* Category Filters */}
                <div className="category-filters" style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '4rem',
                    flexWrap: 'wrap'
                }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                            style={{
                                padding: '10px 24px',
                                borderRadius: '30px',
                                border: '1px solid var(--border)',
                                background: selectedCategory === cat ? 'var(--gradient)' : 'rgba(255,255,255,0.02)',
                                color: 'white',
                                cursor: 'pointer',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Posts Grid */}
                <div className="blog-posts-container">
                    <div className="blog-posts-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                        gap: '2.5rem'
                    }}>
                        {loading ? (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <SkeletonLoader key={i} type="card" height="450px" />
                            ))
                        ) : posts.length > 0 ? (
                            posts.map(post => (
                                <Link key={post.id} to={`/blog/${post.id}`} className="blog-card glass-card" style={{
                                    textDecoration: 'none',
                                    color: 'inherit',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div className="blog-card-image" style={{
                                        height: '240px',
                                        overflow: 'hidden',
                                        position: 'relative'
                                    }}>
                                        <img src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1.5rem',
                                            left: '1.5rem',
                                            background: 'var(--primary)',
                                            padding: '5px 15px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '800'
                                        }}>
                                            {post.category}
                                        </div>
                                    </div>

                                    <div className="blog-card-content" style={{ padding: '2rem' }}>
                                        <div className="blog-meta" style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={14} /> {post.author_name || 'ServicesHUB'}</span>
                                        </div>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem' }}>{post.title}</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                            {post.excerpt}
                                        </p>
                                        <div className="blog-footer" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '700' }}>
                                            Read More <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                                <BookOpen size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                                <h3>No articles found matching your criteria.</h3>
                            </div>
                        )}
                    </div>

                    {hasMore && posts.length > 0 && !loading && (
                        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                            <button 
                                onClick={() => setPage(prev => prev + 1)}
                                className="btn-primary"
                                disabled={loadingMore}
                                style={{ padding: '1rem 3rem' }}
                            >
                                {loadingMore ? 'Loading articles...' : 'Load More Articles'}
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Blog;
