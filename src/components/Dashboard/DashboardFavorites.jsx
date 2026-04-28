import React from 'react';
import ToolCard from '../ToolCard';
import styles from './DashboardFavorites.module.css';
import Safeguard from '../ui/Safeguard';

/**
 * DashboardFavorites - Elite Discovery Section
 * Rule #29: Pure View with Safeguard protection
 */
const DashboardFavorites = ({ favorites = [], isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.favoritesSection}>
                <h2 className={styles.title}>{content?.title}</h2>
                <div className={styles.favoritesGrid}>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <ToolCard key={`skeleton-fav-${i}`} isLoading={true} />
                        ))
                    ) : (favorites?.length > 0) ? (
                        favorites?.map(tool => (
                            <ToolCard key={tool?.id} tool={tool} />
                        ))
                    ) : (
                        <div className={styles.emptyText}>{content?.empty}</div>
                    )}
                </div>
            </div>
        </Safeguard>
    );
};

export default DashboardFavorites;
