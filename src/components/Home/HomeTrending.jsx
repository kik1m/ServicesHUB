import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import { SECTION_LIMITS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeTrending.module.css';

/**
 * HomeTrending - Elite Data Section
 * Rule #29: Pure View with Safeguard protection
 * Rule #16: Orchestration via Parent
 */
const HomeTrending = ({ trendingTools = [], isLoading, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const visibleTools = useMemo(() => {
        const safeTools = trendingTools?.filter(Boolean) ?? [];
        return safeTools.slice(0, SECTION_LIMITS.TRENDING);
    }, [trendingTools]);

    return (
        <Safeguard error={error}>
            <section className={styles.trendingSection}>
                <SectionHeader 
                    title="Trending" 
                    subtitle="Now" 
                    description="Popular tools and AI solutions gaining traction today."
                    subtitleClassName={styles.redGradientText}
                >
                    <span className={styles.livePill}><span className={styles.dot}></span> LIVE DATA</span>
                </SectionHeader>

                {/* Rule #31: Empty State Handling */}
                {!isLoading && visibleTools.length === 0 ? (
                    <EmptyState 
                        title="No trending tools" 
                        message="Check back soon for the most popular selections." 
                    />
                ) : (
                    <div className={styles.trendingGrid}>
                        {isLoading ? (
                            SKELETON_COUNTS.TRENDING_ITEMS.map((i) => (
                                <div key={`skeleton-trend-${i}`} className={styles.trendingItem}>
                                    <Skeleton className={styles.skeletonIcon} />
                                    <div className={styles.trendingToolInfo}>
                                        <Skeleton className={styles.skeletonTitle} />
                                        <Skeleton className={styles.skeletonSubtitle} />
                                    </div>
                                    <Skeleton className={styles.skeletonArrow} />
                                </div>
                            ))
                        ) : (
                            visibleTools.map(tool => {
                                if (!tool?.slug) return null;
                                return (
                                    <Link to={`/tool/${tool.slug}`} key={tool.id || tool.slug} className={styles.trendingItem}>
                                        <div className={styles.trendingToolIcon}>
                                            <SmartImage 
                                                src={tool.image_url} 
                                                alt={tool.name} 
                                                fallbackIcon={Zap}
                                            />
                                        </div>
                                        <div className={styles.trendingToolInfo}>
                                            <h4>{tool.name}</h4>
                                            <div className={styles.trendingStats}>
                                                <TrendingUp size={12} /> {(tool.view_count || 0).toLocaleString()} views
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className={styles.trendingArrow} />
                                    </Link>
                                );
                            })
                        )}
                    </div>
                )}
            </section>
        </Safeguard>
    );
};

export default HomeTrending;
