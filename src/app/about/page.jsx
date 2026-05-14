import React from 'react';
import { Info } from 'lucide-react';

// Import Global UI Components
import PageHero from '../../components/ui/PageHero';
import Safeguard from '../../components/ui/Safeguard';

// Import Modular Components
import AboutStatsGrid from '../../components/About/AboutStatsGrid';
import AboutMission from '../../components/About/AboutMission';
import AboutSideCards from '../../components/About/AboutSideCards';

// Import Constants & Styles
import { ABOUT_UI_CONSTANTS } from '../../constants/aboutConstants';
import styles from './About.module.css';

export const metadata = {
    title: 'About HUBly | Trusted AI Tools Discovery & SaaS Platform',
    description: 'Learn about HUBly, the ultimate AI tools discovery platform. Our mission is to help users find, compare, and scale with the best SaaS and AI software worldwide.',
    openGraph: {
        title: 'About HUBly Platform',
        description: 'Professional AI & SaaS discovery and comparison engine.',
        url: 'https://www.hubly-tools.com/about',
        siteName: 'HUBly',
        images: [{ url: 'https://www.hubly-tools.com/og-image.jpg' }],
        type: 'website',
    },
};

/**
 * About Page - Next.js SSG
 */
export default function AboutPage() {
    // Static content renders instantly
    const loading = false;

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
            
            {/* JSON-LD Schema for Elite SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "AboutPage",
                    "name": "About HUBly Platform",
                    "description": "Professional AI & SaaS discovery and comparison engine.",
                    "publisher": {
                        "@type": "Organization",
                        "name": "HUBly",
                        "logo": "https://www.hubly-tools.com/android-chrome-512x512.png"
                    }
                }) }}
            />
        </div>
    );
}
