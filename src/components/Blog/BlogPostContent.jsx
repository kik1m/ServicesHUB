import React from 'react';
import { Twitter, Facebook, Linkedin } from 'lucide-react';

const BlogPostContent = ({ post }) => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    
    return (
        <div className="post-container">
            <div className="featured-image-container glass-card">
                <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=60'} 
                    alt={post.title} 
                />
            </div>

            <div className="article-body glass-card">
                <div className="prose-content" dangerouslySetInnerHTML={{ __html: post.content }} />

                <div className="article-footer" style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="share-box">
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Share this article:</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className="icon-btn"
                            >
                                <Twitter size={18} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className="icon-btn"
                            >
                                <Facebook size={18} />
                            </button>
                            <button
                                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
                                className="icon-btn"
                            >
                                <Linkedin size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="tags">
                        <span className="cat-tag" style={{ background: 'rgba(0,136,204,0.1)', color: 'var(--primary)', padding: '5px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
                            #{post.category?.replace(/\s+/g, '')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPostContent;
