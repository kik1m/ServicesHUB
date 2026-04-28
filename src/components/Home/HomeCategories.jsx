import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import { getIcon } from '../../utils/iconMap.jsx';
import Button from '../ui/Button';
import Skeleton from '../ui/Skeleton';
import SectionHeader from '../ui/SectionHeader';
import Safeguard from '../ui/Safeguard';
import EmptyState from '../ui/EmptyState';
import { SECTION_LIMITS, SKELETON_COUNTS } from '../../constants/homeConstants';
import styles from './HomeCategories.module.css';

/**
 * HomeCategories - Elite Niche Discovery
 * Rule #29: Pure View with Safeguard protection
 */
const HomeCategories = ({ categories = [], isLoading, error }) => {
    // Rule #35: Derived Data Stability + Rule #32: Defensive Rendering
    const visibleCategories = useMemo(() => {
        const safeCategories = categories?.filter(Boolean) ?? [];
        return safeCategories.slice(0, SECTION_LIMITS.CATEGORIES);
    }, [categories]);

    return (
        <Safeguard error={error}>
            <section className={styles.categoriesSection}>
                <SectionHeader 
                    title="Top" 
                    subtitle="Categories" 
                    description="Find tools by your specific niche and needs."
                >
                    {!isLoading && visibleCategories.length > 0 && (
                        <Button 
                            as={Link} 
                            to="/categories" 
                            variant="text" 
                            className={styles.viewAllLink}
                            icon={ArrowRight}
                            iconPosition="right"
                        >
                            View All Categories
                        </Button>
                    )}
                </SectionHeader>

                {!isLoading && visibleCategories.length === 0 ? (
                    <EmptyState 
                        title="No categories yet" 
                        message="We're organizing tools into categories. Check back shortly!" 
                    />
                ) : (
                    <div className={styles.categoriesGridSmall}>
                        {isLoading ? (
                            SKELETON_COUNTS.CATEGORIES_ITEMS.map((i) => (
                                <div key={`skeleton-cat-${i}`} className={styles.categoryItemSmall}>
                                    <Skeleton className={styles.skeletonIcon} />
                                    <div className={styles.catInfo}>
                                        <Skeleton className={styles.skeletonTitle} />
                                        <Skeleton className={styles.skeletonSubtitle} />
                                    </div>
                                    <Skeleton className={styles.skeletonArrow} />
                                </div>
                            ))
                        ) : (
                            visibleCategories.map((cat) => {
                                if (!cat?.slug) return null;
                                const Icon = getIcon(cat.icon_name) || <LayoutGrid size={20} />;

                                return (
                                    <Link to={`/category/${cat.slug}`} key={cat.id || cat.slug} className={styles.categoryItemSmall}>
                                        <div className={styles.catIconWrapper}>{Icon}</div>
                                        <div className={styles.catInfo}>
                                            <h3>{cat.name}</h3>
                                            <p>Discover</p>
                                        </div>
                                        <ArrowRight className={styles.catArrow} size={16} />
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

export default HomeCategories;
