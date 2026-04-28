import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AdminGrowthChart.module.css';

const AdminGrowthChart = ({ isLoading, error, onRetry }) => {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT'];

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={`${styles.chartCard} glass-card`}>
                {isLoading ? (
                    <>
                        <div className={styles.chartHeader}>
                            <Skeleton className={styles.skeletonTitle} />
                        </div>
                        <div className={styles.skeletonChartBody}>
                            <Skeleton className={styles.skeletonSvg} />
                        </div>
                        <div className={styles.skeletonAxis}>
                            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className={styles.skeletonMonth} />)}
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.chartHeader}>
                            <h3 className={styles.title}>Platform Growth Overview</h3>
                            <span className={styles.badge}>LIVE METRICS</span>
                        </div>
                        <div className={styles.svgContainer}>
                            <svg viewBox="0 0 1000 150" fill="none" preserveAspectRatio="none">
                                <path
                                    d="M0,130 C100,120 200,80 300,90 C400,100 500,40 600,50 C700,60 800,20 900,30 L1000,10"
                                    stroke="url(#chartGradient)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    className={styles.chartPath}
                                />
                                <defs>
                                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="var(--primary)" />
                                        <stop offset="100%" stopColor="var(--secondary)" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className={styles.xAxis}>
                                {months.map(m => <span key={m}>{m}</span>)}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Safeguard>
    );
};

export default AdminGrowthChart;




