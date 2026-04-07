import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const AboutMission = () => {
    const points = [
        'Human-Vetted Content', 'Daily Tool Updates',
        'Creator Growth Tools', 'Transparent Reviews'
    ];

    return (
        <div className="glass-card about-mission-card">
            <h2>Our Mission</h2>
            <p>
                In an era where thousands of AI tools are released weekly, finding the right one is overwhelming.
                HUBly was born to solve this. We meticulously curate, test, and categorize
                the world's most innovative software to ensure you spend less time searching
                and more time building.
            </p>

            <div className="about-points-grid">
                {points.map((point, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CheckCircle2 size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.95rem', fontWeight: '600' }}>{point}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutMission;
