import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

const HomePublisherCTA = () => {
    return (
        <section className="main-section publisher-cta-section">
            <div className="publisher-cta-content">
                <img src="/logo.png" alt="HUBly" className="publisher-cta-logo" />
                
                <div className="badge publisher-cta-badge">FOR TOOL OWNERS</div>
                
                <h2 className="section-title">
                    Are you building something <span className="gradient-text">Great</span>?
                </h2>
                
                <p className="publisher-cta-desc">
                    Reach thousands of developers, entrepreneurs, and AI enthusiasts. 
                    Submit your tool for free today and get the exposure your product deserves.
                </p>
                
                <div className="cta-actions-row">
                    <Link to="/auth" className="btn-primary">
                        Get Started Free <Zap size={18} />
                    </Link>
                    <Link to="/promote" className="btn-outline">
                        Explore Advertising <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HomePublisherCTA;
