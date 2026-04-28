import React from 'react';
import { Link } from 'react-router-dom';
import ToolCard from '../ToolCard';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { SKELETON_COUNTS } from '../../constants/toolDetailConstants';
import styles from './ToolDetailRelated.module.css';

const ToolDetailRelated = ({ relatedTools, isLoading, content }) => {
    // Rule #11 & #4: Component-Owned Skeletons
    if (isLoading) {
        return (
            <div className={styles.relatedSection}>
                <div className={styles.sectionHeader}>
                    <Skeleton width="220px" height="32px" borderRadius="8px" />
                </div>
                <div className={styles.toolsGrid}>
                    {SKELETON_COUNTS.RELATED_TOOLS.map(i => (
                        <ToolCard key={`skeleton-related-${i}`} isLoading={true} />
                    ))}
                </div>
            </div>
        );
    }

    // Rule #31: Empty State Handling
    if (!relatedTools || relatedTools.length === 0) {
        return (
            <div className={styles.relatedSection}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>
                        {content.related.title} <span className={styles.highlight}>{content.related.highlight}</span>
                    </h2>
                </div>
                <EmptyState 
                    message={content.related.empty}
                    description={content.related.desc}
                />
            </div>
        );
    }

    return (
        <div className={styles.relatedSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                    {content.related.title} <span className={styles.highlight}>{content.related.highlight}</span>
                </h2>
                <Button as={Link} to="/tools" variant="text">Browse Directory</Button>
            </div>
            <div className={styles.toolsGrid}>
                {relatedTools.map(rTool => (
                    <ToolCard key={rTool.id || rTool.slug} tool={rTool} />
                ))}
            </div>
        </div>
    );
};

export default ToolDetailRelated;
