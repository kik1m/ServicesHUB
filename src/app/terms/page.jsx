import React from 'react';
import { FileText } from 'lucide-react';
import { LEGAL_UI_CONSTANTS } from '@/constants/legalConstants';
import PageHero from '@/components/ui/PageHero';
import LegalSection from '@/components/Legal/LegalSection';
import styles from './page.module.css';

// Rule #2: Metadata & SEO Logic
export async function generateMetadata() {
    const { terms } = LEGAL_UI_CONSTANTS;
    return {
        title: terms.seo.title,
        description: terms.seo.description,
        openGraph: {
            title: terms.seo.title,
            description: terms.seo.description,
            type: 'website',
        },
    };
}

// Rule #2: SSG Revalidation
export const revalidate = 86400; // 24 hours for static legal pages

export default function TermsPage() {
    const { terms } = LEGAL_UI_CONSTANTS;

    return (
        <div className={styles.termsView}>
            <PageHero
                title={terms.hero.title}
                highlight={terms.hero.highlight}
                subtitle={terms.hero.subtitle}
                breadcrumbs={terms.hero.breadcrumbs}
                icon={<FileText size={24} />}
                isLoading={false}
            />

            <section className={styles.mainSection}>
                <div className={styles.legalContent}>
                    {terms.sections.map((section) => (
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
