import React from 'react';
import { Rocket, Sparkles, Plus } from 'lucide-react';
import styles from './AboutSideCards.module.css';

const AboutSideCards = () => {
    return (
        <div className={styles.sideStack}>
            <div className={`${styles.card} glass-card`} style={{ padding: '2.5rem' }}>
                <div className={styles.iconBox}>
                    <Rocket size={20} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Our Vision</h3>
                <p className="text-muted-small" style={{ lineHeight: '1.7' }}>
                    To become the global standard for software discovery, where every project finds its perfect technical companion.
                </p>
            </div>

            <div className={`${styles.card} glass-card`} style={{ padding: '2.5rem' }}>
                <div className={styles.iconBox}>
                    <Sparkles size={20} color="var(--primary)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>Constant Growth</h3>
                <p className="text-muted-small" style={{ lineHeight: '1.7' }}>
                    We are constantly iterating, adding new features, and refining our database to serve you better every day.
                </p>
            </div>

            <div className={`${styles.card} ${styles.joinCard} glass-card`} style={{ padding: '2.5rem' }}>
                <h3 style={{ marginBottom: '1rem', fontWeight: '800' }}>Join the Journey</h3>
                <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem', opacity: '0.9' }}>
                    Have a tool to share? Be part of our growing ecosystem.
                </p>
                <button className={`btn-secondary ${styles.joinBtn}`}>
                    Submit a Tool <Plus size={18} />
                </button>
            </div>
        </div>
    );
};

export default AboutSideCards;
