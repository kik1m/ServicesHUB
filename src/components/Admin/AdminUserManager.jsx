import React from 'react';
import { Award, Mail, Calendar, User } from 'lucide-react';
import styles from './AdminUserManager.module.css';

const AdminUserManager = ({ activeTab, allUsers, subscribers }) => {
    
    if (activeTab === 'users') {
        return (
            <div className={styles.wrapper}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>Users Manager</h2>
                    <span className={styles.badge}>{allUsers.length} TOTAL USERS</span>
                </div>
                <div className={styles.usersGrid}>
                    {allUsers.map(u => (
                        <div key={u.id} className={`${styles.userCard} ${u.is_premium ? styles.premium : ''} glass-card`}>
                            <div className={styles.avatar}>
                                {u.avatar_url ? <img src={u.avatar_url} alt={u.full_name} /> : <User size={24} />}
                            </div>
                            <div className={styles.info}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h5>{u.full_name || 'Anonymous User'}</h5>
                                    {u.is_premium && <Award size={14} color="#FFD700" title="Premium Subscriber" />}
                                </div>
                                <p className={styles.role}>{u.role}</p>
                                <p className={styles.date}>
                                    <Calendar size={10} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                    Joined {new Date(u.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeTab === 'newsletter') {
        return (
            <div className={styles.wrapper}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.title}>Newsletter Subscribers</h2>
                    <span className={styles.badge}>{subscribers.length} TOTAL EMAIL{subscribers.length !== 1 && 'S'}</span>
                </div>
                <div className={styles.scrollArea}>
                    {subscribers.map((sub, i) => (
                        <div key={sub.id || i} className={styles.itemRow}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div className={styles.subIcon}>
                                    <Mail size={18} color="var(--primary)" />
                                </div>
                                <div>
                                    <h5 className={styles.subEmail}>{sub.email}</h5>
                                    <p className={styles.subDate}>Subscribed on {new Date(sub.created_at).toLocaleDateString()}</p>
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
