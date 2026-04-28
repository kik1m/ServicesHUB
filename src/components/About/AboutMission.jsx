import React, { memo } from 'react';
import { Target, Eye, Shield, Heart } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AboutMission.module.css';

/**
 * AboutMission - Elite Component
 * Rule #14: Data-Driven UI via props/constants
 * Rule #112: Zero inline styles
 */
const AboutMission = ({ isLoading, content, error, onRetry }) => {
    const icons = [
        <Target size={20} />, 
        <Eye size={20} />, 
        <Shield size={20} />, 
        <Heart size={20} />
    ];

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.missionCard} glass-card`}>
                {isLoading ? (
                    <>
                        <Skeleton className={styles.skeletonTitle} />
                        <Skeleton className={styles.skeletonLine} />
                        <Skeleton className={styles.skeletonDesc} />

                        <div className={styles.pointsGrid}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={styles.missionPoint}>
                                    <div className={styles.pointSkeletonHeader}>
                                        <Skeleton className={styles.skeletonPointIcon} />
                                        <Skeleton className={styles.skeletonPointTitle} />
                                    </div>
                                    <Skeleton className={styles.skeletonPointText} />
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className={styles.title}>
                            {content?.title} <span className="gradient-text">{content?.highlight}</span>
                        </h2>
                        <p className={styles.description}>
                            {content?.description}
                        </p>

                        <div className={styles.pointsGrid}>
                            {content?.points?.map((point, i) => (
                                <div key={i} className={styles.missionPoint}>
                                    <div className={styles.pointHeader}>
                                        <span className={styles.pointIcon}>{icons[i]}</span>
                                        {point?.title}
                                    </div>
                                    <p className={styles.pointDesc}>{point?.description}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Safeguard>
    );
};

export default memo(AboutMission);
