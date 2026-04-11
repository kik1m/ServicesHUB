import { useState, useEffect, useMemo } from 'react';
import { faqService } from '../services/faqService';

/**
 * Hook for managing FAQ page state and filtering logic
 */
export const useFAQData = () => {
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const rawFaqs = useMemo(() => faqService.getFAQs(), []);
    const categories = useMemo(() => faqService.getCategories(), []);

    // Simulate initial loading
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const scrollToCategory = (category) => {
        setSelectedCategory(category);
        const id = category === 'All' ? 'faq-top' : category.replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed navbar
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
        }
    };

    // Derived State: Filtering logic (Now only filters search, categories stay visible for navigation)
    const filteredFaqs = useMemo(() => {
        return rawFaqs.map(group => {
            // Filter questions by Search Query
            const questions = group.questions.filter(faq => 
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return { ...group, questions };
        }).filter(group => group.questions.length > 0);
    }, [rawFaqs, searchQuery]);

    return {
        loading,
        activeIndex,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        categories,
        filteredFaqs,
        toggleAccordion,
        scrollToCategory
    };
};
