import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getIcon } from '../../utils/iconMap';

const HomeCategories = ({ categories, loading }) => {
    return (
        <section className="main-section categories-preview">
            <div className="section-header-row">
                <div className="text-left">
                    <h2 className="section-title">Top Categories</h2>
                    <p className="section-desc">Find tools by your specific niche and needs.</p>
                </div>
                <Link to="/categories" className="view-all-link">View All Categories <ArrowRight size={18} /></Link>
            </div>

            <div className="categories-grid-small">
                {loading ? (
                    [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="glass-card skeleton" style={{ height: '80px', borderRadius: '20px' }}></div>
                    ))
                ) : (
                    categories.map((cat, i) => (
                        <Link to={`/category/${cat.slug}`} key={i} className="glass-card category-item-small">
                            <div className="cat-icon-wrapper">{getIcon(cat.icon_name)}</div>
                            <div className="cat-info">
                                <h3>{cat.name}</h3>
                                <p>Discover</p>
                            </div>
                            <ArrowRight className="cat-arrow" size={16} />
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
};

export default HomeCategories;
