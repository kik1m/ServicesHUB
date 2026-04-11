import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';
import SkeletonLoader from '../SkeletonLoader';
import styles from './HomeCategories.module.css';

const HomeCategories = ({ categories, loading }) => {
    return (
        <section className="main-section categories-preview">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Top Categories</h2>
                    <p className="section-desc">Find tools by your specific niche and needs.</p>
                </div>
                <Link to="/categories" className={styles.viewAllLink}>View All Categories <ArrowRight size={18} /></Link>
            </div>

            <div className={styles.categoriesGridSmall}>
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <SkeletonLoader key={i} type="category" />
                    ))
                ) : (
                    (categories || []).map((cat, i) => (
                        <Link to={`/category/${cat?.slug}`} key={i} className={`glass-card ${styles.categoryItemSmall}`}>
                            <div className={styles.catIconWrapper}>{getIcon(cat.icon_name)}</div>
                            <div className={styles.catInfo}>
                                <h3>{cat.name}</h3>
                                <p>Discover</p>
                            </div>
                            <ArrowRight className={styles.catArrow} size={16} />
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeCategories;
