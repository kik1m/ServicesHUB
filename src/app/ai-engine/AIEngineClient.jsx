'use client';
import React, { useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { useAIEngineData } from '../../hooks/useAIEngineData';
import { useAISessions } from '../../hooks/useAISessions';
import { useAISettings } from '../../hooks/useAISettings';
import { useWorkspace } from '../../hooks/useWorkspace';
import { useAuth } from '../../context/AuthContext';
import AIChatWidget from '../../components/AIEngine/AIChatWidget';
import AIEngineSidebar from '../../components/AIEngine/AIEngineSidebar';
import AIEngineModals from '../../components/AIEngine/AIEngineModals';
import ErrorBoundary from '../../components/ErrorBoundary';
import AIEngineSkeleton from '../../components/AIEngine/AIEngineSkeleton';
import ChatLoadingSkeleton from '../../components/AIEngine/ChatLoadingSkeleton';
import { ArtifactProvider } from '../../context/ArtifactContext';
import styles from './AIEngine.module.css';

export default function AIEngineClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const t1Slug = searchParams.get('t1');
    const t2Slug = searchParams.get('t2');
    const sidParam = searchParams.get('sid');

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);

    const { tool1, tool2, isLoading, error } = useAIEngineData(t1Slug, t2Slug);
    const workspaceProps = useWorkspace(user);

    // --- AI Settings State via Extracted Hook ---
    const { aiSettings, setAiSettings } = useAISettings();

    // --- Sessions Sidebar State via Elite Hook ---
    const {
        sessions,
        sessionsLoading,
        activeSessionId,
        setActiveSessionId,
        renameSession,
        deleteSession,
        onSessionCreated,
        onSessionTitleGenerated,
        historicalMessages,
        messagesLoading
    } = useAISessions(user?.id, sidParam);

    const [newChatNonce, setNewChatNonce] = useState(0);

    // --- Session Management State (UI ONLY) ---
    const [searchQuery, setSearchQuery] = useState('');
    const [actionModal, setActionModal] = useState(null); // { type: 'rename' | 'delete' | 'settings', session: obj }
    const [editingTitle, setEditingTitle] = useState('');

    const handleSessionCreated = useCallback((sessionId) => {
        onSessionCreated(sessionId);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('sid', sessionId);
        window.history.replaceState(null, '', `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`);
    }, [onSessionCreated]);

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


    return (
        <ArtifactProvider>
            <div className={`${styles.viewWrapper} notranslate`} translate="no">
                <div className={styles.container}>
                    <div className={styles.studioLayout}>

                        {/* ── Sidebar ── */}
                        <AIEngineSidebar
                            user={user}
                            router={router}
                            sessions={sessions}
                            sessionsLoading={sessionsLoading || isLoading}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            activeSessionId={activeSessionId}
                            setActiveSessionId={setActiveSessionId}
                            setActionModal={setActionModal}
                            setEditingTitle={setEditingTitle}
                            handleSessionClick={handleSessionClick}
                            onNewChatClick={() => {
                                if (tool1 && tool2) {
                                    router.push(`/ai-engine?t1=${tool1.slug}&t2=${tool2.slug}`);
                                } else {
                                    router.push('/ai-engine');
                                }
                                setNewChatNonce(prev => prev + 1);
                            }}
                            isOpen={isMobileSidebarOpen}
                            setIsOpen={setIsMobileSidebarOpen}
                            workspaceProps={workspaceProps}
                        />

                        <div
                            className={`${styles.mobileOverlay} ${isMobileSidebarOpen ? styles.mobileOverlayOpen : ''}`}
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />

                        {/* ── Main Chat Area ── */}
                        <main className={styles.mainArea}>
                            <button
                                className={`${styles.floatingSidebarToggle} ${!isMobileSidebarOpen ? styles.toggleVisible : ''}`}
                                onClick={() => setIsMobileSidebarOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <Menu size={20} />
                            </button>

                            <div className={styles.chatContainerWrapper}>
                                {messagesLoading || isLoading ? (
                                    <ChatLoadingSkeleton />
                                ) : (
                                    <ErrorBoundary>
                                        <AIChatWidget
                                            key={'new-chat-' + newChatNonce}
                                            tool1={tool1}
                                            tool2={tool2}
                                            onSessionCreated={handleSessionCreated}
                                            onSessionTitleGenerated={onSessionTitleGenerated}
                                            initialSessionId={sidParam}
                                            initialMessages={historicalMessages}
                                            aiSettings={aiSettings}
                                            workspaceProps={workspaceProps}
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
        </ArtifactProvider>
    );
}
