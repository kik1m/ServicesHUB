import React, { memo } from 'react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './LegalSection.module.css';

/**
 * LegalSection - Elite Component
 * Rule #112: Zero inline styles
 * Rule #31: Component Resilience
 */
const LegalSection = ({ icon: Icon, number, title, children, isLoading, error, onRetry }) => {
    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.unit}>
                    <div className={styles.skeletonHeader}>
                        <Skeleton className={styles.skeletonNumber} />
                        <Skeleton className={styles.skeletonTitle} />
                    </div>
                    <div className={styles.skeletonBody}>
                        <Skeleton className={styles.skeletonLine} />
                        <Skeleton className={styles.skeletonLine} />
                        <Skeleton className={styles.skeletonLineSmall} />
                    </div>
                </div>
            ) : (
                <div className={styles.unit}>
                    <h2 className={styles.header}>
                        <span className="gradient-text">{number}.</span>
                        {Icon && (
                            <span className={styles.headerIcon}>
                                <Icon size={24} />
                            </span>
                        )}
                        {title}
                    </h2>
                    <div className={styles.titleText}>
                        {children}
                    </div>
                </div>
            )}
        </Safeguard>
    );
};

export default memo(LegalSection);
