import React from 'react';
import { Filter, Check } from 'lucide-react';

const SearchSidebar = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    pricingModels, 
    selectedPrice, 
    setSelectedPrice 
}) => {
    return (
        <aside className="search-sidebar">
            <div className="glass-card" style={{ padding: '2rem' }}>
                <div className="sidebar-filter-header">
                    <Filter size={20} />
                    <h3>Filter Tools</h3>
                </div>

                <div className="filter-group">
                    <label className="filter-label">CATEGORY</label>
                    <div className="filter-options-vertical">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                            >
                                {cat.name} {selectedCategory === cat.id && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="filter-group">
                    <label className="filter-label">PRICING</label>
                    <div className="pricing-filter-chips">
                        {pricingModels.map(price => (
                            <button
                                key={price}
                                onClick={() => setSelectedPrice(price)}
                                className={`pricing-chip ${selectedPrice === price ? 'active' : ''}`}
                            >
                                {price}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SearchSidebar;
