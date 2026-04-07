import React from 'react';
import { Award, Mail } from 'lucide-react';

const AdminUserManager = ({ activeTab, allUsers, subscribers }) => {
    
    if (activeTab === 'users') {
        return (
            <div>
                <div className="admin-section-header">
                    <h2>Users Manager</h2>
                    <span className="badge">{allUsers.length} TOTAL USERS</span>
                </div>
                <div className="admin-users-grid">
                    {allUsers.map(u => (
                        <div key={u.id} className="glass-card admin-user-card" style={{ border: u.is_premium ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid var(--border)' }}>
                            <div className="admin-user-avatar">
                                {u.avatar_url ? <img src={u.avatar_url} alt={u.full_name} /> : u.full_name?.charAt(0) || 'U'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h5 style={{ fontWeight: '700', margin: 0 }}>{u.full_name || 'Anonymous'}</h5>
                                    {u.is_premium && <Award size={14} color="#FFD700" title="Premium" />}
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0' }}>{u.role}</p>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Joined {new Date(u.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeTab === 'newsletter') {
        return (
            <div>
                <div className="admin-section-header">
                    <h2>Newsletter Subscribers</h2>
                    <span className="badge">{subscribers.length} TOTAL EMAIL{subscribers.length !== 1 && 'S'}</span>
                </div>
                <div className="admin-scroll-area">
                    {subscribers.map((sub, i) => (
                        <div key={sub.id || i} className="admin-item-row">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={18} color="var(--primary)" />
                                </div>
                                <div>
                                    <h5 style={{ fontWeight: '700', fontSize: '1.05rem', margin: 0 }}>{sub.email}</h5>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Subscribed on {new Date(sub.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {subscribers.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <p>No subscribers yet. They will appear here when users sign up from the footer.</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
};

export default AdminUserManager;
