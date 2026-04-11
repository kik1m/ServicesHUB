import React from 'react';
import { Search } from 'lucide-react';
import styles from './CategoriesHeader.module.css';

const CategoriesHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className={styles.header}>
            <div className={styles.heroContent}>
                <div className={styles.badge}>CATEGORIES</div>
                <h1 className={styles.heroTitle}>Browse by <span className="gradient-text">Niche</span></h1>
                <p className={styles.heroSubtitle}>Find the specialized tools you need for any project or industry.</p>
            </div>

            <div className={styles.searchContainer}>
                <div className={styles.searchWrapperLarge}>
                    <Search size={20} color="var(--primary)" />
                    <input 
                        type="text" 
                        placeholder="Search categories (e.g. Content, Dev...)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </header>
    );
};

export default CategoriesHeader;
