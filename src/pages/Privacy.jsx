import React from 'react';
import { Shield, Eye, Lock, Globe } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="page-wrapper legal-page">
            <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '30px' }}>
                <div className="hero-content">
                    <div className="badge">LEGAL DOCUMENTS</div>
                    <h1 className="hero-title">Privacy <span className="gradient-text">Policy</span></h1>
                    <p className="hero-subtitle">Last updated: March 26, 2026</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '850px', margin: '0 auto' }}>
                <div className="glass-card legal-content" style={{ padding: '4rem', lineHeight: '1.8' }}>
                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Eye size={24} color="var(--primary)" /> 1. Data Collection
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            We collect basic information when you use ServicesHUB, such as your email 
                            address when you sign up or submit a tool. This information is used 
                            solely to provide our services and communicate with you.
                        </p>
                    </div>

                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Lock size={24} color="var(--primary)" /> 2. Security
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            We take data security seriously. We use modern encryption and industry-standard 
                            practices to ensure your account information remains safe and protected from 
                            unauthorized access.
                        </p>
                    </div>

                    <div className="legal-section" style={{ marginBottom: '3rem' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Globe size={24} color="var(--primary)" /> 3. Third-Party Links
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            Our directory contains links to external websites. We are not responsible 
                            for the privacy practices or content of these third-party platforms. 
                            We encourage you to read their privacy policies.
                        </p>
                    </div>

                    <div className="legal-section">
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Shield size={24} color="var(--primary)" /> 4. Your Rights
                        </h3>
                        <p style={{ color: 'var(--text-muted)' }}>
                            You have the right to access, update, or delete your personal information 
                            at any time from your profile settings. For any data-related queries, 
                            please contact our support team.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Privacy;
