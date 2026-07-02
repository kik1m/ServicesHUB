import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Search, Star, MessageSquare, Rocket, Shield, Settings, Menu, X, CheckCircle, TrendingUp } from 'lucide-react';
import styles from './DocsSidebar.module.css';

export const DOCS_NAVIGATION = [
    {
        title: 'Getting Started',
        icon: <BookOpen size={18} />,
        links: [
            { title: 'Welcome to HUBly', href: '/docs' },
            { title: 'Account & Settings', href: '/docs/account' },
        ]
    },
    {
        title: 'Community & Profile',
        icon: <Star size={18} />,
        links: [
            { title: 'Public Profile', href: '/docs/profile' },
            { title: 'Social Following', href: '/docs/social' },
        ]
    },
    {
        title: 'Discovery & AI Search',
        icon: <Search size={18} />,
        links: [
            { title: 'Global Search', href: '/docs/search' },
            { title: 'AI Assistant', href: '/docs/ai-assistant' },
        ]
    },
    {
        title: 'Comparison Engine',
        icon: <CheckCircle size={18} />,
        links: [
            { title: 'Compare Builder', href: '/docs/compare' },
            { title: 'Matrix Verdict', href: '/docs/verdict' },
        ]
    },
    {
        title: 'Maker\'s Guide',
        icon: <Rocket size={18} />,
        links: [
            { title: 'Submit a Tool', href: '/docs/submit' },
            { title: 'Creator Dashboard', href: '/docs/dashboard' },
            { title: 'Edit Tool', href: '/docs/edit' },
        ]
    },
    {
        title: 'Growth & Promotions',
        icon: <TrendingUp size={18} />,
        links: [
            { title: 'Promotion Plans', href: '/docs/promotions' },
            { title: 'Premium Subscriptions', href: '/docs/premium' },
        ]
    },
    {
        title: 'Engagement',
        icon: <MessageSquare size={18} />,
        links: [
            { title: 'Reviews & Ratings', href: '/docs/reviews' },
            { title: 'Favorites & Collections', href: '/docs/collections' },
        ]
    },
    {
        title: 'Legal & Policies',
        icon: <Shield size={18} />,
        links: [
            { title: 'Terms of Service', href: '/docs/terms' },
            { title: 'Privacy Policy', href: '/docs/privacy' },
            { title: 'Community Guidelines', href: '/docs/guidelines' },
        ]
    }
];

const DocsSidebar = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
            
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2>Documentation</h2>
                    <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>
                
                <nav className={styles.nav}>
                    {DOCS_NAVIGATION.map((section, idx) => (
                        <div key={idx} className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                {section.icon}
                                <span>{section.title}</span>
                            </h3>
                            <ul className={styles.linkList}>
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link 
                                            href={link.href}
                                            className={`${styles.link} ${pathname === link.href ? styles.active : ''}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {link.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default DocsSidebar;
