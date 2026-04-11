import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import { useNotFoundData } from '../hooks/useNotFoundData';

// Import Modular Components
import NotFoundHero from '../components/NotFound/NotFoundHero';
import NotFoundActions from '../components/NotFound/NotFoundActions';

// Import Modular CSS
import styles from './NotFound.module.css';

const NotFound = () => {
    const { loading } = useNotFoundData();

    useSEO({
        title: "404 - Page Not Found | HUBly",
        description: "Oops! The page you're looking for doesn't exist. Head back to HUBly to discover the best AI and SaaS tools.",
    });

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.notFoundWrapper}`}>
                <div className={`glass-card ${styles.notFoundCard}`}>
                    <SkeletonLoader height="400px" borderRadius="24px" />
                </div>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.notFoundWrapper}`}>
            <div className={`glass-card ${styles.notFoundCard}`}>
                
                <NotFoundHero />

                <NotFoundActions />
                
            </div>
        </div>
    );
};

export default NotFound;
