import React from 'react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { FAQ_UI_CONSTANTS } from '../../constants/faqConstants';
import styles from './FAQCategoryFilter.module.css';

const FAQCategoryFilter = ({ categories = [], selectedCategory, scrollToCategory, isLoading, error, onRetry }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.categoriesRow}>
                    {FAQ_UI_CONSTANTS.SKELETON_COUNTS.categories.map(i => (
                        <Skeleton key={i} className={styles.skeletonPill} />
                    ))}
                </div>
            ) : (
                <div className={styles.categoriesRow}>
                    <button 
                        className={`${styles.pill} ${selectedCategory === FAQ_UI_CONSTANTS.categories.all ? styles.active : ''}`}
                        onClick={() => scrollToCategory(FAQ_UI_CONSTANTS.categories.all)}
                    >
                        {FAQ_UI_CONSTANTS.categories.all}
                    </button>
                    {categories?.map((cat, i) => (
                        <button 
                            key={i} 
                            className={`${styles.pill} ${selectedCategory === cat ? styles.active : ''}`}
                            onClick={() => scrollToCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}
        </Safeguard>
    );
};


export default FAQCategoryFilter;




