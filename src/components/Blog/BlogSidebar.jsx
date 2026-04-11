import React from 'react';
import { Link } from 'react-router-dom';
import { Share2 } from 'lucide-react';
import styles from './BlogSidebar.module.css';

const BlogSidebar = ({ relatedPosts }) => {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.widget}>
                <h4>
                    <Share2 size={18} color="var(--primary)" /> Newsletter
                </h4>
                <p>
                    Get the latest AI tools and trends directly in your inbox.
                </p>
                <input 
                    type="email" 
                    placeholder="Email address" 
                    className={styles.newsInput}
                />
                <button className={styles.subscribeBtn}>
                    Subscribe
                </button>
            </div>

            {relatedPosts && relatedPosts.length > 0 && (
                <div className={styles.widget}>
                    <h4>Related Articles</h4>
                    <div className={styles.relatedList}>
                        {relatedPosts.map(p => (
                            <Link key={p.id} to={`/blog/${p.id}`} className={styles.relatedItem}>
                                <div className={styles.thumbWrapper}>
                                    <img 
                                        src={p.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=100&auto=format&fit=crop&q=60'} 
                                        alt="" 
                                        className={styles.thumbImg}
                                    />
                                </div>
                                <h5>{p.title}</h5>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default BlogSidebar;
