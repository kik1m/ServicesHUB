import React, { memo } from 'react';
import ToolCard from '../ToolCard';
import EmptyState from '../ui/EmptyState';
import Safeguard from '../ui/Safeguard';
import styles from './ProfileCollections.module.css';

/**
 * ProfileCollections - Pure View Component
 * Rule #12: Receiving stable data from parent
 * Rule #29: Safeguard Protection
 */
const ProfileCollections = memo(({ isLoading, favorites = [], error, onRetry, content }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.collectionsSection}>
                <h2 style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: '0', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0' }}>
                    User Saved Tools Collection
                </h2>
                {isLoading ? (
                    <div className={styles.toolsGrid}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <ToolCard key={`skeleton-fav-${i}`} isLoading={true} />
                        ))}
                    </div>
                ) : favorites?.length > 0 ? (
                    <div className={styles.toolsGrid}>
                        {favorites?.map(tool => (
                            <ToolCard key={tool?.id} tool={tool} />
                        ))}
                    </div>
                ) : (
                    <EmptyState 
                        message={content?.EMPTY_TITLE || "No favorites yet"} 
                        description={content?.EMPTY_DESC || "Start exploring and save your favorite AI tools here."}
                    />
                )}
            </div>
        </Safeguard>
    );
});

export default ProfileCollections;
