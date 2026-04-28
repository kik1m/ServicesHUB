import React, { memo } from 'react';
import { ADMIN_UI_CONSTANTS } from '../../constants/adminConstants';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Activity, ShieldCheck, Database, Lock } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import Safeguard from '../ui/Safeguard';
import styles from './AdminSidebar.module.css';

/**
 * AdminSidebar - Elite Hardened Sidebar
 * Rule #18: Memoized
 */
const AdminSidebar = memo(({ activeTab, isLoading, error, onRetry }) => {
    // 1. Guard for active tabs (Sidebar only shows on specific tabs for visual balance)
    if (activeTab !== 'pending' && activeTab !== 'featured') return null;

    const labels = ADMIN_UI_CONSTANTS.sidebar;

    return (
        <Safeguard error={error} onRetry={onRetry}>
            <aside className={styles.sidebar}>
                {isLoading ? (
                    <>
                        <div className={styles.infoCard}>
                            <Skeleton className={styles.skeletonHealthTitle} />
                            <div className={styles.healthStats}>
                                {[1, 2].map(i => (
                                    <div key={i} className={styles.mb1_5rem}>
                                        <Skeleton className={styles.skeletonProgressBar} />
                                        <Skeleton className={styles.skeletonProgressLabel} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <Skeleton className={styles.skeletonShortcutTitle} />
                            <Skeleton className={styles.skeletonShortcutLink} />
                            <Skeleton className={styles.skeletonShortcutLink} />
                        </div>
                    </>
                ) : (
                    <>
                        {/* System Health Module */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <Activity size={18} />
                                <h3 className={styles.title}>{labels.health?.title}</h3>
                            </div>
                            
                            <div className={styles.healthStats}>
                                <div className={styles.healthItem}>
                                    <div className={styles.statRow}>
                                        <span className={styles.statLabel}><Database size={12} /> {labels.health?.database}</span>
                                        <span className={styles.statusOk}>{labels.health?.stable}</span>
                                    </div>
                                    <div className={styles.progressBg}>
                                        <div className={`${styles.progressBar} ${styles.primary} ${styles.w100}`}></div>
                                    </div>
                                </div>
                                
                                <div className={styles.healthItem}>
                                    <div className={styles.statRow}>
                                        <span className={styles.statLabel}><Lock size={12} /> {labels.health?.auth}</span>
                                        <span className={styles.statusActive}>{labels.health?.active}</span>
                                    </div>
                                    <div className={styles.progressBg}>
                                        <div className={`${styles.progressBar} ${styles.secondary} ${styles.w100}`}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions Module */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <ShieldCheck size={18} />
                                <h3 className={styles.title}>{labels.shortcuts?.title}</h3>
                            </div>
                            
                            <nav className={styles.shortcutLinks}>
                                <Link to="/tools" className={styles.shortcutLink}>
                                    {labels.shortcuts?.directory} <ArrowUpRight size={14} />
                                </Link>
                                <Link to="/blog" className={styles.shortcutLink}>
                                    {labels.shortcuts?.blog} <ArrowUpRight size={14} />
                                </Link>
                            </nav>
                        </div>
                    </>
                )}
            </aside>
        </Safeguard>
    );
});

export default AdminSidebar;
