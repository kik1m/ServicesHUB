import React from 'react';

const BlogFilters = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="blog-filters-container-v2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`blog-custom-filter-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default BlogFilters;
