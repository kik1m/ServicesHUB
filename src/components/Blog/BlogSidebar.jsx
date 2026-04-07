import React from 'react';
import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';

const BlogSidebar = ({ relatedPosts }) => {
    return (
        <aside className="post-sidebar">
            <div className="glass-card sidebar-widget" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Share2 size={18} color="var(--primary)" /> Newsletter
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    Get the latest AI tools and trends directly in your inbox.
                </p>
                <input 
                    type="email" 
                    placeholder="Email address" 
                    style={{ 
                        width: '100%', padding: '12px', borderRadius: '10px', 
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', 
                        color: 'white', marginBottom: '1rem' 
                    }} 
                />
                <button className="btn-primary" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                    Subscribe
                </button>
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
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
    );
};

export default BlogSidebar;
