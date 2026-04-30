import React from 'react';
import { Sparkles, Star } from 'lucide-react';
import { getIcon } from '../../utils/iconMap.jsx';
import Breadcrumbs from '../Breadcrumbs';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './ToolDetailHeader.module.css';

/**
 * ToolDetailHero - Isolated Custom Version
 * Fully decoupled from global PageHero to allow precise dynamic control.
 */
const ToolDetailHero = ({ tool, breadcrumbs, isLoading, error, onRetry, content }) => {
    if (isLoading) {
        return (
            <section className={styles.isolatedHeroSection}>
                <div className={styles.heroLayoutWrapper}>
                    <Skeleton width="120px" height="20px" />
                    <Skeleton width="60%" height="50px" />
                </div>
            </section>
        );
    }

    if (!tool) return null;

    const catName = tool?.categories?.name || content?.sidebar?.anonymous;
    const catIcon = tool?.categories?.icon_name || 'Sparkles';
    const CategoryIconElement = getIcon(catIcon, 14);

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <section className={styles.isolatedHeroSection}>
                <div className={styles.heroContainer}>
                    {/* 1. Breadcrumbs Layer */}
                    {breadcrumbs && (
                        <div className={styles.breadcrumbLayer}>
                            <Breadcrumbs items={breadcrumbs} isLoading={false} />
                        </div>
                    )}

                    <div className={styles.heroLayoutWrapper}>
                        {/* 2. Category Badge */}
                        <div className={styles.heroCategoryBadge}>
                            <span className={styles.badgeIconWrapper}>{CategoryIconElement}</span>
                            <span className={styles.badgeText}>{catName}</span>
                        </div>

                        {/* 3. Main Professional Content */}
                        <div className={styles.mainTitleGroup}>
                            <h1 className={styles.eliteHeadingText}>
                                {content?.hero?.titlePrefix} <span className={styles.toolNameHighlight}>{tool?.name}</span>
                            </h1>
                            <p className={styles.heroSubTagline}>
                                {tool?.short_description || content?.hero?.defaultTagline}
                            </p>
                        </div>

                        {/* 4. Unified Rating (Sidebar Match) */}
                        <div className={styles.sidebarMatchedRating}>
                            <Star 
                                size={18} 
                                className={styles.starIconSidebar} 
                                fill={tool?.reviews_count > 0 ? "currentColor" : "transparent"} 
                            />
                            <span className={styles.ratingValueTextGold}>
                                {tool?.reviews_count > 0 ? tool?.rating?.toFixed(1) : '0.0'} 
                                <span className={styles.reviewCountTextGold}> ({tool?.reviews_count || 0})</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>
        </Safeguard>
    );
};

export default ToolDetailHero;
