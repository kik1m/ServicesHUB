import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import styles from './HomePublisherCTA.module.css';

const HomePublisherCTA = () => {
    return (
        <section className={`main-section ${styles.publisherCtaSection}`}>
            <div className={styles.publisherCtaContent}>
                <img src="/logo.png" alt="HUBly" className={styles.publisherCtaLogo} />
                
                <div className={`badge ${styles.publisherCtaBadge}`}>FOR TOOL OWNERS</div>
                
                <h2 className="section-title">
                    Are you building something <span className="gradient-text">Great</span>?
                </h2>
                
                <p className={styles.publisherCtaDesc}>
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
