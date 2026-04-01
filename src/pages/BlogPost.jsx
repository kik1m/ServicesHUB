import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import { supabase } from '../lib/supabaseClient';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostAndRelated = async () => {
            setLoading(true);
            try {
                // Fetch Post
                const { data: postData, error: postError } = await supabase
                    .from('blog_posts')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (postError) throw postError;
                setPost(postData);

                // Enhanced SEO
                if (postData) {
                    const title = `${postData.title} | ServicesHUB Magazine`;
                    const description = postData.excerpt || postData.title;
                    const imageUrl = postData.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60';
                    const url = window.location.href;

                    document.title = title;
                    
                    const updateMeta = (name, content, attr = 'name') => {
                        let element = document.querySelector(`meta[${attr}="${name}"]`);
                        if (!element) {
                            element = document.createElement('meta');
                            element.setAttribute(attr, name);
                            document.head.appendChild(element);
                        }
                        element.setAttribute('content', content);
                    };

                    updateMeta('description', description);
                    updateMeta('og:title', title, 'property');
                    updateMeta('og:description', description, 'property');
                    updateMeta('og:image', imageUrl, 'property');
                    updateMeta('og:url', url, 'property');
                    updateMeta('og:type', 'article', 'property');
                    updateMeta('twitter:card', 'summary_large_image');
                    updateMeta('twitter:title', title);
                    updateMeta('twitter:description', description);
                    updateMeta('twitter:image', imageUrl);
                }

                // Fetch Related
                if (postData) {
                    const { data: related } = await supabase
                        .from('blog_posts')
                        .select('id, title, image_url')
                        .eq('category', postData.category)
                        .neq('id', postData.id)
                        .limit(2);
                    setRelatedPosts(related || []);
                }
            } catch (err) {
                console.error('Fetch post error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPostAndRelated();
    }, [id]);

    if (loading) {
        return (
            <div className="page-wrapper blog-post-page">
                <header className="page-header hero-section" style={{ padding: '80px 5% 60px', borderRadius: '0 0 50px 50px' }}>
                    <div className="hero-content" style={{ maxWidth: '900px', textAlign: 'left' }}>
                        <SkeletonLoader type="text" width="100px" style={{ marginBottom: '2rem' }} />
                        <SkeletonLoader type="title" width="80%" style={{ marginBottom: '1.5rem' }} />
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <SkeletonLoader type="text" width="150px" height="40px" borderRadius="100px" />
                            <SkeletonLoader type="text" width="150px" height="40px" borderRadius="100px" />
                        </div>
                    </div>
                </header>
                <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem' }}>
                    <div>
                        <SkeletonLoader type="image" height="500px" borderRadius="30px" style={{ marginBottom: '4rem' }} />
                        <SkeletonLoader type="text" height="400px" />
                    </div>
                    <SkeletonLoader type="text" height="300px" borderRadius="24px" />
                </section>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="page-wrapper" style={{ textAlign: 'center', padding: '10rem 5%' }}>
                <h2 style={{ color: '#ff5050' }}>{error || 'Article not found'}</h2>
                <Link to="/blog" className="btn-primary" style={{ marginTop: '2rem' }}>Back to Blog</Link>
            </div>
        );
    }

    return (
        <div className="page-wrapper blog-post-page">
            {/* Header Hero */}
            <header className="page-header hero-section" style={{ padding: '80px 5% 60px', borderRadius: '0 0 50px 50px' }}>
                <div className="hero-content" style={{ maxWidth: '900px', textAlign: 'left' }}>
                    <Link to="/blog" className="back-link" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        color: 'var(--primary)', 
                        textDecoration: 'none',
                        marginBottom: '2rem',
                        fontWeight: '700'
                    }}>
                        <ArrowLeft size={18} /> Back to Blog
                    </Link>
                    <div className="badge">{post.category}</div>
                    <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '900' }}>{post.title}</h1>
                    
                    <div className="post-meta-hero" style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                                <User size={28} color="white" />
                            </div>
                            <span>By <strong>{post.author_name || 'ServicesHUB'}</strong></span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {new Date(post.created_at).toLocaleDateString()}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {post.read_time || '5 min'} read</div>
                    </div>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem' }}>
                {/* Main Content Area */}
                <div className="post-container">
                    <div className="featured-image-container glass-card" style={{ 
                        borderRadius: '30px', 
                        overflow: 'hidden', 
                        height: '500px', 
                        marginBottom: '4rem',
                        padding: '0'
                    }}>
                        <img src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60'} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <div className="article-body glass-card" style={{ padding: '5rem', lineHeight: '2', fontSize: '1.2rem', color: 'rgba(255,255,255,0.85)' }}>
                        <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />
                        
                        <div className="article-footer" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="share-box">
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Share this article:</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        className="icon-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}
                                    >
                                        <Twitter size={18} />
                                    </button>
                                    <button 
                                        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        className="icon-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}
                                    >
                                        <Facebook size={18} />
                                    </button>
                                    <button 
                                        onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                                        className="icon-btn" style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '10px', color: 'white', cursor: 'pointer' }}
                                    >
                                        <Linkedin size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="tags">
                                <span className="cat-tag" style={{ background: 'rgba(0,136,204,0.1)', color: 'var(--primary)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>#{post.category?.replace(/\s+/g, '')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <aside className="post-sidebar">
                    <div className="glass-card sidebar-widget" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                        <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Share2 size={18} color="var(--primary)" /> Newsletter</h4>
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Get the latest AI tools and trends directly in your inbox.</p>
                        <input type="email" placeholder="Email address" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', color: 'white', marginBottom: '1rem' }} />
                        <button className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--gradient)', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Subscribe</button>
                    </div>

                    {relatedPosts.length > 0 && (
                        <div className="glass-card sidebar-widget" style={{ padding: '2.5rem' }}>
                            <h4 style={{ marginBottom: '1.5rem' }}>Related Articles</h4>
                            <div className="related-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {relatedPosts.map(p => (
                                    <Link key={p.id} to={`/blog/${p.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ width: '70px', height: '70px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={p.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&auto=format&fit=crop&q=60'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <h5 style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>{p.title}</h5>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </aside>
            </section>
        </div>
    );
};

export default BlogPost;
