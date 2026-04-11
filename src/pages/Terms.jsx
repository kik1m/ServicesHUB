import React from 'react';
import { FileText, Clock, Scale, Shield } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';
import useSEO from '../hooks/useSEO';
import { useLegalData } from '../hooks/useLegalData';

// Import Shared Legal Components
import LegalHero from '../components/Legal/LegalHero';
import LegalSection from '../components/Legal/LegalSection';

// Import Modular CSS
import styles from './Terms.module.css';

const Terms = () => {
    const { loading } = useLegalData();

    useSEO({
        title: "Terms of Service | HUBly Usage",
        description: "Review the terms and conditions for using ServicesHUB. Understand your rights and responsibilities as a user.",
    });

    if (loading) {
        return (
            <div className={`page-wrapper ${styles.termsPage}`}>
                <LegalHero loading={true} isCompact={true} />
                <section className={styles.mainSection}>
                    <SkeletonLoader height="400px" borderRadius="16px" />
                </section>
            </div>
        );
    }

    return (
        <div className={`page-wrapper ${styles.termsPage}`}>
            <LegalHero 
                loading={false}
                isCompact={true}
                badge="LEGAL DOCUMENTS"
                title="Terms of"
                accent="Service"
                subtitle="Last updated: March 26, 2026"
            />

            <section className={styles.mainSection}>
                <div className={`glass-card ${styles.legalContent}`}>
                    <LegalSection icon={Scale} number="1" title="Acceptance of Terms">
                        By accessing or using HUBly, you agree to be bound by these Terms of Service.
                        If you do not agree with any part of these terms, you may not access our services.
                    </LegalSection>

                    <LegalSection icon={FileText} number="2" title="User Submissions">
                        When you submit a tool to our directory, you represent that you have the right to
                        share all information provided and that it does not infringe on any third-party rights.
                        We reserve the right to remove any listing at our sole discretion.
                    </LegalSection>

                    <LegalSection icon={Shield} number="3" title="Accuracy of Information">
                        While we strive for accuracy, HUBly provides tool listings &quot;as is&quot;.
                        We are not responsible for the performance, reliability, or security of
                        third-party tools listed in our directory.
                    </LegalSection>

                    <LegalSection icon={Clock} number="4" title="Modifications">
                        We reserve the right to modify these terms at any time. Significant
                        changes will be notified on this page.
                    </LegalSection>
                </div>
            </section>
        </div>
    );
};

export default Terms;
