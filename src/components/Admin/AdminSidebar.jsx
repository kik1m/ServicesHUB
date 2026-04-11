import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Activity, ShieldCheck } from 'lucide-react';
import styles from './AdminSidebar.module.css';

const AdminSidebar = ({ activeTab }) => {
    if (activeTab !== 'pending' && activeTab !== 'featured') return null;

    return (
        <aside className={styles.sidebar}>
            <div className={`${styles.healthCard} glass-card`}>
                <h2 className={styles.title}><Activity size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Platform Health</h2>
                <div className={styles.healthStats}>
                    <div>
                        <div className={styles.statRow}>
                            <span>Database Connection</span>
                            <span className={styles.textSecondary}>Stable</span>
                        </div>
                        <div className={styles.progressBg}>
                            <div className={`${styles.progressBar} ${styles.secondary}`} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className={styles.statRow}>
                            <span>Auth Service</span>
                            <span className={styles.textPrimary}>Active</span>
                        </div>
                        <div className={styles.progressBg}>
                            <div className={`${styles.progressBar} ${styles.primary}`} style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${styles.shortcutCard} glass-card`}>
                <h4 className={styles.title}><ShieldCheck size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Admin Shortcuts</h4>
                <nav className={styles.shortcutLinks}>
                    <Link to="/tools" className={styles.shortcutLink}><ArrowUpRight size={14} /> View Directory</Link>
                    <Link to="/blog" className={styles.shortcutLink}><ArrowUpRight size={14} /> View Blog</Link>
                </nav>
            </div>
        </aside>
    );
};

export default AdminSidebar;
