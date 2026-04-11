import React from 'react';
import { Edit2, Trash2, ExternalLink, ShieldCheck, Zap, TrendingUp } from 'lucide-react';
import styles from './DashboardToolsTable.module.css';

const DashboardToolsTable = ({ userTools, navigate, handleDeleteTool }) => {
    if (!userTools || userTools.length === 0) return null;

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
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
                    {userTools.map((tool) => {
                        // Calculate days left for featured status
                        const featuredUntil = tool.featured_until ? new Date(tool.featured_until) : null;
                        const daysLeft = featuredUntil 
                            ? Math.max(0, Math.ceil((featuredUntil - new Date()) / (1000 * 60 * 60 * 24)))
                            : 0;

                        return (
                            <tr key={tool.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `url(${tool.image_url}) center/cover no-repeat`, border: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}></div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontWeight: '800', color: 'white', fontSize: '1.05rem' }}>{tool.name}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Created {new Date(tool.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.statusBadge} ${tool.is_approved ? styles.statusPublished : styles.statusPending}`}>
                                        {tool.is_approved ? 'Published' : 'Pending'}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.marketingCell}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {tool.is_featured && <TrendingUp size={16} color="var(--secondary)" />}
                                            {tool.is_verified && <ShieldCheck size={16} color="var(--primary)" />}
                                        </div>
                                        {tool.is_featured && daysLeft > 0 && (
                                            <span className={styles.daysLeft}>{daysLeft}d left</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>{tool.pricing_type}</span>
                                </td>
                                <td>
                                    <span className={styles.viewsCount}>{(tool.view_count || 0).toLocaleString()}</span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <button onClick={() => navigate(`/edit-tool/${tool.id}`)} className={styles.actionBtn} title="Edit"><Edit2 size={16} /></button>
                                        <a href={`/tool/${tool.slug}`} target="_blank" rel="noopener noreferrer" className={styles.actionBtn} title="View"><ExternalLink size={16} /></a>
                                        <button onClick={() => handleDeleteTool(tool.id, tool.name)} className={`${styles.actionBtn} ${styles.actionDelete}`} title="Delete"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default DashboardToolsTable;
