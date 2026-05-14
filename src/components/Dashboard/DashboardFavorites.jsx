'use client';
import React from 'react';
import Link from 'next/link';
import ToolCard from '../ToolCard';
import styles from './DashboardFavorites.module.css';
import Safeguard from '../ui/Safeguard';

/**
 * DashboardFavorites - Elite Discovery Section
 */
const DashboardFavorites = ({ favorites = [], isLoading, error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.favoritesSection}>
                <h2 className={styles.title}>{content?.title}</h2>
                <div className={styles.favoritesGrid}>
                    {isLoading ? (
                        [1, 2, 3, 4].map((_, i) => (
                            <ToolCard key={`skeleton-fav-${i}`} isLoading={true} />
                        ))
                    ) : (favorites?.length > 0) ? (
                        favorites?.map(tool => (
                            <ToolCard key={tool?.id} tool={tool} />
                        ))
                    ) : (
                        <div className={styles.emptyWrapper}>
                            <h3 className={styles.emptyTitle}>{content?.empty?.title}</h3>
                            <p className={styles.emptyText}>{content?.empty?.text}</p>
                            <Link href="/tools" className={styles.emptyAction}>
                                {content?.empty?.action}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </Safeguard>
    );
};

export default DashboardFavorites;
