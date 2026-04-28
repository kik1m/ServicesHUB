import React, { useState, useEffect } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import Input from '../ui/Input';
import Skeleton from '../ui/Skeleton';
import PageHero from '../ui/PageHero';
import styles from './SearchHeader.module.css';

const SearchHeader = (props) => {
    const { searchQuery, setSearchQuery, isLoading, content } = props;
    
    // Elite Concept: Local UI Buffer for zero-lag typing, synced with URL state
    const [localQuery, setLocalQuery] = useState(searchQuery);

    // Sync from URL to Local only when they deviate externally (e.g. Back button)
    useEffect(() => {
        if (searchQuery !== localQuery) {
            setLocalQuery(searchQuery);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);

    // Rule #15: Named Handler
    const handleSearchChange = (e) => {
        const val = e.target.value;
        setLocalQuery(val);
        setSearchQuery(val); // The URL setter (debounced safely by nature of router)
    };

    return (
        <PageHero 
            title={content.title} 
            highlight={content.highlight}
            breadcrumbs={content.breadcrumbs}
        >
            <div className={styles.inputSection}>
                {isLoading && !localQuery ? (
                    <div className={styles.skeletonInputWrapper}>
                        <Skeleton width="100%" height="56px" borderRadius="100px" />
                    </div>
                ) : (
                    <Input
                        placeholder={content.placeholder}
                        icon={SearchIcon}
                        value={localQuery}
                        onChange={handleSearchChange}
                        className={styles.searchInputWrapper}
                        wrapperClassName={styles.searchInputInner}
                        variant="pill"
                    />
                )}
            </div>
        </PageHero>
    );
};

export default SearchHeader;




