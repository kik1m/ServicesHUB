import React from 'react';
import CustomSelect from '../CustomSelect';

const ToolsFilterBar = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    priceFilter, 
    setPriceFilter, 
    sortBy, 
    setSortBy 
}) => {
    return (
        <div className="filter-bar-layout">
            <div className="category-scroll-container">
                <div className="category-tabs">
                    {['All', ...categories.map(c => c.name)].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                        >
                            {cat === 'All' ? 'All Tools' : cat}
                        </button>
                    ))}
                </div>
            </div>
            <div className="sort-filters">
                <CustomSelect
                    options={[
                        { label: 'All Pricing', value: 'All' },
                        { label: 'Free', value: 'Free' },
                        { label: 'Freemium', value: 'Freemium' },
                        { label: 'Paid', value: 'Paid' }
                    ]}
                    value={priceFilter}
                    onChange={(val) => setPriceFilter(val)}
                    placeholder="Price"
                />
                <CustomSelect
                    options={[
                        { label: 'Newest First', value: 'Newest' },
                        { label: 'Top Rated', value: 'Rating' },
                        { label: 'Most Popular', value: 'Popular' }
                    ]}
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    placeholder="Sort By"
                />
            </div>
        </div>
    );
};

export default ToolsFilterBar;
