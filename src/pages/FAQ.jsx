import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import { useFAQData } from '../hooks/useFAQData';

// Import Modular Components
import FAQHero from '../components/FAQ/FAQHero';
import FAQCategoryFilter from '../components/FAQ/FAQCategoryFilter';
import FAQList from '../components/FAQ/FAQList';
import FAQContactCTA from '../components/FAQ/FAQContactCTA';

// Import Modular CSS
import styles from './FAQ.module.css';

const FAQ = () => {
    const { 
        loading, 
        activeIndex, 
        searchQuery, 
        setSearchQuery, 
        selectedCategory, 
        categories,
        filteredFaqs,
        toggleAccordion,
        scrollToCategory
    } = useFAQData();

    useSEO({
        title: "FAQs | HUBly Support",
        description: "Find answers to common questions about HUBly, tool submissions, and platform safety. Our FAQ guide is here to help.",
    });

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.faqPage}`}>
                <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="title" width="40%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className={styles.mainSection}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <SkeletonLoader key={i} height="80px" borderRadius="16px" style={{ marginBottom: '1rem' }} />
                    ))}
                </section>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.faqPage}`}>
            
            <FAQHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section id="faq-top" className={styles.mainSection}>
                
                <FAQCategoryFilter 
                    categories={categories}
                    selectedCategory={selectedCategory}
                    scrollToCategory={scrollToCategory}
                />

                <FAQList 
                    faqs={filteredFaqs}
                    activeIndex={activeIndex}
                    toggleAccordion={toggleAccordion}
                />

                <FAQContactCTA />

            </section>
        </div>
    );
};

export default FAQ;
