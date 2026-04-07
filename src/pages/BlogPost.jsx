import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Import Modular Components
import BlogPostHeader from '../components/Blog/BlogPostHeader';
import BlogPostContent from '../components/Blog/BlogPostContent';
import BlogSidebar from '../components/Blog/BlogSidebar';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular CSS
import '../styles/Pages/Blog.css';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

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
                if (mounted) setPost(postData);

                // Enhanced SEO
                if (postData && mounted) {
                    const title = `${postData.title} | HUBly Magazine`;
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
                }

                // Fetch Related
                if (postData && mounted) {
                    const { data: related } = await supabase
                        .from('blog_posts')
                        .select('id, title, image_url')
                        .eq('category', postData.category)
                        .neq('id', postData.id)
                        .limit(2);
                    if (mounted) setRelatedPosts(related || []);
                }
            } catch (err) {
                console.error('Fetch post error:', err);
                if (mounted) setError(err.message);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchPostAndRelated();
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return (
            <div className="page-wrapper blog-post-page">
                <header className="page-header hero-section-compact">
                    <div className="hero-content" style={{ maxWidth: '900px', textAlign: 'left' }}>
                        <SkeletonLoader type="text" width="100px" style={{ marginBottom: '2rem' }} />
                        <SkeletonLoader type="title" width="80%" style={{ marginBottom: '1.5rem' }} />
                    </div>
                </header>
                <div style={{ height: '500px' }}></div>
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
            <BlogPostHeader post={post} />

            <section className="main-section content-layout-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem' }}>
                <BlogPostContent post={post} />
                <BlogSidebar relatedPosts={relatedPosts} />
            </section>
        </div>
    );
};

export default BlogPost;
