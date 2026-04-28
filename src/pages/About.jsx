import React from 'react';
import { Info } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useAboutData } from '../hooks/useAboutData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Modular Components
import AboutStatsGrid from '../components/About/AboutStatsGrid';
import AboutMission from '../components/About/AboutMission';
import AboutSideCards from '../components/About/AboutSideCards';

// Import Constants & Styles
import { ABOUT_UI_CONSTANTS } from '../constants/aboutConstants';
import styles from './About.module.css';

/**
 * About Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const About = () => {
    const { loading } = useAboutData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'about' });

    return (
        <div className={styles.viewWrapper}>
            <PageHero 
                title={ABOUT_UI_CONSTANTS.hero.title}
                highlight={ABOUT_UI_CONSTANTS.hero.highlight}
                subtitle={ABOUT_UI_CONSTANTS.hero.subtitle}
                breadcrumbs={ABOUT_UI_CONSTANTS.hero.breadcrumbs}
                icon={<Info size={24} />}
                isLoading={loading}
            />

            <div className={styles.container}>
                <Safeguard>
                    <AboutStatsGrid 
                        isLoading={loading} 
                        stats={ABOUT_UI_CONSTANTS.stats}
                    />

                    <main className={styles.mainGrid}>
                        <AboutMission 
                            isLoading={loading} 
                            content={ABOUT_UI_CONSTANTS.mission}
                        />
                        <AboutSideCards isLoading={loading} />
                    </main>
                </Safeguard>
            </div>
        </div>
    );
};

export default About;
