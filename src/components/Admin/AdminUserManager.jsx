import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Award, Mail, Calendar, User, Shield } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import SmartImage from '../ui/SmartImage';
import Safeguard from '../ui/Safeguard';
import styles from './AdminUserManager.module.css';

/**
 * AdminUserManager - Elite Modular User & Subscription Manager
 * Rule #18: Memoized
 */
const AdminUserManager = memo(({ activeTab, allUsers = [], subscribers = [], isLoading, error, onRetry }) => {
    
    // 1. Guard for active tabs
    if (activeTab !== 'users' && activeTab !== 'newsletter') return null;

    const labels = ADMIN_UI_CONSTANTS.users;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <div className={styles.wrapper}>
                {isLoading ? (
                    <>
                        <div className={styles.sectionHeader}>
                            <Skeleton className={styles.skeletonSectionTitle} />
                        </div>
                        {activeTab === 'users' ? (
                            <div className={styles.usersGrid}>
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className={styles.userCardSkeleton}>
                                        <Skeleton className={styles.skeletonAvatar} />
                                        <div className={styles.skeletonText}>
                                            <Skeleton className={styles.skeletonUserName} />
                                            <Skeleton className={styles.skeletonUserRole} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.scrollArea}>
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className={styles.itemRowSkeleton}>
                                        <Skeleton className={styles.skeletonIcon} />
                                        <div className={styles.skeletonText}>
                                            <Skeleton className={styles.skeletonEmail} />
                                            <Skeleton className={styles.skeletonDate} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {activeTab === 'users' ? (
                            <>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.headerInfo}>
                                        <h2 className={styles.title}>{labels.managerTitle}</h2>
                                        <span className={styles.badge}>{allUsers?.length || 0} {labels.badges?.totalUsers}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.usersGrid}>
                                    {allUsers?.map(u => (
                                        <div key={u.id} className={`${styles.userCard} ${u?.is_premium ? styles.premium : ''}`}>
                                            <div className={styles.avatarWrapper}>
                                                {u?.avatar_url ? (
                                                    <SmartImage src={u.avatar_url} alt={u.full_name} className={styles.avatarImg} />
                                                ) : (
                                                    <div className={styles.avatarPlaceholder}>
                                                        <User size={24} />
                                                    </div>
                                                )}
                                                {u?.role === 'admin' && <Shield size={16} className={styles.adminBadge} />}
                                            </div>
                                            
                                            <div className={styles.info}>
                                                <div className={styles.nameRow}>
                                                    <h5>{u?.full_name || labels.anonymous}</h5>
                                                    {u?.is_premium && <Award size={16} className={styles.premiumIcon} title={labels.premiumHint} />}
                                                </div>
                                                <p className={styles.role}>{u?.role}</p>
                                                <p className={styles.date}>
                                                    <Calendar size={12} />
                                                    {labels.joined} {u?.updated_at ? new Date(u.updated_at).toLocaleDateString() : 'Recent'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.sectionHeader}>
                                    <div className={styles.headerInfo}>
                                        <h2 className={styles.title}>{labels.subscribersTitle}</h2>
                                        <span className={styles.badge}>{subscribers?.length || 0} {labels.badges?.totalEmails}</span>
                                    </div>
                                </div>
                                
                                <div className={styles.scrollArea}>
                                    {subscribers?.map((sub, i) => (
                                        <div key={sub.id || i} className={styles.itemRow}>
                                            <div className={styles.subContent}>
                                                <div className={styles.subIcon}>
                                                    <Mail size={20} />
                                                </div>
                                                <div className={styles.subInfo}>
                                                    <h5 className={styles.subEmail}>{sub?.email}</h5>
                                                    <p className={styles.subDate}>{labels.subscribedOn} {sub?.created_at ? new Date(sub.created_at).toLocaleDateString() : 'Recent'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {subscribers?.length === 0 && (
                                        <div className={styles.emptyState}>
                                            <p>{labels.emptyNewsletter}</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </Safeguard>
    );
});

export default AdminUserManager;
