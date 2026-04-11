import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SkeletonLoader from '../SkeletonLoader';
import styles from './HomeBlogSection.module.css';

const HomeBlogSection = ({ latestPosts, loading }) => {
    if (loading) {
        return (
            <section className={`main-section ${styles.latestBlogSection}`}>
                <div className="section-header-row">
                    <div className="text-left">
                        <h2 className="section-title">Latest <span className="gradient-text">Insights</span></h2>
                        <p className="section-desc">Stay informed with the newest AI breakthroughs and tutorials.</p>
                    </div>
                </div>
                <div className={styles.blogPostsGrid}>
                    {[1, 2, 3].map(i => <SkeletonLoader key={i} type="blog" />)}
                </div>
            </section>
        );
    }

    if (!latestPosts || latestPosts.length === 0) return null;

    return (
        <section className={`main-section ${styles.latestBlogSection}`}>
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Latest <span className="gradient-text">Insights</span></h2>
                    <p className="section-desc">Stay informed with the newest AI breakthroughs and tutorials.</p>
                </div>
                <Link to="/blog" className={styles.viewAllLink}>
                    View Magazine <ArrowRight size={18} />
                </Link>
            </div>

            <div className={styles.blogPostsGrid}>
                {latestPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.id}`} className={`${styles.blogCard} glass-card`}>
                        <div className={styles.blogCardImage}>
                            <img src={post.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop&q=60'} alt={post.title} />
                        </div>
                        <div className={styles.blogMeta}>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span style={{ color: 'var(--primary)' }}>{post.category}</span>
                        </div>
                        <h3>{post.title}</h3>
                        <div className={styles.readMoreLink}>
                            Read Article <ArrowRight size={14} />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default HomeBlogSection;
