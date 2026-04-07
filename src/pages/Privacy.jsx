import React, { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Globe } from 'lucide-react';
import SkeletonLoader from '../components/SkeletonLoader';

// Import Shared Legal Components
import LegalHero from '../components/Legal/LegalHero';
import LegalSection from '../components/Legal/LegalSection';

// Import Modular CSS
import '../styles/pages/Legal.css';

const Privacy = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="page-wrapper legal-page">
                <LegalHero loading={true} />
                <section className="main-section" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <SkeletonLoader height="300px" borderRadius="16px" style={{ marginBottom: '2rem' }} />
                    <SkeletonLoader height="200px" borderRadius="16px" style={{ marginBottom: '2rem' }} />
                </section>
            </div>
        );
    }

    return (
        <div className="page-wrapper legal-page">
            <LegalHero 
                loading={false}
                badge="LEGAL DOCUMENTS"
                title="Privacy"
                accent="Policy"
                subtitle="Last updated: March 26, 2026"
            />

            <section className="main-section" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div className="glass-card legal-content">
                    <LegalSection icon={Eye} number="1" title="Data Collection">
                        We collect basic information when you use HUBly, such as your email
                        address when you sign up or submit a tool. This information is used
                        solely to provide our services and communicate with you.
                    </LegalSection>

                    <LegalSection icon={Lock} number="2" title="Security">
                        We take data security seriously. We use modern encryption and industry-standard
                        practices to ensure your account information remains safe and protected from
                        unauthorized access.
                    </LegalSection>

                    <LegalSection icon={Globe} number="3" title="Third-Party Links">
                        Our directory contains links to external websites. We are not responsible
                        for the privacy practices or content of these third-party platforms.
                        We encourage you to read their privacy policies.
                    </LegalSection>

                    <LegalSection icon={Shield} number="4" title="Your Rights">
                        You have the right to access, update, or delete your personal information
                        at any time from your profile settings. For any data-related queries,
                        please contact our support team.
                    </LegalSection>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
