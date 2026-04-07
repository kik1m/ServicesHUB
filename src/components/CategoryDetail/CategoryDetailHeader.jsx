import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../Breadcrumbs';
import { getIcon } from '../../utils/iconMap';

const CategoryDetailHeader = ({ category, totalResults }) => {
    const navigate = useNavigate();
    
    return (
        <header className="category-header hero-section-slim">
            {/* Background Glow Effect */}
            <div className="category-header-glow-bg" style={{ background: 'var(--primary)' }}></div>

            <div className="hero-content">
                <Breadcrumbs items={[
                    { label: 'Categories', link: '/categories' },
                    { label: category.name }
                ]} />
                
                <button onClick={() => navigate('/categories')} className="btn-text" style={{ marginBottom: '2rem', color: 'white' }}>
                    <ArrowLeft size={18} /> All Categories
                </button>

                <div className="category-header-icon-box">
                    {getIcon(category.icon_name || 'LayoutGrid', 40)}
                </div>

                <h1 className="hero-title-slim">
                    {category.name} Tools
                </h1>
                <p className="hero-subtitle-slim" style={{ margin: '1rem auto' }}>
                    Expertly curated {category.name} tools to help you build better and faster.
                </p>
                <div className="badge">
                    {totalResults.toLocaleString()} Tools Available
                </div>
            </div>
        </header>
    );
};

export default CategoryDetailHeader;
