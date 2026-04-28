import React, { useMemo } from 'react';
import ToolCard from '../ToolCard';
import Safeguard from '../ui/Safeguard';
import CategoryDetailEmpty from './CategoryDetailEmpty';
import { SKELETON_COUNTS } from '../../constants/categoryConstants';
import styles from './CategoryToolsGrid.module.css';

/**
 * CategoryToolsGrid Component
 * Rule #16: Section Responsibility (Grid Mapping only)
 * Rule #32: Defensive Rendering Rule (CRITICAL SAFETY)
 * Rule #31: Empty State Handling Rule (CRITICAL UX)
 * Rule #24: Rendering Integrity & Stability Rules
 */
const CategoryToolsGrid = (props) => {
    const { 
        isLoading, 
        tools = [], 
        categoryName = 'Category',
        error,
        onRetry
    } = props;

    // Rule #32: Double-Layer Defensive Guard
    const safeTools = useMemo(() => tools?.filter(Boolean) ?? [], [tools]);

    // Rule #31: Empty State Handling inside grid section
    if (!isLoading && safeTools?.length === 0 && !error) {
        return <CategoryDetailEmpty categoryName={categoryName} />;
    }

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.toolsGrid}>
                {isLoading ? (
                    // Rule #24.2: Skeleton keys from unified constants
                    SKELETON_COUNTS?.TOOLS_GRID?.map((i) => (
                        <ToolCard key={`skeleton-grid-${i}`} isLoading={true} />
                    ))
                ) : (
                    safeTools?.map((tool) => {
                        // Rule #38: Silent Failure Prevention
                        if (!tool?.slug) return null;
                        
                        return (
                            <ToolCard 
                                key={tool.id || tool.slug} 
                                tool={tool} 
                                error={error}
                                onRetry={onRetry}
                            />
                        );
                    })
                )}
            </div>
        </Safeguard>
    );
};

export default CategoryToolsGrid;
