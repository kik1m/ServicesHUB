import React from 'react';
import styles from './FAQCategoryFilter.module.css';

const FAQCategoryFilter = ({ categories, selectedCategory, scrollToCategory }) => {
    return (
        <div className={styles.categoriesRow}>
            <button 
                className={`${styles.pill} ${selectedCategory === 'All' ? styles.active : ''}`}
                onClick={() => scrollToCategory('All')}
            >
                All
            </button>
            {categories.map((cat, i) => (
                <button 
                    key={i} 
                    className={`${styles.pill} ${selectedCategory === cat ? styles.active : ''}`}
                    onClick={() => scrollToCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default FAQCategoryFilter;
