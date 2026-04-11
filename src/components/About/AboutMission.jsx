import React from 'react';
import { Target, Eye, Shield, Heart } from 'lucide-react';
import styles from './AboutMission.module.css';

const AboutMission = () => {
    return (
        <div className={`${styles.missionCard} glass-card`}>
            <h2 className="section-title">Our <span className="gradient-text">Mission</span></h2>
            <p className="section-desc" style={{ marginBottom: '2.5rem' }}>
                We believe that the right tool can transform a workflow. Our goal is to bridge the gap between innovation 
                and implementation by providing a seamless experience for finding the exact tool you need.
            </p>

            <div className={styles.pointsGrid}>
                <div className="mission-point">
                    <div className="icon-text-row" style={{ gap: '1rem', fontWeight: '700', marginBottom: '8px' }}>
                        <Target size={20} color="var(--primary)" /> Focus on Quality
                    </div>
                    <p className="text-muted-small">Only the most reliable and high-performing tools make it to our platform.</p>
                </div>
                <div className="mission-point">
                    <div className="icon-text-row" style={{ gap: '1rem', fontWeight: '700', marginBottom: '8px' }}>
                        <Eye size={20} color="var(--primary)" /> Radical Transparency
                    </div>
                    <p className="text-muted-small">Honest reviews and clear pricing structures for everything we list.</p>
                </div>
                <div className="mission-point">
                    <div className="icon-text-row" style={{ gap: '1rem', fontWeight: '700', marginBottom: '8px' }}>
                        <Shield size={20} color="var(--primary)" /> Security First
                    </div>
                    <p className="text-muted-small">Every tool undergoes a safety check before being featured on Hubly.</p>
                </div>
                <div className="mission-point">
                    <div className="icon-text-row" style={{ gap: '1rem', fontWeight: '700', marginBottom: '8px' }}>
                        <Heart size={20} color="var(--primary)" /> Community Led
                    </div>
                    <p className="text-muted-small">Driven by feedback from our global community of creators.</p>
                </div>
            </div>
        </div>
    );
};

export default AboutMission;
