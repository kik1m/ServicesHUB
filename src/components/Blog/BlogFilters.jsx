import React from 'react';
import styles from './BlogFilters.module.css';

const BlogFilters = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className={styles.filtersContainer}>
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`${styles.filterPill} ${selectedCategory === cat ? styles.active : ''}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default BlogFilters;
