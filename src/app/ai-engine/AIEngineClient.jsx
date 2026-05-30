'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Settings } from 'lucide-react';
import { useAIEngineData } from '../../hooks/useAIEngineData';
import { useAISessions } from '../../hooks/useAISessions';
import { useAuth } from '../../context/AuthContext';
import { aiEngineService } from '../../services/aiEngineService';
import AIChatWidget from '../../components/AIEngine/AIChatWidget';
import AIEngineSidebar from '../../components/AIEngine/AIEngineSidebar';
import AIEngineModals from '../../components/AIEngine/AIEngineModals';
import ErrorBoundary from '../../components/ErrorBoundary';
import AIEngineSkeleton from './AIEngineSkeleton';
import Skeleton from '../../components/ui/Skeleton';
import styles from './AIEngine.module.css';

export default function AIEngineClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const t1Slug = searchParams.get('t1');
    const t2Slug = searchParams.get('t2');
    const sidParam = searchParams.get('sid');

    const { tool1, tool2, isLoading, error } = useAIEngineData(t1Slug, t2Slug);

    // --- Sessions Sidebar State via Elite Hook ---
    const {
        sessions,
        sessionsLoading,
        activeSessionId,
        setActiveSessionId,
        renameSession,
        deleteSession,
        onSessionCreated,
        onSessionTitleGenerated
    } = useAISessions(user?.id, sidParam);
    
    // --- Session Management State (UI ONLY) ---
    const [searchQuery, setSearchQuery] = useState('');
    const [actionModal, setActionModal] = useState(null); // { type: 'rename' | 'delete' | 'settings', session: obj }
    const [editingTitle, setEditingTitle] = useState('');

    // --- AI Settings State ---
    const [aiSettings, setAiSettings] = useState({ tone: 'default', language: 'auto' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('hubly_ai_settings');
            if (saved) setAiSettings(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hubly_ai_settings', JSON.stringify(aiSettings));
        }
    }, [aiSettings]);
    
    // --- Active Session Messages State ---
    const [historicalMessages, setHistoricalMessages] = useState(null);
    const [messagesLoading, setMessagesLoading] = useState(false);

    // Track when we create a session to prevent reloading messages mid-stream
    const createdSessionIdRef = useRef(null);

    const handleSessionCreated = useCallback((sessionId) => {
        createdSessionIdRef.current = sessionId;
        onSessionCreated(sessionId);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sid', sessionId);
        router.replace(`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`, { scroll: false });
    }, [onSessionCreated, router]);

    const handleRenameSubmit = async (e) => {
        if (e) e.preventDefault();
        const session = actionModal?.session;
        if (!session || !editingTitle.trim() || editingTitle.trim() === session.title) {
            setActionModal(null);
            return;
        }
        await renameSession(session.id, editingTitle.trim());
        setActionModal(null);
    };

    const handleDeleteConfirm = async () => {
        const session = actionModal?.session;
        if (!session) return;
        
        const didClearActive = await deleteSession(session.id);
        if (didClearActive) {
            router.push('/ai-engine');
        }
        setActionModal(null);
    };

    const filteredSessions = sessions.filter(session => {
        if (!searchQuery) return true;
        const label = session.title || (session.tool1 && session.tool2 ? `${session.tool1.name} vs ${session.tool2.name}` : 'AI Session');
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Fetch messages when a session is selected
    useEffect(() => {
        const loadMessages = async () => {
            if (!activeSessionId) {
                setHistoricalMessages(null);
                return;
            }
            if (activeSessionId === createdSessionIdRef.current) {
                createdSessionIdRef.current = null;
                return;
            }
            setMessagesLoading(true);
            const { data, error } = await aiEngineService.getMessages(activeSessionId);
            if (!error && data) {
                setHistoricalMessages(data);
            }
            setMessagesLoading(false);
        };
        loadMessages();
    }, [activeSessionId]);

    const handleSessionClick = (session) => {
        setActiveSessionId(session.id);
        const t1 = session.tool1?.slug;
        const t2 = session.tool2?.slug;
        
        if (t1 && t2) {
            // Comparison session — navigate with tool slugs
            router.push(`/ai-engine?t1=${t1}&t2=${t2}&sid=${session.id}`);
        } else {
            // Generic AI session — navigate with just the session id
            router.push(`/ai-engine?sid=${session.id}`);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const now = new Date();
        const diff = now - d;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (isLoading) {
        return <AIEngineSkeleton />;
    }

    return (
        <div className={styles.viewWrapper}>
            <div className={styles.container}>
                <div className={styles.studioLayout}>

                    {/* ── Sidebar ── */}
                    <AIEngineSidebar
                        user={user}
                        router={router}
                        sessions={sessions}
                        sessionsLoading={sessionsLoading}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        activeSessionId={activeSessionId}
                        setActiveSessionId={setActiveSessionId}
                        setActionModal={setActionModal}
                        setEditingTitle={setEditingTitle}
                        handleSessionClick={handleSessionClick}
                    />

                    {/* ── Main Chat Area ── */}
                    <main className={styles.mainArea}>
                        <header className={styles.mainHeader}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {/* Left side empty for flex alignment, or you could add a subtle logo here if needed */}
                            </div>
                            <div className={styles.activeTools}>
                                {tool1 && tool2 && (
                                    <>Comparing <strong>{tool1.name}</strong> vs <strong>{tool2.name}</strong></>
                                )}
                            </div>
                            <button 
                                onClick={() => setActionModal({ type: 'settings' })}
                                style={{ 
                                    background: 'transparent', 
                                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                                    color: '#cbd5e1', 
                                    padding: '8px', 
                                    borderRadius: '50%', 
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                title="AI Settings"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#00d2ff';
                                    e.currentTarget.style.borderColor = 'rgba(0, 210, 255, 0.3)';
                                    e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#cbd5e1';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Settings size={18} />
                            </button>
                        </header>

                        <div className={styles.chatContainerWrapper}>
                            {messagesLoading ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px', width: '100%', maxWidth: '760px', margin: '0 auto', paddingBottom: '120px' }}>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <Skeleton width="32px" height="32px" borderRadius="50%" style={{ flexShrink: 0 }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Skeleton width="75%" height="18px" borderRadius="8px" />
                                            <Skeleton width="55%" height="18px" borderRadius="8px" />
                                            <Skeleton width="40%" height="18px" borderRadius="8px" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flexDirection: 'row-reverse' }}>
                                        <Skeleton width="32px" height="32px" borderRadius="50%" style={{ flexShrink: 0 }} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                            <Skeleton width="200px" height="18px" borderRadius="8px" />
                                            <Skeleton width="140px" height="18px" borderRadius="8px" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                        <Skeleton width="32px" height="32px" borderRadius="50%" style={{ flexShrink: 0 }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <Skeleton width="90%" height="18px" borderRadius="8px" />
                                            <Skeleton width="70%" height="18px" borderRadius="8px" />
                                            <Skeleton width="60%" height="18px" borderRadius="8px" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ErrorBoundary>
                                    <AIChatWidget
                                        tool1={tool1}
                                        tool2={tool2}
                                        onSessionCreated={handleSessionCreated}
                                        onSessionTitleGenerated={onSessionTitleGenerated}
                                        initialSessionId={activeSessionId}
                                        initialMessages={historicalMessages}
                                        aiSettings={aiSettings}
                                    />
                                </ErrorBoundary>
                            )}
                        </div>
                    </main>

                </div>
            </div>

            {/* ── Modals ── */}
            <AIEngineModals
                actionModal={actionModal}
                setActionModal={setActionModal}
                editingTitle={editingTitle}
                setEditingTitle={setEditingTitle}
                handleRenameSubmit={handleRenameSubmit}
                handleDeleteConfirm={handleDeleteConfirm}
                aiSettings={aiSettings}
                setAiSettings={setAiSettings}
            />
        </div>
    );
}
