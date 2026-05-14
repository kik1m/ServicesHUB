import React from 'react';
import { Search, BookOpen } from 'lucide-react';
import Input from '../ui/Input';
import PageHero from '../ui/PageHero';
import { BLOG_CONSTANTS } from '../../constants/blogConstants';
import styles from './BlogHero.module.css';

import Safeguard from '../ui/Safeguard';

/**
 * BlogHero - Leverages the Unified Elite PageHero
 * Rule #19: Standardized platform headers
 */
const BlogHero = ({ searchQuery, setSearchQuery, error, onRetry }) => {
    const { HERO } = BLOG_CONSTANTS;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <PageHero
                title={HERO?.TITLE}
                highlight={HERO?.HIGHLIGHT}
                subtitle={HERO?.SUBTITLE}
                breadcrumbs={HERO?.BREADCRUMBS}
                badge={
                    <div className={styles.eliteBadge}>
                        <BookOpen size={14} className={styles.badgeIcon} />
                        <span>{HERO?.BADGE}</span>
                    </div>
                }
            >
                {/* Centralized Search Bar integrated as Hero Children */}
                <div className={styles.searchContainer}>
                    <Input 
                        variant="pill"
                        icon={Search}
                        placeholder={HERO?.SEARCH_PLACEHOLDER}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        wrapperClassName={styles.glassSearch}
                    />
                </div>
            </PageHero>
        </Safeguard>
    );
};

export default React.memo(BlogHero);
