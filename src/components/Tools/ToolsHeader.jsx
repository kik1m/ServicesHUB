import React from 'react';
import { Search } from 'lucide-react';

const ToolsHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    totalResults, 
    loading 
}) => {
    return (
        <>
            <header className="hero-section-slim">
                <div className="hero-content">
                    <h1 className="hero-title-slim">Explore All <span className="gradient-text">Tools</span></h1>
                    <p className="hero-subtitle-slim">Discover the most powerful AI and SaaS solutions curated for professionals.</p>
                </div>
            </header>

            <div className="search-stats-container" style={{ paddingTop: '2rem' }}>
                <div className="hero-search-wrapper-large glass-card" style={{ maxWidth: '600px', margin: '0 auto 1rem' }}>
                    <Search size={22} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Find your next favorite AI tool..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {loading ? 'Searching...' : `Found ${totalResults.toLocaleString()} world-class tools`}
                </div>
            </div>
        </>
    );
};

export default ToolsHeader;
