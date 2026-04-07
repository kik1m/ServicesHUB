import React from 'react';
import { Search } from 'lucide-react';

const FAQHero = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="page-header hero-section">
            <div className="hero-content">
                <div className="badge">KNOWLEDGE BASE</div>
                <h1 className="hero-title">Frequently Asked <span className="gradient-text">Questions</span></h1>
                <p className="hero-subtitle">Everything you need to know about HUBly platform.</p>

                <div className="faq-search-container">
                    <div className="faq-search-wrapper">
                        <Search className="search-icon" size={20} color="var(--primary)" />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FAQHero;
