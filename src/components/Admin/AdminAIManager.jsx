import React, { useState, useEffect } from 'react';
import { Bot, Play, RefreshCw, AlertCircle, CheckCircle2, Clock, Terminal } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import styles from './AdminAIManager.module.css';

/**
 * AdminAIManager - Elite Autonomous AI Controller
 * Allows manual triggering of the background AI scraping agent.
 */
const AdminAIManager = ({ activeTab }) => {
    const [urlsInput, setUrlsInput] = useState('');
    const [isTriggering, setIsTriggering] = useState(false);
    const [logs, setLogs] = useState([]);
    const [isLoadingLogs, setIsLoadingLogs] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);

    // Fetch historical AI logs from Supabase
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

    const handleTriggerAgent = async () => {
        const cleanUrls = urlsInput.split('\n').map(u => u.trim()).filter(u => u.startsWith('http')).join(',');
        
        if (!cleanUrls) {
            setStatusMessage({ type: 'error', text: 'Please enter valid URLs starting with http/https.' });
            return;
        }

        setIsTriggering(true);
        setStatusMessage(null);

        try {
            // Trigger GitHub Actions Workflow Dispatch via Vercel Serverless API
            // Note: Requires /api/trigger-ai.js to exist and GITHUB_PAT in env
            const response = await fetch('/api/trigger-ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls: cleanUrls })
            });

            if (!response.ok) {
                const resData = await response.json();
                throw new Error(resData.error || 'Failed to trigger agent');
            }

            setStatusMessage({ type: 'success', text: 'Agent has been deployed! The servers are processing your links in the background. Check logs shortly.' });
            setUrlsInput('');
            
        } catch (error) {
            console.error('Trigger error:', error);
            setStatusMessage({ type: 'error', text: `Failed to trigger: ${error.message}. Ensure GitHub PAT is configured.` });
        } finally {
            setIsTriggering(false);
        }
    };

    if (activeTab !== 'ai-manager') return null;

    return (
        <div className={styles.aiManagerContainer}>
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
                {/* Control Panel */}
                <section className={styles.controlPanel}>
                    <h3 className={styles.sectionTitle}>Agent Command Center</h3>
                    
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Target URLs (One per line)</label>
                        <textarea 
                            className={styles.textarea}
                            placeholder="https://v0.dev&#10;https://runwayml.com"
                            value={urlsInput}
                            onChange={(e) => setUrlsInput(e.target.value)}
                            disabled={isTriggering}
                        />
                    </div>

                    {statusMessage && (
                        <div className={`${styles.statusBanner} ${styles[statusMessage.type]}`}>
                            {statusMessage.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                            <span>{statusMessage.text}</span>
                        </div>
                    )}

                    <button 
                        className={styles.triggerBtn} 
                        onClick={handleTriggerAgent}
                        disabled={isTriggering || !urlsInput.trim()}
                    >
                        {isTriggering ? (
                            <><RefreshCw size={18} className={styles.spin} /> Deploying Servers...</>
                        ) : (
                            <><Play size={18} /> Launch Agent</>
                        )}
                    </button>
                    <p className={styles.disclaimer}>
                        <AlertCircle size={14} /> Background processing takes ~15 seconds per URL. Do not close the platform.
                    </p>
                </section>

                {/* Logs Terminal */}
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
