import React from 'react';
import Breadcrumbs from '../Breadcrumbs';

const CompareHero = () => {
    return (
        <header className="page-header hero-section-slim">
            <div className="hero-content">
                <Breadcrumbs items={[
                    { label: 'Directory', link: '/tools' },
                    { label: 'Comparison', link: '/compare' }
                ]} />
                <div className="badge">DECISION TOOL</div>
                <h1 className="hero-title-slim">Compare <span className="gradient-text">AI Tools</span></h1>
                <p className="hero-subtitle-slim">Make data-driven decisions by comparing features and pricing side-by-side.</p>
            </div>
        </header>
    );
};

export default CompareHero;
