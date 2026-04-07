import React from 'react';
import { Search, CheckCircle2, Zap } from 'lucide-react';

const HomeHowItWorks = () => {
    return (
        <section className="main-section how-it-works">
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="section-title">How <span className="gradient-text">HUBly</span> Works</h2>
                <p className="section-desc">Streamlining your tool search in three simple steps.</p>
            </div>
            <div className="steps-grid">
                <div className="step-card">
                    <div className="step-num">01</div>
                    <div className="step-icon"><Search size={32} /></div>
                    <h3>Discover</h3>
                    <p>Explore our hand-picked collection of AI and SaaS gems.</p>
                </div>
                <div className="step-card">
                    <div className="step-num">02</div>
                    <div className="step-icon"><CheckCircle2 size={32} /></div>
                    <h3>Compare</h3>
                    <p>Review features, pricing, and community feedback.</p>
                </div>
                <div className="step-card">
                    <div className="step-num">03</div>
                    <div className="step-icon"><Zap size={32} /></div>
                    <h3>Build</h3>
                    <p>Deploy the best tech and scale your next big idea.</p>
                </div>
            </div>
        </section>
    );
};

export default HomeHowItWorks;
