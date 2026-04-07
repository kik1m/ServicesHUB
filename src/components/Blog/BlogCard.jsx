import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

const BlogCard = ({ post }) => {
    return (
        <Link to={`/blog/${post.id}`} className="blog-card glass-card">
            <div className="blog-card-image">
                <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} 
                    alt={post.title} 
                    loading="lazy"
                />
                <div className="cat-badge-overlay">
                    {post.category}
                </div>
            </div>

            <div className="blog-card-content">
                <div className="blog-meta">
                    <span><Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}</span>
                    <span><User size={14} /> {post.author_name || 'HUBly'}</span>
                </div>
                <h3>{post.title}</h3>
                <p className="excerpt">
                    {post.excerpt}
                </p>
                <div className="blog-footer">
                    Read More <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
