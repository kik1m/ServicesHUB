import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HomeBlogSection = ({ latestPosts }) => {
    if (latestPosts.length === 0) return null;

    return (
        <section className="main-section latest-blog-section">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Latest <span className="gradient-text">Insights</span></h2>
                    <p className="section-desc">Stay informed with the newest AI breakthroughs and tutorials.</p>
                </div>
                <Link to="/blog" className="view-all-link">
                    View Magazine <ArrowRight size={18} />
                </Link>
            </div>

            <div className="blog-posts-grid">
                {latestPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className="blog-card glass-card">
                        <div className="blog-card-image">
                            <img src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} alt={post.title} />
                        </div>
                        <div className="blog-meta">
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span style={{ color: 'var(--primary)' }}>{post.category}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <div className="read-more-link">
                            Read Article <ArrowRight size={14} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomeBlogSection;
