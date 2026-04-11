import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';
import SkeletonLoader from '../SkeletonLoader';
import styles from './CategoriesGrid.module.css';

const CategoriesGrid = ({ categories, counts, loading }) => {
    if (loading) {
        return (
            <div className={styles.categoriesGridLarge}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className={`glass-card ${styles.categoryCardPremium}`}>
                        <SkeletonLoader type="avatar" width="54px" height="54px" borderRadius="16px" />
                        <SkeletonLoader type="text" width="60%" />
                        <SkeletonLoader type="text" width="30%" height="8px" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className={styles.categoriesGridLarge}>
            {categories.map((cat, i) => (
                <Link to={`/category/${cat.slug}`} key={i} className={`glass-card ${styles.categoryCardPremium}`}>
                    <div className={styles.catCountBadge}>
                        <span>{counts[cat.id] || 0}</span> Tools
                    </div>
                    <div className={styles.catIconGlow}>
                        {getIcon(cat.icon_name || 'LayoutGrid', 22)}
                    </div>
                    <h3>{cat.name}</h3>
                    <p>Browse <ChevronRight size={10} /></p>
                </Link>
            ))}
        </div>
    );
};

export default CategoriesGrid;
