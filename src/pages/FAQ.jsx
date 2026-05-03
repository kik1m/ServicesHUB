import React from 'react';
import { HelpCircle, Search } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useFAQData } from '../hooks/useFAQData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Input from '../components/ui/Input';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import FAQCategoryFilter from '../components/FAQ/FAQCategoryFilter';
import FAQList from '../components/FAQ/FAQList';
import FAQContactCTA from '../components/FAQ/FAQContactCTA';

// Import Constants & Styles
import { FAQ_UI_CONSTANTS } from '../constants/faqConstants';
import styles from './FAQ.module.css';

/**
 * FAQ Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
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

    // 1. SEO Hardening (v2.0)
    useSEO({ 
        pageKey: 'faq',
        schema: [
            {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": FAQ_UI_CONSTANTS.hero.breadcrumbs.map((item, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": item.label,
                    "item": item.path ? `https://hubly-tools.com${item.path}` : `https://hubly-tools.com/faq`
                }))
            },
            {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": filteredFaqs.slice(0, 10).map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    });

    return (
        <div className={styles.faqPage}>
            <PageHero 
                title={FAQ_UI_CONSTANTS.hero.title}
                highlight={FAQ_UI_CONSTANTS.hero.highlight}
                subtitle={FAQ_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={FAQ_UI_CONSTANTS.hero.breadcrumbs}
                icon={<HelpCircle size={24} />}
                isLoading={loading}
            >
                <div className={styles.searchWrapper}>
                    <Input 
                        placeholder={FAQ_UI_CONSTANTS.hero.searchPlaceholder}
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="pill"
                        isLoading={loading}
                    />
                </div>
            </PageHero>

            <section id="faq-top" className={styles.mainSection}>
                <div className={styles.container}>
                        <FAQCategoryFilter 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            scrollToCategory={scrollToCategory}
                            isLoading={loading}
                        />

                        <FAQList 
                            faqs={filteredFaqs}
                            activeIndex={activeIndex}
                            toggleAccordion={toggleAccordion}
                            isLoading={loading}
                        />

                        <FAQContactCTA content={FAQ_UI_CONSTANTS.cta} />
                </div>
            </section>
        </div>
    );
};

export default FAQ;
