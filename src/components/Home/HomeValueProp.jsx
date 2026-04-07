import React from 'react';
import { Zap, Shield, Sparkles } from 'lucide-react';

const HomeValueProp = () => {
    return (
        <section className="main-section value-prop-section">
            <div className="section-header" style={{ marginBottom: '2.5rem' }}>
                <h2 className="section-title">Built for <span className="gradient-text">Efficiency</span></h2>
                <p className="section-desc">We simplify world-class tool discovery so you can focus on building.</p>
            </div>

            <div className="prop-grid-new">
                <div className="glass-card prop-card-premium">
                    <div className="prop-icon-bg"><Zap size={28} /></div>
                    <h4>Fast Access</h4>
                    <p>No more digging through search results. Get direct, tested links to the world&apos;s most innovative tools instantly.</p>
                </div>
                <div className="glass-card prop-card-premium">
                    <div className="prop-icon-bg"><Shield size={28} /></div>
                    <h4>Curated Quality</h4>
                    <p>We only list tools that meet our high standards of quality, reliability, and actual value for your business.</p>
                </div>
                <div className="glass-card prop-card-premium">
                    <div className="prop-icon-bg"><Sparkles size={28} /></div>
                    <h4>Latest Trends</h4>
                    <p>Stay updated with daily additions of the newest AI breakthroughs and SaaS innovations before they go viral.</p>
                </div>
            </div>
        </section>
    );
};

export default HomeValueProp;
