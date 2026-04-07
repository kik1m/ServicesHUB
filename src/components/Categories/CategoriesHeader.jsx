import React from 'react';
import { Search } from 'lucide-react';

const CategoriesHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <>
            <header className="page-header hero-section-slim">
                <div className="hero-content">
                    <div className="badge">CATEGORIES</div>
                    <h1 className="hero-title-slim">Browse by <span className="gradient-text">Niche</span></h1>
                    <p className="hero-subtitle-slim">Find the specialized tools you need for any project or industry.</p>
                </div>
            </header>

            <div className="category-search-container" style={{ paddingTop: '2rem' }}>
                <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 2.5rem' }}>
                    <Search size={20} color="var(--primary)" />
                    <input 
                        type="text" 
                        placeholder="Search categories (e.g. Content, Dev...)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>
        </>
    );
};

export default CategoriesHeader;
