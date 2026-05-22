import React from 'react';
import ReviewsSection from '../ReviewsSection';
import { useCompareReviews } from '../../hooks/useCompareReviews';
import { TOOL_DETAIL_UI_CONSTANTS } from '../../constants/toolDetailConstants';
import styles from './CompareReviews.module.css';

/**
 * CompareReviews - Elite Component
 * Renders tabbed reviews for two tools side-by-side using the unified ReviewsSection.
 */
const CompareReviews = ({ tool1, tool2 }) => {
    const { activeTab, setActiveTab } = useCompareReviews();

    if (!tool1?.id || !tool2?.id) return null;

    // Use unified constants for consistency across the platform
    const reviewContent = TOOL_DETAIL_UI_CONSTANTS.reviews;

    return (
        <section className={styles.compareReviewsContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>What the Community Says</h2>
                <p className={styles.subtitle}>Read authentic experiences for both tools</p>
            </div>
            
            <div className={styles.tabsWrapper}>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 1 ? styles.active : ''}`}
                    onClick={() => setActiveTab(1)}
                >
                    <img src={tool1.image_url} alt={tool1.name} className={styles.tabIcon} />
                    {tool1.name} Reviews
                </button>
                <button 
                    className={`${styles.tabBtn} ${activeTab === 2 ? styles.active : ''}`}
                    onClick={() => setActiveTab(2)}
                >
                    <img src={tool2.image_url} alt={tool2.name} className={styles.tabIcon} />
                    {tool2.name} Reviews
                </button>
            </div>

            <div className={styles.tabContent}>
                {activeTab === 1 && (
                    <ReviewsSection 
                        toolId={tool1.id} 
                        content={reviewContent} 
                    />
                )}
                {activeTab === 2 && (
                    <ReviewsSection 
                        toolId={tool2.id} 
                        content={reviewContent} 
                    />
                )}
            </div>
        </section>
    );
};

export default CompareReviews;
