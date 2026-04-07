import React, { useState, useEffect } from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumbs from '../components/Breadcrumbs';

// Import Modular Components
import AboutHero from '../components/About/AboutHero';
import AboutStatsGrid from '../components/About/AboutStatsGrid';
import AboutMission from '../components/About/AboutMission';
import AboutSideCards from '../components/About/AboutSideCards';

// Import Modular CSS
import '../styles/Pages/About.css';

const About = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="about-view-wrapper container" style={{ padding: '120px 5% 60px' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                    <SkeletonLoader height="400px" borderRadius="32px" />
                </div>
            </div>
        );
    }

    return (
        <div className="about-view-wrapper container" style={{ padding: '80px 5% 60px' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />

                <AboutHero />

                <AboutStatsGrid />

                <div className="about-main-grid">
                    <AboutMission />
                    <AboutSideCards />
                </div>

            </div>
        </div>
    );
};

export default About;
