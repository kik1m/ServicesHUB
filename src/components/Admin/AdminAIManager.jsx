'use client';
import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, AlertCircle, Clock, Terminal } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import styles from './AdminAIManager.module.css';

/**
 * AdminAIManager - Elite Autonomous AI Controller (Next.js Port)
 */
const AdminAIManager = ({ activeTab }) => {
    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);

    const fetchLogs = async () => {
        setIsLoadingLogs(true);
        try {
            const { data, error } = await supabase
                .from('ai_agent_logs')
                .select('*')
                .order('run_date', { ascending: false })
                .limit(10);
            
            if (error) throw error;
            setLogs(data || []);
        } catch (err) {
            console.error('Failed to fetch AI logs:', err);
        } finally {
            setIsLoadingLogs(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'ai-manager') {
            fetchLogs();
        }
    }, [activeTab]);

    if (activeTab !== 'ai-manager') return null;

    return (
        <div className={`${styles.aiManagerContainer} fade-in`}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <div className={styles.iconBox}>
                        <Bot size={24} className={styles.icon} />
                    </div>
                    <div>
                        <h2 className={styles.title}>Elite AI Agent</h2>
                        <p className={styles.subtitle}>Autonomous scraping, SEO upgrading, and auto-categorization system.</p>
                    </div>
                </div>
                <button onClick={fetchLogs} className={styles.refreshBtn} title="Refresh Logs">
                    <RefreshCw size={18} />
                </button>
            </header>

            <div className={styles.grid}>
                <section className={styles.controlPanel}>
                    <h3 className={styles.sectionTitle}>
                        <Terminal size={18} /> Terminal Command Center
                    </h3>
                    
                    <div className={styles.guideBox}>
                        <p className={styles.guideText}>
                            To import new tools using the <strong>Autonomous AI Agent</strong>, run the following command in your terminal:
                        </p>
                        
                        <div className={styles.commandPreview}>
                            <code>node scripts/ai-importer/index.js "URL1,URL2"</code>
                        </div>

                        <ul className={styles.stepsList}>
                            <li>1. Open a new terminal in the project root.</li>
                            <li>2. Paste the command above with your target URLs.</li>
                            <li>3. Watch the progress in the terminal.</li>
                            <li>4. Refresh this page to see the updated logs below.</li>
                        </ul>
                    </div>

                    <div className={styles.statusInfo}>
                        <div className={styles.infoBadge}>
                            <AlertCircle size={14} /> Local Processing Mode Active
                        </div>
                    </div>
                </section>

                <section className={styles.logsPanel}>
                    <h3 className={styles.sectionTitle}>
                        <Terminal size={18} /> Operation Logs
                    </h3>
                    
                    <div className={styles.logsContainer}>
                        {isLoadingLogs ? (
                            <div className={styles.loadingLogs}>Fetching terminal data...</div>
                        ) : logs.length === 0 ? (
                            <div className={styles.emptyLogs}>No agent operations recorded yet.</div>
                        ) : (
                            logs.map((log) => (
                                <div key={log.id} className={styles.logCard}>
                                    <div className={styles.logHeader}>
                                        <span className={styles.logDate}>
                                            <Clock size={14} />
                                            {new Date(log.run_date).toLocaleString()}
                                        </span>
                                        <div className={styles.logBadges}>
                                            <span className={`${styles.badge} ${styles.added}`}>+{log.added_count} Added</span>
                                            <span className={`${styles.badge} ${styles.updated}`}>~{log.updated_count} Updated</span>
                                            {log.failed_count > 0 && <span className={`${styles.badge} ${styles.failed}`}>-{log.failed_count} Failed</span>}
                                        </div>
                                    </div>
                                    <div className={styles.logBody}>
                                        {log.details && Array.isArray(log.details) && log.details.map((detail, idx) => (
                                            <div key={idx} className={`${styles.detailRow} ${styles[detail.status.toLowerCase()]}`}>
                                                <span className={styles.detailStatus}>[{detail.status}]</span>
                                                <span className={styles.detailName}>{detail.name || detail.url}</span>
                                                {detail.message && <span className={styles.detailMsg}>- {detail.message}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminAIManager;
