import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import ToolCard from '../ToolCard';
import SectionHeader from '../ui/SectionHeader';
import Safeguard from '../ui/Safeguard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { SECTION_LIMITS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeFeatured.module.css';

/**
 * HomeFeatured - Elite Editor Picks
 * Rule #29: Pure View with Safeguard protection
 */
const HomeFeatured = ({ tools = [], isLoading, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const visibleTools = useMemo(() => {
        const safeTools = tools?.filter(Boolean) ?? [];
        return safeTools.slice(0, SECTION_LIMITS.FEATURED);
    }, [tools]);

    return (
        <Safeguard error={error}>
            <section className={styles.featuredSection}>
                <SectionHeader 
                    title="Editor's" 
                    subtitle="Choice" 
                    description="Hand-picked premium tools for maximum productivity."
                />

                {!isLoading && visibleTools.length === 0 ? (
                    <EmptyState 
                        title="No featured items" 
                        message="Our editors are hand-picking the best tools for you. Come back soon." 
                        icon={Star}
                    />
                ) : (
                    <div className={styles.featuredToolsGrid}>
                        {isLoading ? (
                            SKELETON_COUNTS.FEATURED_ITEMS.map((i) => (
                                <ToolCard key={`skeleton-featured-${i}`} isLoading={true} />
                            ))
                        ) : (
                            visibleTools.map((tool) => {
                                if (!tool?.slug) return null;
                                return <ToolCard key={tool.id || tool.slug} tool={tool} />;
                            })
                        )}
                    </div>
                )}
            </section>
        </Safeguard>
    );
};

export default HomeFeatured;
