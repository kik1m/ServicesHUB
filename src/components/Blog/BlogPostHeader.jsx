import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const BlogPostHeader = ({ post }) => {
    return (
        <header className="page-header hero-section-compact">
            <div className="hero-content" style={{ maxWidth: '900px', textAlign: 'left' }}>
                <Link to="/blog" className="back-link">
                    <ArrowLeft size={18} /> Back to Blog
                </Link>
                <div className="badge">{post.category}</div>
                <h1 className="hero-title" style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontWeight: '900' }}>{post.title}</h1>

                <div className="post-meta-hero">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--gradient)', borderRadius: '50%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'hidden' }}>
                            <User size={28} color="white" />
                        </div>
                        <span>By <strong>{post.author_name || 'HUBly'}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {new Date(post.created_at).toLocaleDateString()}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> {Math.ceil(post.content?.split(' ').length / 200) || 5} min read</div>
                </div>
            </div>
        </header>
    );
};

export default BlogPostHeader;
