import React from 'react';
import { Search as SearchIcon } from 'lucide-react';

const SearchHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className="search-header-premium">
            <h1>Explore the <span className="gradient-text">Universe</span></h1>
            <div className="search-input-wrapper">
                <SearchIcon size={22} className="search-icon-pos" />
                <input
                    type="text"
                    placeholder="Fine-tune your search..."
                    className="search-input-field"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchHeader;
