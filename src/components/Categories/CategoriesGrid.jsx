import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';
import SkeletonLoader from '../SkeletonLoader';

const CategoriesGrid = ({ categories, counts, loading }) => {
    if (loading) {
        return (
            <div className="categories-grid-large">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="glass-card category-card-premium skeleton-card">
                        <SkeletonLoader type="avatar" width="54px" height="54px" borderRadius="16px" />
                        <SkeletonLoader type="text" width="60%" />
                        <SkeletonLoader type="text" width="30%" height="8px" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="categories-grid-large">
            {categories.map((cat, i) => (
                <Link to={`/category/${cat.slug}`} key={i} className="glass-card category-card-premium">
                    <div className="cat-count-badge">
                        <span>{counts[cat.id] || 0}</span> Tools
                    </div>
                    <div className="cat-icon-glow">
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
