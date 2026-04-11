import React from 'react';
import { Search } from 'lucide-react';
import styles from './ToolsHeader.module.css';

const ToolsHeader = ({ 
    searchQuery, 
    setSearchQuery, 
    totalResults, 
    loading 
}) => {
    return (
        <>
            <header className={styles.heroSectionSlim}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitleSlim}>Explore All <span className="gradient-text">Tools</span></h1>
                    <p className={styles.heroSubtitleSlim}>Discover the most powerful AI and SaaS solutions curated for professionals.</p>
                </div>
            </header>

            <div className={styles.searchStatsContainer}>
                <div className={`${styles.heroSearchWrapperLarge} glass-card`}>
                    <Search size={22} color="var(--primary)" />
                    <input
                        type="text"
                        placeholder="Find your next favorite AI tool..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.resultsCount}>
                    {loading ? 'Searching...' : `Found ${totalResults.toLocaleString()} world-class tools`}
                </div>
            </div>
        </>
    );
};

export default ToolsHeader;
