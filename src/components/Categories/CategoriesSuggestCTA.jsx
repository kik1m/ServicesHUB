import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import styles from './CategoriesSuggestCTA.module.css';

const CategoriesSuggestCTA = () => {
    return (
        <div className={`glass-card ${styles.suggestContainer}`}>
            <Zap size={32} className={styles.icon} />
            <h3 className={styles.title}>Suggest a Category</h3>
            <p className={styles.description}>
                Didn&apos;t find the right niche? We are always expanding our directory. Let us know what you are looking for!
            </p>
            <Link to="/contact" className={`btn-outline ${styles.button}`}>Tell us what&apos;s missing</Link>
        </div>
    );
};

export default CategoriesSuggestCTA;
