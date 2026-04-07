import React from 'react';

const HomeStatsBar = ({ statsCount, categoriesCount }) => {
    return (
        <div className="stats-bar-wrapper">
            <div className="stats-bar glass-card">
                <div className="stat-item">
                    <div className="stat-val">{(statsCount.tools || 0).toLocaleString()}+</div>
                    <div className="stat-label">Vetted Tools</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-val">{(statsCount.views || 0).toLocaleString()}+</div>
                    <div className="stat-label">Discoveries</div>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                    <div className="stat-val">{categoriesCount || 0}</div>
                    <div className="stat-label">Expert Categories</div>
                </div>
            </div>
        </div>
    );
};

export default HomeStatsBar;
