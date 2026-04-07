import React from 'react';
import { Zap, TrendingUp, CheckCircle2, Edit3, ExternalLink, Trash2 } from 'lucide-react';

const DashboardToolsTable = ({ userTools, navigate, handleDeleteTool }) => {
    if (!userTools || userTools.length === 0) return null;

    return (
        <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Tool Info</th>
                        <th>Status</th>
                        <th>Marketing</th>
                        <th>Pricing</th>
                        <th>Views</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userTools.map(tool => (
                        <tr key={tool.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {tool.image_url ? 
                                            <img src={tool.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : 
                                            <Zap size={14} color="var(--primary)" />
                                        }
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'white' }}>{tool.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created {new Date(tool.created_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`status-badge ${tool.is_approved ? 'status-published' : 'status-pending'}`}>
                                    {tool.is_approved ? 'Published' : 'Pending'}
                                </span>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                        {tool.is_featured && <TrendingUp size={14} color="#FFD700" title="Featured" />}
                                        {tool.is_verified && <CheckCircle2 size={14} color="var(--secondary)" title="Verified" />}
                                        {!tool.is_featured && !tool.is_verified && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>-</span>}
                                    </div>
                                    {tool.is_featured && tool.featured_until && (() => {
                                        const daysLeft = Math.max(0, Math.ceil((new Date(tool.featured_until) - new Date()) / (1000 * 60 * 60 * 24)));
                                        const isExpired = daysLeft === 0;
                                        return (
                                            <div style={{ fontSize: '0.65rem', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                                <span style={{ color: isExpired ? '#ff4757' : daysLeft <= 5 ? '#ffa500' : '#00e676', fontWeight: 'bold' }}>
                                                    {isExpired ? 'Expired' : `${daysLeft}d left`}
                                                </span>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </td>
                            <td style={{ fontSize: '0.85rem' }}>{tool.pricing_type}</td>
                            <td style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                                {(tool.view_count || 0).toLocaleString()}
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button onClick={() => navigate(`/edit-tool/${tool.id}`)} className="action-btn" title="Edit"><Edit3 size={16} /></button>
                                    <button onClick={() => navigate(`/tool/${tool.slug}`)} className="action-btn" title="View"><ExternalLink size={16} /></button>
                                    <button onClick={() => handleDeleteTool(tool.id, tool.name)} className="action-btn action-delete" title="Delete"><Trash2 size={16} /></button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardToolsTable;
