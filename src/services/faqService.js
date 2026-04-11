import React from 'react';
import { HelpCircle, Zap, Shield } from 'lucide-react';

/**
 * Static Data for FAQ
 * Moving this here to isolate components from raw data
 */
export const FAQ_DATA = [
    {
        category: 'General',
        icon: HelpCircle,
        questions: [
            { q: "What is HUBly?", a: "HUBly is a curated directory of the world's most innovative AI and SaaS tools, designed to help founders and developers discover the right software for their needs." },
            { q: "Is it free to use?", a: "Yes, browsing and discovering tools on HUBly is completely free for all users." }
        ]
    },
    {
        category: 'Submissions',
        icon: Zap,
        questions: [
            { q: "How do I submit my tool?", a: "Click the 'Submit Tool' button in the navigation bar and follow the 4-step process. Our team will review your submission within 24-48 hours." },
            { q: "Can I edit my tool after submission?", a: "Currently, you need to contact our support team to make changes to a live listing. We are working on a dashboard feature to allow self-editing." }
        ]
    },
    {
        category: 'Safety & Trust',
        icon: Shield,
        questions: [
            { q: "Are the tools verified?", a: "We perform a basic check on every tool submitted to ensure it is functional and safe. However, we always recommend reading reviews and doing your own due diligence." },
            { q: "How can I report a broken link?", a: "You can use the 'Contact Support' page to report any technical issues or broken links you find on the platform." }
        ]
    }
];

export const faqService = {
    getFAQs: () => FAQ_DATA,
    getCategories: () => FAQ_DATA.map(f => f.category)
};
