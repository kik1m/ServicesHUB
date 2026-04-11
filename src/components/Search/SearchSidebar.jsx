import React, { useState } from 'react';
import { Filter, Check, Search } from 'lucide-react';
import styles from './SearchSidebar.module.css';

const SearchSidebar = ({ 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    pricingModels, 
    selectedPrice, 
    setSelectedPrice 
}) => {
    const [catSearch, setCatSearch] = useState('');

    // Filter categories based on internal search
    const filteredCategories = categories.filter(cat => 
        cat.name.toLowerCase().includes(catSearch.toLowerCase())
    );

    return (
        <aside className={styles.searchSidebar}>
            <div className={`glass-card ${styles.sidebarCard}`}>
                <div className={styles.sidebarFilterHeader}>
                    <Filter size={20} />
                    <h3>Filter Tools</h3>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>CATEGORY</label>
                    <div className={styles.categorySearchWrapper}>
                        <Search size={14} className={styles.catSearchIcon} />
                        <input 
                            type="text" 
                            placeholder="Find category..." 
                            className={styles.categorySearchInput}
                            value={catSearch}
                            onChange={(e) => setCatSearch(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterOptionsVertical}>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.active : ''}`}
                                >
                                    {cat.name} {selectedCategory === cat.id && <Check size={14} />}
                                </button>
                            ))
                        ) : (
                            <p className={styles.noCatsFound}>No categories found</p>
                        )}
                    </div>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.filterLabel}>PRICING</label>
                    <div className={styles.pricingFilterChips}>
                        {pricingModels.map(price => (
                            <button
                                key={price}
                                onClick={() => setSelectedPrice(price)}
                                className={`${styles.pricingChip} ${selectedPrice === price ? styles.active : ''}`}
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
