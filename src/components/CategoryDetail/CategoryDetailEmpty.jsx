import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import styles from './CategoryDetailEmpty.module.css';

const CategoryDetailEmpty = ({ categoryName }) => {
    return (
        <section className={styles.emptySection}>
            <div className={`glass-card ${styles.submitCtaCard}`}>
                <Zap size={32} className={styles.iconBox} />
                <h3 className={styles.title}>Know a great {categoryName} tool?</h3>
                <p className={styles.description}>
                    Help others discover the best solutions in this category. Submit your own or a tool you love to grow this niche!
                </p>
                <Link to="/submit" className={`btn-outline ${styles.submitBtn}`}>
                    Submit to this Category
                </Link>
            </div>
        </section>
    );
};

export default CategoryDetailEmpty;
