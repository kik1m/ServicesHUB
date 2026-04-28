import { useState, useMemo } from 'react';
import { faqService } from '../services/faqService';
import { FAQ_UI_CONSTANTS } from '../constants/faqConstants';

/**
 * useFAQData - Elite Logic Layer
 * Rule #1: Logic Isolation
 * Rule #14: Constants SSOT
 */
export const useFAQData = () => {
    const { categories: categoryLabels } = FAQ_UI_CONSTANTS;
    
    // Instant render for local data
    const [activeIndex, setActiveIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoryLabels.all);

    const rawFaqs = useMemo(() => faqService.getFAQs(), []);
    const categories = useMemo(() => faqService.getCategories(), []);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const scrollToCategory = (category) => {
        setSelectedCategory(category);
        const id = category === categoryLabels.all ? 'faq-top' : category.replace(/\s+/g, '-');
        const element = document.getElementById(id);
        if (element) {
            const offset = 100; // Account for fixed navbar
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
        }
    };

    const filteredFaqs = useMemo(() => {
        return rawFaqs.map(group => {
            const questions = group.questions.filter(faq => 
                faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                faq.a.toLowerCase().includes(searchQuery.toLowerCase())
            );

            return { ...group, questions };
        }).filter(group => group.questions.length > 0);
    }, [rawFaqs, searchQuery]);

    return {
        loading: false, // Instant render
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
