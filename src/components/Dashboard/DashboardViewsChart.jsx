import React, { useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import Button from '../ui/Button';
import styles from './DashboardViewsChart.module.css';

import { SKELETON_COUNTS } from '../../constants/dashboardConstants';

/**
 * DashboardViewsChart - Elite Visual Analytics
 * Rule #29: Pure View with Safeguard protection
 */
const DashboardViewsChart = ({ chartData = [], isLoading, error, onRetry, content }) => {
    const [visibleCount, setVisibleCount] = useState(5);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 5);
    };

    const displayedData = chartData?.slice(0, visibleCount);
    const hasMore = chartData?.length > visibleCount;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            {isLoading ? (
                <div className={styles.chartContainer}>
                    <div className={styles.chartHeader}>
                        <div>
                            <Skeleton width="120px" height="20px" style={{ marginBottom: '0.5rem' }} />
                            <Skeleton width="200px" height="14px" />
                        </div>
                        <Skeleton width="80px" height="24px" borderRadius="100px" />
                    </div>
                    
                    <div className={styles.chartContent}>
                        {SKELETON_COUNTS.CHART.map(i => (
                            <div key={`skeleton-chart-${i}`} className={styles.chartRow}>
                                <div className={styles.labelRow}>
                                    <Skeleton width="100px" height="16px" />
                                    <Skeleton width="60px" height="14px" />
                                </div>
                                <Skeleton height="8px" borderRadius="4px" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (!chartData || chartData?.length === 0) ? null : (
                <div className={styles.chartContainer}>
                    <div className={styles.chartHeader}>
                        <div>
                            <h3 className={styles.title}>{content?.title}</h3>
                            <p className={styles.subtitle}>{content?.trendingText}</p>
                        </div>
                        <div className={styles.liveBadge}>
                            <TrendingUp size={16} />
                            {content?.badge}
                        </div>
                    </div>
                    
                    <div className={styles.chartContent}>
                        {displayedData?.map((tool) => (
                            <div key={tool?.id} className={styles.chartRow}>
                                <div className={styles.labelRow}>
                                    <span className={styles.toolName}>{tool?.name}</span>
                                    <div className={styles.countLabels}>
                                        <span className={styles.viewCount}>{(tool?.view_count || 0).toLocaleString()} {content?.viewsLabel}</span>
                                        <span className={styles.clickCount}>{(tool?.click_count || 0).toLocaleString()} {content?.clicksLabel}</span>
                                    </div>
                                </div>
                                <div className={styles.barStack}>
                                    <div className={styles.barOuter}>
                                        <div 
                                            className={styles.barViews} 
                                            style={{ width: `${tool?.viewsPercent || 0}%` }}
                                        ></div>
                                    </div>
                                    <div className={styles.barOuter}>
                                        <div 
                                            className={styles.barClicks} 
                                            style={{ width: `${tool?.clicksPercent || 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {hasMore && (
                            <div className={styles.loadMoreWrapper}>
                                <Button 
                                    variant="secondary" 
                                    onClick={handleLoadMore}
                                    icon={ChevronDown}
                                    className={styles.loadMoreBtn}
                                >
                                    Load More Tools ({chartData.length - visibleCount})
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </Safeguard>
    );
};

export default DashboardViewsChart;
