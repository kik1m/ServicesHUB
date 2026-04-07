import React from 'react';

const AdminStats = ({ stats }) => {
    return (
        <div className="admin-stats-grid">
            {stats.map(stat => (
                <div key={stat.id} className="glass-card admin-stat-card">
                    <div className="admin-stat-icon-wrapper" style={{ color: stat.color }}>
                        <stat.icon size={24} />
                    </div>
                    <div className="admin-stat-info">
                        <p>{stat.label}</p>
                        <h3>{stat.value.toLocaleString()}</h3>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
