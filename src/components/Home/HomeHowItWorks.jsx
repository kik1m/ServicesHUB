import React from 'react';
import { Search, CheckCircle2, Zap } from 'lucide-react';
import styles from './HomeHowItWorks.module.css';

const HomeHowItWorks = () => {
    return (
        <section className={`main-section ${styles.howItWorks}`}>
            <div className="section-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 className="section-title">How <span className="gradient-text">HUBly</span> Works</h2>
                <p className="section-desc">Streamlining your tool search in three simple steps.</p>
            </div>
            <div className={styles.stepsGrid}>
                <div className={styles.stepCard}>
                    <div className={styles.stepNum}>01</div>
                    <div className={styles.stepIcon}><Search size={32} /></div>
                    <h3>Discover</h3>
                    <p>Explore our hand-picked collection of AI and SaaS gems.</p>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNum}>02</div>
                    <div className={styles.stepIcon}><CheckCircle2 size={32} /></div>
                    <h3>Compare</h3>
                    <p>Review features, pricing, and community feedback.</p>
                </div>
                <div className={styles.stepCard}>
                    <div className={styles.stepNum}>03</div>
                    <div className={styles.stepIcon}><Zap size={32} /></div>
                    <h3>Build</h3>
                    <p>Deploy the best tech and scale your next big idea.</p>
                </div>
            </div>
        </section>
    );
};

export default HomeHowItWorks;
