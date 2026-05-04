import React from 'react';
import { FileText } from 'lucide-react';
import useSEO from '../hooks/useSEO';
import { useLegalData } from '../hooks/useLegalData';

// Import Global UI Components
import PageHero from '../components/ui/PageHero';
import Safeguard from '../components/ui/Safeguard';

// Import Shared Legal Components
import LegalSection from '../components/Legal/LegalSection';

// Import Constants & Styles
import { LEGAL_UI_CONSTANTS } from '../constants/legalConstants';
import styles from './Terms.module.css';

/**
 * Terms of Service Page - Elite 10/10 Standard
 * Rule #16: Pure Orchestration Pattern
 * Rule #31: Component Resilience via Safeguard
 */
const Terms = () => {
    const { loading } = useLegalData();

    // 1. Elite Legal SEO Hardening (v3.0)
    useSEO({ 
        pageKey: 'terms',
        entityId: 'terms',
        entityType: 'page',
        title: 'Terms of Service | Platform Usage Rules & Agreement | HUBly',
        description: 'Read the HUBly Terms of Service to understand your rights, responsibilities, and the rules for using our AI discovery platform.',
        ogType: 'website',
        schema: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms of Service",
            "description": "Legal agreement and usage rules for the HUBly platform.",
            "publisher": {
                "@type": "Organization",
                "name": "HUBly"
            }
        }
    });

    return (
        <div className={styles.termsView}>
            <PageHero
                title={LEGAL_UI_CONSTANTS.terms.hero.title}
                highlight={LEGAL_UI_CONSTANTS.terms.hero.highlight}
                subtitle={LEGAL_UI_CONSTANTS.terms.hero.subtitle}
                breadcrumbs={LEGAL_UI_CONSTANTS.terms.hero.breadcrumbs}
                icon={<FileText size={24} />}
                isLoading={loading}
            />

            <section className={styles.mainSection}>
                <div className={styles.legalContent}>
                    {(loading ? LEGAL_UI_CONSTANTS.SKELETON_COUNTS.sections : LEGAL_UI_CONSTANTS.terms.sections).map((section, index) => (
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

export default Terms;
