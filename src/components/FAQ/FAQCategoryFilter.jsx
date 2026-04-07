import React from 'react';

const FAQCategoryFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
    return (
        <div className="faq-categories-row">
            {['All', ...categories].map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default FAQCategoryFilter;
