import React from 'react';
import { Search } from 'lucide-react';
import styles from './FAQHero.module.css';

const FAQHero = ({ searchQuery, setSearchQuery }) => {
    return (
        <header className="page-header hero-section" style={{ minHeight: '35vh', paddingBottom: '40px' }}>
            <div className="hero-content">
                <div className={styles.heroSubContent}>
                    <div className="badge">FAQS</div>
                    <h1 className="hero-title">How can we <span className="gradient-text">help you?</span></h1>
                    
                    <div className={styles.searchContainer}>
                        <div className={styles.searchWrapper}>
                            <Search size={22} color="var(--primary)" />
                            <input 
                                type="text" 
                                placeholder="Search for questions..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FAQHero;
