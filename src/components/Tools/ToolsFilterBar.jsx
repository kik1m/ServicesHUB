import React from 'react';
import CustomSelect from '../CustomSelect';
import styles from './ToolsFilterBar.module.css';

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
        <div className={styles.filterBarLayout}>
            <div className={styles.categoryScrollContainer}>
                <div className={styles.categoryTabs}>
                    {['All', ...categories.map(c => c.name)].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`${styles.tabBtn} ${selectedCategory === cat ? styles.active : ''}`}
                        >
                            {cat === 'All' ? 'All Tools' : cat}
                        </button>
                    ))}
                </div>
            </div>
            <div className={styles.sortFilters}>
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
