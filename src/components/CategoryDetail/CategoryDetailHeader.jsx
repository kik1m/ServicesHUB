import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { getIcon } from '../../utils/iconMap';
import styles from './CategoryDetailHeader.module.css';

const CategoryDetailHeader = ({ category, totalResults }) => {
    const navigate = useNavigate();
    
    return (
        <header className={styles.categoryHeader}>
            {/* Background Glow Effect */}
            <div className={styles.categoryHeaderGlowBg} style={{ background: 'var(--primary)' }}></div>

            <div className={styles.heroContent}>
                <Breadcrumbs items={[
                    { label: 'Categories', link: '/categories' },
                    { label: category.name }
                ]} />
                
                <button 
                    onClick={() => navigate('/categories')} 
                    className={`btn-text ${styles.backButton}`}
                >
                    <ArrowLeft size={18} /> All Categories
                </button>

                <div className={styles.categoryHeaderIconBox}>
                    {getIcon(category.icon_name || 'LayoutGrid', 40)}
                </div>

                <h1 className={styles.heroTitle}>
                    {category.name} Tools
                </h1>
                <p className={styles.heroSubtitle}>
                    Expertly curated {category.name} tools to help you build better and faster.
                </p>
                <div className={styles.categoryBadge}>
                    {totalResults.toLocaleString()} Tools Available
                </div>
            </div>
        </header>
    );
};

export default CategoryDetailHeader;
