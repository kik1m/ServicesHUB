import React from 'react';
import { TrendingUp } from 'lucide-react';
import styles from './DashboardViewsChart.module.css';

const DashboardViewsChart = ({ userTools }) => {
    if (!userTools || userTools.length === 0) return null;

    // Sort tools by views for the "performance chart"
    const sortedTools = [...userTools].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 5);
    const maxViews = Math.max(...sortedTools.map(t => t.view_count || 0), 1);

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartHeader}>
                <div>
                    <h3 className={styles.title}>Views Per Tool</h3>
                    <p className={styles.subtitle}>Track engagement for each listing</p>
                </div>
                <div className={styles.liveBadge}>
                    <TrendingUp size={12} />
                    Live Data
                </div>
            </div>
            
            <div className="chart-content">
                {sortedTools.map((tool) => {
                    const percentage = Math.max(((tool.view_count || 0) / maxViews) * 100, 2);
                    return (
                        <div key={tool.id} className={styles.chartRow}>
                            <div className={styles.labelRow}>
                                <span className={styles.toolName}>{tool.name}</span>
                                <span className={styles.toolCount}>{(tool.view_count || 0).toLocaleString()} views</span>
                            </div>
                            <div className={styles.barOuter}>
                                <div 
                                    className={styles.barInner} 
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardViewsChart;
