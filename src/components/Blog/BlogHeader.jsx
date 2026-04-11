import React from 'react';
import { Search } from 'lucide-react';
import styles from './BlogHeader.module.css';

const BlogHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className={styles.heroCompact}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>Insights on the <span className="gradient-text">AI Revolution</span></h1>
                <p className={styles.heroSubtitle}>Expert guides, industry news, and SaaS growth strategies delivered to you.</p>

                <div className={styles.searchContainer}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BlogHeader;
