import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
    return (
        <Link to={`/blog/${post.id}`} className={styles.blogCard}>
            <div className={styles.imageWrapper}>
                <img 
                    src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} 
                    alt={post.title} 
                    className={styles.blogImage}
                    loading="lazy"
                />
                <div className={styles.categoryBadge}>
                    {post.category}
                </div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <Calendar size={14} /> 
                        {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className={styles.metaItem}>
                        <User size={14} /> 
                        {post.author_name || 'HUBly'}
                    </div>
                </div>
                
                <h3 className={styles.cardTitle}>{post.title}</h3>
                <p className={styles.excerpt}>
                    {post.excerpt}
                </p>
                
                <div className={styles.cardFooter}>
                    Read More <ArrowRight size={16} />
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
