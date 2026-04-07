import React from 'react';
import { Target, Shield, Rocket } from 'lucide-react';

const AboutSideCards = () => {
    return (
        <div className="about-side-cards">
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                <div className="about-icon-box"><Target size={22} color="var(--secondary)" /></div>
                <h3>The Vision</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    To create the most trusted authority for software discovery in the AI era.
                </p>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', borderRadius: '24px' }}>
                <div className="about-icon-box"><Shield size={22} color="var(--primary)" /></div>
                <h3>The Trust</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    We partner with vetted creators to ensure every tool provides real value.
                </p>
            </div>
            
            <div className="glass-card about-join-card" style={{ padding: '2.5rem 2rem' }}>
                <Rocket size={24} style={{ marginBottom: '1rem' }} />
                <h3>Join the Journey</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '1.5rem' }}>
                    Be part of the fastest growing AI community.
                </p>
                <a href="/auth" className="btn-white-slim" style={{
                    display: 'inline-block', padding: '12px 24px', background: 'white',
                    color: 'var(--bg-dark)', borderRadius: '12px', fontWeight: '800',
                    fontSize: '0.85rem', textDecoration: 'none'
                }}>Get Started</a>
            </div>
        </div>
    );
};

export default AboutSideCards;
