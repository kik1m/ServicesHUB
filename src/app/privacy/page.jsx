import React from 'react';
import { Shield } from 'lucide-react';
import { LEGAL_UI_CONSTANTS } from '@/constants/legalConstants';
import PageHero from '@/components/ui/PageHero';
import LegalSection from '@/components/Legal/LegalSection';
import styles from './page.module.css';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { privacy } = LEGAL_UI_CONSTANTS;
    return {
        title: privacy.seo.title,
        description: privacy.seo.description,
        openGraph: {
            title: privacy.seo.title,
            description: privacy.seo.description,
            type: 'website',
        },
    };
}

// Rule #2: SSG Revalidation
export const revalidate = 86400; // 24 hours

export default function PrivacyPage() {
    const { privacy } = LEGAL_UI_CONSTANTS;

    return (
        <div className={styles.privacyView}>
            <PageHero 
                title={privacy.hero.title}
                highlight={privacy.hero.highlight}
                subtitle={privacy.hero.subtitle}
                breadcrumbs={privacy.hero.breadcrumbs}
                icon={<Shield size={24} />}
                isLoading={false}
            />

            <section className={styles.mainSection}>
                <div className={styles.legalContent}>
                    {privacy.sections.map((section) => (
                        <LegalSection 
                            key={section.id}
                            isLoading={false} 
                            number={section.id.toString()} 
                            title={section.title}
                        >
                            {section.content}
                        </LegalSection>
                    ))}
                </div>
            </section>
        </div>
    );
}
