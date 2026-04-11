import React from 'react';
import styles from './AboutHero.module.css';

const AboutHero = () => {
    return (
        <header className={styles.header}>
            <div className={styles.badge}>OUR STORY</div>
            <h1>Building the future of <span className="gradient-text">tool discovery</span></h1>
            <p className="section-desc" style={{ maxWidth: '700px', margin: '0 auto' }}>
                ServicesHUB was born from a simple mission: to empower creators and developers 
                by providing a curated, high-performance platform for discovering the best tools in the ecosystem.
            </p>
        </header>
    );
};

export default AboutHero;
