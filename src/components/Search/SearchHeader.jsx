import React from 'react';
import { Search as SearchIcon } from 'lucide-react';
import styles from './SearchHeader.module.css';

const SearchHeader = ({ searchQuery, setSearchQuery }) => {
    return (
        <div className={styles.searchHeaderPremium}>
            <h1>Explore the <span className="gradient-text">Universe</span></h1>
            <div className={styles.searchInputWrapper}>
                <SearchIcon size={22} className={styles.searchIconPos} />
                <input
                    type="text"
                    placeholder="Fine-tune your search..."
                    className={styles.searchInputField}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
    );
};

export default SearchHeader;
