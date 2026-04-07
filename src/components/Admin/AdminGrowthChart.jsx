import React from 'react';

const AdminGrowthChart = () => {
    return (
        <div className="glass-card admin-chart-card">
            <div className="admin-chart-header">
                <h3>Platform Growth Overview</h3>
                <span className="admin-chart-badge">LIVE METRICS</span>
            </div>
            <div className="admin-svg-container">
                <svg viewBox="0 0 1000 150" fill="none" preserveAspectRatio="none">
                    <path
                        d="M0,130 C100,120 200,80 300,90 C400,100 500,40 600,50 C700,60 800,20 900,30 L1000,10"
                        stroke="url(#chartGradient)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 8px var(--primary))' }}
                    />
                    <defs>
                        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--primary)" />
                            <stop offset="100%" stopColor="var(--secondary)" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="admin-chart-xaxis">
                    <span>JAN</span>
                    <span>FEB</span>
                    <span>MAR</span>
                    <span>APR</span>
                    <span>MAY</span>
                    <span>JUN</span>
                    <span>JUL</span>
                    <span>AUG</span>
                    <span>SEP</span>
                    <span>OCT</span>
                </div>
            </div>
        </div>
    );
};

export default AdminGrowthChart;
