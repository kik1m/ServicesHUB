import React from 'react';
import { Shield, FileText, Scale, Clock } from 'lucide-react';

const Terms = () => {
    return (
        <div className="page-wrapper legal-page">
            <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '30px' }}>
                <div className="hero-content">
                    <div className="badge">LEGAL DOCUMENTS</div>
                    <h1 className="hero-title">Terms of <span className="gradient-text">Service</span></h1>
                    <p className="hero-subtitle">Last updated: March 26, 2026</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div className="glass-card legal-content" style={{ padding: '4rem', lineHeight: '1.8' }}>
                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Scale size={24} color="var(--primary)" /> 1. Acceptance of Terms
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            By accessing or using ServicesHUB, you agree to be bound by these Terms of Service. 
                            If you do not agree with any part of these terms, you may not access our services.
                        </p>
                    </div>

                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <FileText size={24} color="var(--primary)" /> 2. User Submissions
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            When you submit a tool to our directory, you represent that you have the right to 
                            share all information provided and that it does not infringe on any third-party rights. 
                            We reserve the right to remove any listing at our sole discretion.
                        </p>
                    </div>

                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={24} color="var(--primary)" /> 3. Accuracy of Information
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            While we strive for accuracy, ServicesHUB provides tool listings "as is". 
                            We are not responsible for the performance, reliability, or security of 
                            third-party tools listed in our directory.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Clock size={24} color="var(--primary)" /> 4. Modifications
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            We reserve the right to modify these terms at any time. Significant 
                            changes will be notified on this page.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Terms;
