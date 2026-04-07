import React from 'react';
import { Zap, Users, Globe, Award } from 'lucide-react';

const AboutStatsGrid = () => {
    const stats = [
        { icon: <Zap size={20} />, label: 'AI Tools Vetted', value: '2,500+' },
        { icon: <Users size={20} />, label: 'Active Innovators', value: '50k+' },
        { icon: <Globe size={20} />, label: 'Monthly Reach', value: '1.2M+' },
        { icon: <Award size={20} />, label: 'Market Trust', value: '98%' },
    ];

    return (
        <div className="about-stats-grid">
            {stats.map((stat, i) => (
                <div key={i} className="glass-card stat-card-slim">
                    <div className="stat-icon-wrapper">
                        {stat.icon}
                    </div>
                    <div className="stat-value-text">{stat.value}</div>
                    <div className="stat-label-text">{stat.label}</div>
                </div>
            ))}
        </div>
    );
};

export default AboutStatsGrid;
