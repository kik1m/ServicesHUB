import React from 'react';
import useSEO from '../hooks/useSEO';
import { useNotFoundData } from '../hooks/useNotFoundData';

// Import Modular Components
import NotFoundHero from '../components/NotFound/NotFoundHero';
import NotFoundActions from '../components/NotFound/NotFoundActions';

// Import Modular CSS
import styles from './NotFound.module.css';

/**
 * NotFound Page - Elite 404 Hardening
 * Rule #34: Broken paths MUST be hidden from crawlers
 */
const NotFound = () => {
    const { loading } = useNotFoundData();

    // 1. Elite Error Security (v3.0)
    // Rule #34: Prevent indexing of thin/broken content
    useSEO({ 
        title: 'Page Not Found | HUBly',
        description: 'The requested page does not exist on HUBly platform.',
        noindex: true,
        robots: "noindex, nofollow, noarchive",
        ogType: 'website',
        schema: null
    });

    return (
        <main className={`page-wrapper ${styles.notFoundWrapper} fade-in`}>
            <div className={`glass-card ${styles.notFoundCard}`}>
                <NotFoundHero isLoading={loading} />
                <NotFoundActions isLoading={loading} />
            </div>
        </main>
    );
};

export default NotFound;



