import React from 'react';
import { TrendingUp } from 'lucide-react';

const DashboardViewsChart = ({ userTools }) => {
    if (!userTools || userTools.length === 0) return null;

    const maxViews = Math.max(...userTools.map(t => t.view_count || 0), 1);

    return (
        <div className="glass-card views-chart-container compact-glass-card">
            <div className="chart-header">
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '4px' }}>Views Per Tool</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Track engagement for each listing</p>
                </div>
                <div style={{ 
                    padding: '6px 12px', background: 'rgba(0, 210, 255, 0.1)', 
                    color: 'var(--secondary)', borderRadius: '100px', 
                    fontSize: '0.75rem', fontWeight: '700', 
                    display: 'flex', alignItems: 'center', gap: '6px' 
                }}>
                    <TrendingUp size={12} /> Live Data
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {userTools.map(tool => {
                    const pct = Math.max(((tool.view_count || 0) / maxViews) * 100, 2);
                    return (
                        <div key={tool.id} className="chart-row">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{tool.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700' }}>
                                    {(tool.view_count || 0).toLocaleString()} views
                                </span>
                            </div>
                            <div className="chart-bar-outer">
                                <div className="chart-bar-inner" style={{
                                    width: `${pct}%`,
                                    background: tool.is_featured ? 'linear-gradient(90deg, #FFD700, #FF8C00)' : 'var(--gradient)',
                                }} />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardViewsChart;
