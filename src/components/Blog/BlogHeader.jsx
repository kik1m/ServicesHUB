import React from 'react';
import { Search } from 'lucide-react';

const BlogHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="blog-hero-compact-v2">
            <div className="hero-content">
                <h1 className="hero-title-v2">Insights on the <span className="gradient-text">AI Revolution</span></h1>
                <p className="hero-subtitle-v2">Expert guides, industry news, and SaaS growth strategies delivered to you.</p>

                <div className="search-container-blog">
                    <div className="nav-search-wrapper">
                        <Search size={20} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default BlogHeader;
