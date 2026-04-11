import React from 'react';
import styles from './CompareHero.module.css';

const CompareHero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroContent}>
                <h1 className={styles.title}>
                    Compare AI <span className="gradient-text">Tools</span>
                </h1>
                <p className={styles.subtitle}>
                    Make informed decisions by comparing the world's most innovative AI and SaaS tools side-by-side. Analyze features, ratings, and pricing in one view.
                </p>
            </div>
        </section>
    );
};

export default CompareHero;
