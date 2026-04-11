import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';
import styles from './BlogPostHeader.module.css';

const BlogPostHeader = ({ post }) => {
    return (
        <header className={styles.headerHero}>
            <div className={styles.headerContent}>
                <Link to="/blog" className={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Blog
                </Link>
                <div className={styles.badge}>{post.category}</div>
                <h1 className={styles.title}>{post.title}</h1>

                <div className={styles.metaHero}>
                    <div className={styles.authorBox}>
                        <div className={styles.avatarBg}>
                            <User size={28} color="white" />
                        </div>
                        <span>By <strong>{post.author_name || 'HUBly'}</strong></span>
                    </div>
                    <div className={styles.metaItem}>
                        <Calendar size={18} /> 
                        {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className={styles.metaItem}>
                        <Clock size={18} /> 
                        {Math.ceil(post.content?.split(' ').length / 200) || 5} min read
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BlogPostHeader;
