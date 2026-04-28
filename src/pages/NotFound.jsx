import React from 'react';
import Skeleton from '../components/ui/Skeleton';
import useSEO from '../hooks/useSEO';
import { useNotFoundData } from '../hooks/useNotFoundData';

// Import Modular Components
import NotFoundHero from '../components/NotFound/NotFoundHero';
import NotFoundActions from '../components/NotFound/NotFoundActions';

// Import Modular CSS
import styles from './NotFound.module.css';

import { NOT_FOUND_UI_CONSTANTS } from '../constants/notFoundConstants';

const NotFound = () => {
    const { loading } = useNotFoundData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'notfound' });

    return (
        <div className={`page-wrapper ${styles.notFoundWrapper} fade-in`}>
            <div className={`glass-card ${styles.notFoundCard}`}>
                
                <NotFoundHero isLoading={loading} />

                <NotFoundActions isLoading={loading} />
                
            </div>
        </div>
    );
};

export default NotFound;



