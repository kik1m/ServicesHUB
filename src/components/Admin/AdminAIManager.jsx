'use client';
import React, { useState, useEffect } from 'react';
import { Bot, RefreshCw, AlertCircle, Clock, Terminal, Send, CheckCircle, XCircle, Loader2, History } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import styles from './AdminAIManager.module.css';

/**
 * AdminAIManager - Elite Autonomous AI Controller & Command Hub
 */
const AdminAIManager = ({ activeTab }) => {
    const [jobs, setJobs] = useState([]);
    const [agentLogs, setAgentLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Command Form State
    const [jobType, setJobType] = useState('IMPORT_TOOL');
    const [targetInput, setTargetInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Live Queue
            const { data: queueData, error: queueError } = await supabase
                .from('ai_jobs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);
            
            if (queueError && queueError.code !== '42P01') console.error(queueError);
            setJobs(queueData || []);

            // Fetch Historical Logs
            const { data: historyData, error: historyError } = await supabase
                .from('ai_agent_logs')
                .select('*')
                .order('run_date', { ascending: false })
                .limit(10);

            if (historyError) console.error(historyError);
            setAgentLogs(historyData || []);

        } catch (err) {
            console.error('Failed to fetch AI data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'ai-manager') {
            fetchData();
        }
    }, [activeTab]);

    const handleQueueJob = async (e) => {
        e.preventDefault();
        if (!targetInput.trim() && jobType !== 'FIX_SEO') return;

        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const { error } = await supabase
                .from('ai_jobs')
                .insert([{
                    job_type: jobType,
                    payload: { url: targetInput.trim(), target: targetInput.trim() },
                    status: 'PENDING'
                }]);

            if (error) throw error;
            
            setSubmitMessage('✅ Task queued successfully! The local worker will process it instantly.');
            setTargetInput('');
            fetchData(); // Refresh list immediately
        } catch (err) {
            console.error('Failed to queue job:', err);
            setSubmitMessage('❌ Failed to queue task. Check if ai_jobs table exists.');
        } finally {
            setIsSubmitting(false);
            setTimeout(() => setSubmitMessage(''), 5000);
        }
    };

    if (activeTab !== 'ai-manager') return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} className={styles.statusPending} />;
            case 'PROCESSING': return <Loader2 size={16} className={`${styles.statusProcessing} spin`} />;
            case 'COMPLETED': return <CheckCircle size={16} className={styles.statusCompleted} />;
            case 'FAILED': return <XCircle size={16} className={styles.statusFailed} />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div className={`${styles.aiManagerContainer} fade-in`}>
            <header className={styles.header}>
                <div className={styles.titleWrapper}>
                    <div className={styles.iconBox}>
                        <Bot size={24} className={styles.icon} />
                    </div>
                    <div>
                        <h2 className={styles.title}>AI Central Command Hub</h2>
                        <p className={styles.subtitle}>Queue heavy AI tasks to be processed securely by your local worker.</p>
                    </div>
                </div>
                <button onClick={fetchData} className={styles.refreshBtn} title="Refresh Data">
                    <RefreshCw size={18} />
                </button>
            </header>

            <div className={styles.grid}>
                {/* Command Input Section */}
                <section className={styles.controlPanel}>
                    <h3 className={styles.sectionTitle}>
                        <Terminal size={18} /> New Task Dispatcher
                    </h3>
                    
                    <form onSubmit={handleQueueJob} className={styles.commandForm}>
                        <div className={styles.inputGroup}>
                            <label>Task Type</label>
                            <select 
                                value={jobType} 
                                onChange={(e) => setJobType(e.target.value)}
                                className={styles.selectInput}
                            >
                                <option value="IMPORT_TOOL">📥 Full Import (Scrape & Add Tool)</option>
                                <option value="UPDATE_PRICING">💸 Update Pricing Only</option>
                                <option value="FORMAT_BLOG">📝 Format Blog Article (AI)</option>
                                <option value="FIX_SEO">🔍 Run Global SEO Maintenance</option>
                            </select>
                        </div>

                        {jobType !== 'FIX_SEO' && (
                            <div className={styles.inputGroup}>
                                <label>Target URL or ID</label>
                                <input 
                                    type="text" 
                                    value={targetInput}
                                    onChange={(e) => setTargetInput(e.target.value)}
                                    placeholder={jobType === 'FORMAT_BLOG' ? "Enter Blog ID or URL..." : "https://example.com/pricing"}
                                    className={styles.textInput}
                                    required
                                />
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className={styles.submitBtn}
                        >
                            {isSubmitting ? <Loader2 className="spin" size={18} /> : <Send size={18} />}
                            {isSubmitting ? 'Dispatching...' : 'Dispatch Task to Worker'}
                        </button>

                        {submitMessage && (
                            <p className={`${styles.submitMessage} ${submitMessage.includes('❌') ? styles.errorMsg : styles.successMsg}`}>
                                {submitMessage}
                            </p>
                        )}
                    </form>

                    <div className={styles.statusInfo}>
                        <div className={styles.infoBadge}>
                            <AlertCircle size={14} /> Background Worker Required: Run 'npm run ai-worker' locally.
                        </div>
                    </div>
                </section>

                {/* Logs Section */}
                <div className={styles.logsWrapperCol}>
                    {/* Live Worker Queue Section */}
                    <section className={styles.logsPanel} style={{ marginBottom: '24px' }}>
                        <h3 className={styles.sectionTitle}>
                            <Clock size={18} /> Live Worker Queue
                        </h3>
                        
                        <div className={styles.logsContainer} style={{ minHeight: '150px' }}>
                            {isLoading ? (
                                <div className={styles.loadingLogs}>Fetching queue status...</div>
                            ) : jobs.length === 0 ? (
                                <div className={styles.emptyLogs}>Queue is empty. Dispatch a task to start.</div>
                            ) : (
                                jobs.map((job) => (
                                    <div key={job.id} className={`${styles.jobCard} ${styles[`job${job.status}`]}`}>
                                        <div className={styles.jobHeader}>
                                            <div className={styles.jobTypeBox}>
                                                {getStatusIcon(job.status)}
                                                <span className={styles.jobTypeName}>{job.job_type}</span>
                                            </div>
                                            <span className={styles.logDate}>
                                                {new Date(job.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className={styles.jobBody}>
                                            <p className={styles.jobTarget}>
                                                <strong>Target:</strong> {job.payload?.url || job.payload?.target || 'Global Action'}
                                            </p>
                                            {job.status === 'FAILED' && job.logs && (
                                                <div className={styles.jobErrorLog}>
                                                    {job.logs.slice(0, 200)}...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Historical Logs Section */}
                    <section className={styles.logsPanel}>
                        <h3 className={styles.sectionTitle}>
                            <History size={18} /> Historical Operation Logs
                        </h3>
                        
                        <div className={styles.logsContainer} style={{ maxHeight: '400px' }}>
                            {isLoading ? (
                                <div className={styles.loadingLogs}>Fetching historical data...</div>
                            ) : agentLogs.length === 0 ? (
                                <div className={styles.emptyLogs}>No historical operations recorded yet.</div>
                            ) : (
                                agentLogs.map((log) => (
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
                                                <div key={idx} className={`${styles.detailRow} ${styles[detail.status?.toLowerCase()] || ''}`}>
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
        </div>
    );
};

export default AdminAIManager;
