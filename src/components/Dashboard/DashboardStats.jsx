import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, Heart, MousePointerClick, Star, Zap } from 'lucide-react';

const DashboardStats = ({ isCreator, userTools, favorites, user }) => {
    return (
        <div className="dashboard-stats-grid">
            <div className="dashboard-metric-card">
                <div className="metric-header">
                    <span className="metric-label">{isCreator ? 'Total Submissions' : 'Saved Tools'}</span>
                    {isCreator ? <LayoutGrid size={18} color="var(--primary)" /> : <Heart size={18} color="#ff4757" />}
                </div>
                <div className="metric-value">{isCreator ? userTools.length : favorites.length}</div>
            </div>

            <div className="dashboard-metric-card">
                <div className="metric-header">
                    <span className="metric-label">{isCreator ? 'Total Views' : 'Account Status'}</span>
                    {isCreator ? <MousePointerClick size={18} color="#00e676" /> : <Star size={18} color="var(--secondary)" />}
                </div>
                <div className="metric-value">
                    {isCreator ? userTools.reduce((sum, t) => sum + (t.view_count || 0), 0).toLocaleString() : 'Active'}
                </div>
            </div>

            <div className="dashboard-metric-card" style={{ border: user?.is_premium ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid var(--border)' }}>
                <div className="metric-header">
                    <span className="metric-label">Plan Tier</span>
                    <Zap size={18} color={user?.is_premium ? '#FFD700' : 'var(--primary)'} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: user?.is_premium ? '#FFD700' : 'white' }}>
                        {user?.is_premium ? 'PREMIUM' : 'FREE'}
                    </div>
                    {!user?.is_premium && (
                        <Link to="/premium" style={{ fontSize: '0.7rem', color: 'var(--secondary)', textDecoration: 'underline' }}>Upgrade</Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardStats;
