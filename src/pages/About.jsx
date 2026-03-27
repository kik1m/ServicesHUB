import React from 'react';
import { Rocket, Target, Shield, Users, ArrowRight, CheckCircle2 } from 'lucide-react';

const About = () => {
    return (
        <div className="page-wrapper">
            <header className="page-header hero-section" style={{ minHeight: '40vh', paddingBottom: '40px' }}>
                <div className="hero-content">
                    <div className="badge">OUR STORY</div>
                    <h1 className="hero-title">Beyond Just a <span className="gradient-text">Directory</span></h1>
                    <p className="hero-subtitle">We build the bridge between human creativity and artificial intelligence tools.</p>
                </div>
            </header>

            <section className="main-section" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="glass-card about-main-content" style={{ padding: '4rem', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Our Mission</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.8' }}>
                        In a world where new AI tools are released every hour, discovery becomes a challenge. 
                        ServicesHUB was born to solve this. We meticulously curate, test, and categorize 
                        the world's most innovative software to ensure you spend less time searching 
                        and more time building.
                    </p>

                    <div className="mission-points" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
                        <div className="m-point" style={{ display: 'flex', gap: '12px' }}>
                            <CheckCircle2 color="var(--primary)" size={20} />
                            <span>Premium Curation</span>
                        </div>
                        <div className="m-point" style={{ display: 'flex', gap: '12px' }}>
                            <CheckCircle2 color="var(--primary)" size={20} />
                            <span>Reliable Reviews</span>
                        </div>
                        <div className="m-point" style={{ display: 'flex', gap: '12px' }}>
                            <CheckCircle2 color="var(--primary)" size={20} />
                            <span>Community Driven</span>
                        </div>
                    </div>
                </div>

                <div className="value-prop-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        <div className="logo-icon" style={{ marginBottom: '1.5rem', width: 'fit-content' }}><Target size={24} /></div>
                        <h3>The Vision</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '0.95rem' }}>
                            To create the most trusted authority for software discovery in the AI era.
                        </p>
                    </div>
                    <div className="glass-card" style={{ padding: '2.5rem' }}>
                        <div className="logo-icon" style={{ marginBottom: '1.5rem', width: 'fit-content' }}><Shield size={24} /></div>
                        <h3>The Trust</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.8rem', fontSize: '0.95rem' }}>
                            We partner with the best so you can build with full confidence.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
