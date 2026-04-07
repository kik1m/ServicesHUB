import React, { useState, useEffect } from 'react';
import { HelpCircle, Zap, Shield } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular Components
import FAQHero from '../components/FAQ/FAQHero';
import FAQCategoryFilter from '../components/FAQ/FAQCategoryFilter';
import FAQList from '../components/FAQ/FAQList';
import FAQContactCTA from '../components/FAQ/FAQContactCTA';

// Import Modular CSS
import '../styles/Pages/FAQ.css';

// FAQ Static Data
const FAQ_DATA = [
    {
        category: 'General',
        icon: <HelpCircle size={20} />,
        questions: [
            { q: "What is HUBly?", a: "HUBly is a curated directory of the world's most innovative AI and SaaS tools, designed to help founders and developers discover the right software for their needs." },
            { q: "Is it free to use?", a: "Yes, browsing and discovering tools on HUBly is completely free for all users." }
        ]
    },
    {
        category: 'Submissions',
        icon: <Zap size={20} />,
        questions: [
            { q: "How do I submit my tool?", a: "Click the 'Submit Tool' button in the navigation bar and follow the 4-step process. Our team will review your submission within 24-48 hours." },
            { q: "Can I edit my tool after submission?", a: "Currently, you need to contact our support team to make changes to a live listing. We are working on a dashboard feature to allow self-editing." }
        ]
    },
    {
        category: 'Safety & Trust',
        icon: <Shield size={20} />,
        questions: [
            { q: "Are the tools verified?", a: "We perform a basic check on every tool submitted to ensure it is functional and safe. However, we always recommend reading reviews and doing your own due diligence." },
            { q: "How can I report a broken link?", a: "You can use the 'Contact Support' page to report any technical issues or broken links you find on the platform." }
        ]
    }
];

const FAQ = () => {
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="page-wrapper faq-page">
                <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
                    <div className="hero-content">
                        <SkeletonLoader type="title" width="40%" style={{ margin: '0 auto' }} />
                    </div>
                </header>
                <section className="main-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <SkeletonLoader key={i} height="80px" borderRadius="16px" style={{ marginBottom: '1rem' }} />
                    ))}
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper faq-page">
            
            <FAQHero 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
            />

            <section className="main-section" style={{ maxWidth: '900px', margin: '0 auto' }}>
                
                <FAQCategoryFilter 
                    categories={FAQ_DATA.map(f => f.category)}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                />

                <FAQList 
                    faqs={FAQ_DATA}
                    searchQuery={searchQuery}
                    selectedCategory={selectedCategory}
                    activeIndex={activeIndex}
                    toggleAccordion={toggleAccordion}
                />

                <FAQContactCTA />

            </section>
        </div>
    );
};

export default FAQ;
