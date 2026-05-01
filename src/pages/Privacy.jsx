import React from 'react';
import { Shield } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useLegalData } from '../hooks/useLegalData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Shared Legal Components
import LegalSection from '../components/Legal/LegalSection';

// Import Constants & Styles
import { LEGAL_UI_CONSTANTS } from '../constants/legalConstants';
import styles from './Privacy.module.css';

/**
 * Privacy Policy Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Privacy = () => {
    const { loading } = useLegalData();

    // 1. SEO Hardening (v2.0)
    useSEO({ pageKey: 'privacy' });

    return (
        <div className={styles.privacyView}>
            <PageHero 
                title={LEGAL_UI_CONSTANTS.privacy.hero.title}
                highlight={LEGAL_UI_CONSTANTS.privacy.hero.highlight}
                subtitle={LEGAL_UI_CONSTANTS.privacy.hero.subtitle}
                breadcrumbs={LEGAL_UI_CONSTANTS.privacy.hero.breadcrumbs}
                icon={<Shield size={24} />}
                isLoading={loading}
            />

            <section className={styles.mainSection}>
                <div className={styles.legalContent}>
                    {(loading ? LEGAL_UI_CONSTANTS.SKELETON_COUNTS.sections : LEGAL_UI_CONSTANTS.privacy.sections).map((section, index) => (
                        <LegalSection 
                            key={loading ? index : section.id}
                            isLoading={loading} 
                            number={loading ? (index + 1).toString() : section.id.toString()} 
                            title={loading ? "" : section.title}
                        >
                            {section.content}
                        </LegalSection>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Privacy;
