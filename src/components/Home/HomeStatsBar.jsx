import React, { useMemo } from 'react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import { STATS_LABELS } from '../../constants/homeConstants';
import styles from './HomeStatsBar.module.css';

const HomeStatsBar = ({ statsCount = {}, categoriesCount = 0, isLoading, error }) => {
    const stats = useMemo(() => [
        { id: 'stat-tools', val: (statsCount.tools || 0).toLocaleString() + '+', label: STATS_LABELS.TOOLS },
        { id: 'stat-views', val: (statsCount.views || 0).toLocaleString() + '+', label: STATS_LABELS.VIEWS },
        { id: 'stat-cats', val: categoriesCount || 0, label: STATS_LABELS.CATEGORIES }
    ], [statsCount, categoriesCount]);

    return (
        <Safeguard error={error}>
            <div className={styles.statsBarWrapper}>
                <div className={styles.statsBar}>
                    {stats.map((stat, i) => (
                        <React.Fragment key={stat.id}>
                            <div className={styles.statItem}>
                                {isLoading ? (
                                    <>
                                        <Skeleton className={styles.skeletonValue} />
                                        <Skeleton className={styles.skeletonLabel} />
                                    </>
                                ) : (
                                    <>
                                        <div className={styles.statVal}>{stat.val}</div>
                                        <div className={styles.statLabel}>{stat.label}</div>
                                    </>
                                )}
                            </div>
                            {i < stats.length - 1 && <div className={styles.statDivider}></div>}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </Safeguard>
    );
};

export default HomeStatsBar;







