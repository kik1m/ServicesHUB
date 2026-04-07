import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Modular Components
import NotFoundHero from '../components/NotFound/NotFoundHero';
import NotFoundActions from '../components/NotFound/NotFoundActions';

// Import Modular CSS
import '../styles/pages/NotFound.css';

const NotFound = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 400);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="not-found-page not-found-wrapper">
                <SkeletonLoader height="400px" width="600px" borderRadius="24px" />
            </div>
        );
    }

    return (
        <div className="not-found-page not-found-wrapper">
            <div className="glass-card not-found-card">
                
                <NotFoundHero />

                <NotFoundActions />
                
            </div>
        </div>
    );
};

export default NotFound;
