import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Button from '../ui/Button';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import { SECTION_LIMITS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeLatestArrivals.module.css';

/**
 * HomeLatestArrivals - Elite Mini Discovery
 * Rule #29: Pure View with Safeguard protection
 */
const HomeLatestArrivals = ({ latestTools = [], isLoading, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const visibleTools = useMemo(() => {
        const safeTools = latestTools?.filter(Boolean) ?? [];
        return safeTools.slice(0, SECTION_LIMITS.LATEST);
    }, [latestTools]);

    return (
        <Safeguard error={error}>
            <section className={styles.latestSection}>
                <SectionHeader 
                    title="New" 
                    subtitle="Arrivals" 
                    description="The freshest AI solutions added to our directory this week."
                >
                    {!isLoading && visibleTools.length > 0 && (
                        <Button 
                            as={Link} 
                            to="/tools" 
                            variant="text" 
                            className={styles.viewAllLink}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            Browse All
                        </Button>
                    )}
                </SectionHeader>

                {!isLoading && visibleTools.length === 0 ? (
                    <EmptyState 
                        title="No new arrivals" 
                        message="We're currently scouting for the next big AI tools. Stay tuned!" 
                    />
                ) : (
                    <div className={styles.latestToolsGridMini}>
                        {isLoading ? (
                            SKELETON_COUNTS.LATEST_ITEMS.map((i) => (
                                <div key={`skeleton-latest-${i}`} className={styles.latestToolMini}>
                                    <Skeleton className={styles.skeletonIcon} />
                                    <div className={styles.latestToolInfoMini}>
                                        <Skeleton className={styles.skeletonTitle} />
                                        <Skeleton className={styles.skeletonSubtitle} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            visibleTools.map((tool) => {
                                if (!tool?.slug) return null;
                                return (
                                    <Link to={`/tool/${tool.slug}`} key={tool.id || tool.slug} className={styles.latestToolMini}>
                                        <div className={styles.latestToolIconBox}>
                                            <SmartImage 
                                                src={tool.image_url} 
                                                alt={tool.name} 
                                                fallbackIcon={Zap}
                                            />
                                        </div>
                                        <div className={styles.latestToolInfoMini}>
                                            <h4>{tool.name}</h4>
                                            <p>{tool.categories?.name}</p>
                                        </div>
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

export default HomeLatestArrivals;
