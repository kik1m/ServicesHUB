import React from 'react';
import Breadcrumbs from '../Breadcrumbs';
import Skeleton from './Skeleton';
import styles from './PageHero.module.css';

/**
 * 🚀 Elite Standard Page Hero
 * Rule #19: Single source of truth for platform headers
 */
const PageHero = ({ title, subtitle, highlight, breadcrumbs, icon, badge, children, className, isLoading, variant, rawIcon }) => {
    const isRow = variant === 'row';

    if (isLoading) {
        return (
            <section className={`${styles.heroSection} ${className || ''} ${isRow ? styles.rowHero : ''}`}>
                <div className={`${styles.heroContent} ${isRow ? styles.heroRow : ''}`}>
                    <div className={styles.breadcrumbWrapper}>
                        <Skeleton className={styles.skeletonBreadcrumb} />
                    </div>
                    <div className={styles.titleWithIconSkeleton}>
                        <Skeleton className={styles.skeletonIcon} />
                        <Skeleton className={styles.skeletonTitle} />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`${styles.heroSection} ${className || ''} ${isRow ? styles.rowHero : ''}`}>
            <div className={`${styles.heroContent} ${isRow ? styles.heroRow : ''}`}>
                {breadcrumbs && (
                    <div className={`${styles.breadcrumbWrapper} ${isRow ? styles.alignLeft : ''}`}>
                        <Breadcrumbs items={breadcrumbs} isLoading={false} />
                    </div>
                )}
                
                <div className={`${styles.heroHeader} ${isRow ? styles.alignLeft : ''}`}>
                    {icon && (
                        rawIcon ? icon : <div className={styles.heroIcon}>{icon}</div>
                    )}
                    <div className={`${styles.titleStack} ${isRow ? styles.alignLeft : ''}`}>
                        {badge && <div className={styles.heroBadge}>{badge}</div>}
                        <h1 className={styles.title}>
                            {title} <span className="gradient-text">{highlight}</span>
                        </h1>
                        {subtitle && isRow && <p className={styles.subtitle}>{subtitle}</p>}
                    </div>
                </div>

                {!isRow && subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                {children && <div className={`${styles.heroActions} ${isRow ? styles.alignLeft : ''}`}>{children}</div>}
            </div>
        </section>
    );
};

export default PageHero;
