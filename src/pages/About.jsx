import React from 'react';
import SkeletonLoader from '../components/SkeletonLoader';
import Breadcrumbs from '../components/Breadcrumbs';
import useSEO from '../hooks/useSEO';
import { useAboutData } from '../hooks/useAboutData';

// Import Modular Components
import AboutHero from '../components/About/AboutHero';
import AboutStatsGrid from '../components/About/AboutStatsGrid';
import AboutMission from '../components/About/AboutMission';
import AboutSideCards from '../components/About/AboutSideCards';

// Import Modular CSS
import styles from './About.module.css';

const About = () => {
    const { loading } = useAboutData();

    useSEO({
        title: "About Us | Discover ServicesHUB",
        description: "Learn about the mission, vision, and the team behind ServicesHUB - your curated platform for tool discovery.",
    });

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.viewWrapper}`}>
                <div className={styles.container} style={{ padding: '120px 5% 60px' }}>
                    <SkeletonLoader height="400px" borderRadius="32px" />
                    <div style={{ marginTop: '2rem' }}>
                        <SkeletonLoader height="150px" borderRadius="24px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.viewWrapper}`}>
            <div className={styles.container} style={{ padding: '80px 5% 60px' }}>
                
                <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'About Us' }]} />

                <AboutHero />

                <AboutStatsGrid />

                <div className={styles.mainGrid}>
                    <AboutMission />
                    <AboutSideCards />
                </div>

            </div>
        </div>
    );
};

export default About;
