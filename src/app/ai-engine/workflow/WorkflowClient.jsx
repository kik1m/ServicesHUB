'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Layers, MessageSquare, History, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useAISessions } from '../../../hooks/useAISessions';
import { useAISettings } from '../../../hooks/useAISettings';
import { useWorkspace } from '../../../hooks/useWorkspace';
import { useWorkflowChat } from '../../../hooks/useWorkflowChat';
import { useWorkflowBlueprint } from '../../../hooks/useWorkflowBlueprint';
import { DB_SCHEMA_TABLES } from '../../../constants/workflowConstants';
import WorkflowChatWidget from '../../../components/AIEngine/WorkflowChatWidget';
import WorkflowPaywall from '../../../components/AIEngine/WorkflowPaywall';
import AIEngineSidebar from '../../../components/AIEngine/AIEngineSidebar';
import AIEngineModals from '../../../components/AIEngine/AIEngineModals';
import AIEngineSkeleton from '../../../components/AIEngine/AIEngineSkeleton';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useArtifact } from '../../../context/ArtifactContext';
import WorkflowPresenter from '../../../components/AIEngine/WorkflowPresenter';
import VisualRenderer from '../../../components/AIEngine/VisualRenderer';
import WorkflowToolbarPanel from '../../../components/AIEngine/WorkflowToolbarPanel';
import WorkflowChatOverlay from '../../../components/AIEngine/WorkflowChatOverlay';
import WorkflowAddPhaseForm from '../../../components/AIEngine/WorkflowAddPhaseForm';
import styles from '../AIEngine.module.css';

// ─────────────────────────────────────────────────────────────────────────────
// WorkflowClient — Refactored: lean orchestrator (~120 lines of logic)
// Blueprint parsing  → useWorkflowBlueprint hook
// DB_SCHEMA_TABLES  → workflowConstants.js
// Left toolbar      → WorkflowToolbarPanel
// Chat overlay      → WorkflowChatOverlay
// Add phase form    → WorkflowAddPhaseForm
// ─────────────────────────────────────────────────────────────────────────────
export default function WorkflowClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user, loading } = useAuth();

    const { visualArtifact, clearVisualArtifact, setVisualArtifact } = useArtifact();

    const t1Slug = searchParams.get('t1');
    const t2Slug = searchParams.get('t2');
    const sidParam = searchParams.get('sid');

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
    const workspaceProps = useWorkspace(user);
    const { aiSettings, setAiSettings } = useAISettings();

    // ── Paywall check ─────────────────────────────────────────────────────────
    const isProfileStillLoading = user && user.is_premium === undefined;
    const isPremium = user?.is_premium || searchParams.get('mockPremium') === 'true';

    // ── Sessions ─────────────────────────────────────────────────────────────
    const {
        sessions, sessionsLoading, activeSessionId, setActiveSessionId,
        renameSession, deleteSession,
        onSessionCreated, onSessionTitleGenerated,
        historicalMessages, messagesLoading,
    } = useAISessions(user?.id, sidParam);

    const [newChatNonce, setNewChatNonce] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [actionModal, setActionModal] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');

    const handleSessionCreated = useCallback((sessionId) => {
        onSessionCreated(sessionId);
        const url = new URL(window.location.href);
        url.searchParams.set('sid', sessionId);
        window.history.replaceState(null, '', `${url.pathname}?${url.searchParams.toString()}`);
    }, [onSessionCreated]);

    const handleRenameSubmit = async (e) => {
        if (e) e.preventDefault();
        const session = actionModal?.session;
        if (!session || !editingTitle.trim() || editingTitle.trim() === session.title) { setActionModal(null); return; }
        await renameSession(session.id, editingTitle.trim());
        setActionModal(null);
    };

    const handleDeleteConfirm = async () => {
        const session = actionModal?.session;
        if (!session) return;
        const didClearActive = await deleteSession(session.id);
        if (didClearActive) router.push('/ai-engine/workflow');
        setActionModal(null);
    };

    const handleSessionClick = (session) => {
        setActiveSessionId(session.id);
        const t1 = session.tool1?.slug;
        const t2 = session.tool2?.slug;
        router.push(t1 && t2
            ? `/ai-engine/workflow?t1=${t1}&t2=${t2}&sid=${session.id}`
            : `/ai-engine/workflow?sid=${session.id}`
        );
    };

    // ── Workflow chat hook ────────────────────────────────────────────────────
    const chatProps = useWorkflowChat(
        null, null, user,
        handleSessionCreated, sidParam, historicalMessages,
        onSessionTitleGenerated, aiSettings,
        workspaceProps.workspaceContext, 'auto', false
    );

    // Declarative key updates replace useEffect sync.

    // ── Blueprint parsing (extracted hook) ───────────────────────────────────
    const activeBlueprint = useWorkflowBlueprint(chatProps.messages, sidParam);

    // ── Workspace UI states ───────────────────────────────────────────────────
    const [isChatCollapsed, setIsChatCollapsed] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
    const [activeView, setActiveView] = useState('presenter');
    const [isAddingPhase, setIsAddingPhase] = useState(false);

    // ── Interactive help event listener ──────────────────────────────────────
    useEffect(() => {
        const handleHelp = (e) => {
            const msg = e.detail?.message;
            if (msg) {
                setIsChatCollapsed(false);
                chatProps.setInput(msg);
            }
        };
        window.addEventListener('workflow_help_request', handleHelp);
        return () => window.removeEventListener('workflow_help_request', handleHelp);
    }, [chatProps]);

    // ── Manual add phase ─────────────────────────────────────────────────────
    const handleAddPhaseSubmit = (title, desc) => {
        if (!title.trim() || !activeBlueprint) return;
        const current = typeof activeBlueprint.blueprint === 'string'
            ? JSON.parse(activeBlueprint.blueprint)
            : activeBlueprint.blueprint;
        const updated = {
            ...current,
            phases: [
                ...(current.phases || []),
                { id: `phase-${Date.now()}`, title, description: desc || 'New phase description.', status: 'pending', tasks: [] },
            ],
        };
        chatProps.onWorkflowStateUpdate(updated, activeBlueprint.messageId);
        if (sidParam) {
            fetch('/api/v1/engine/workflow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: sidParam, blueprint_json: updated }),
            }).catch(err => console.error('Failed to save manual phase:', err));
        }
        setIsAddingPhase(false);
    };

    const handleStartProjectPlan = useCallback((promptText) => {
        setIsChatCollapsed(false);
        chatProps.sendMessage(null, promptText);
    }, [chatProps]);

    // If auth is still loading, we render the page structure in loading state.
    const isAuthenticating = loading || isProfileStillLoading;
    const showPaywall = !isAuthenticating && !isPremium;

    return (
        <div className={`${styles.viewWrapper} ${styles.workflowViewWrapper} notranslate`} translate="no">
                <div className={styles.container}>
                    <div className={styles.studioLayout}>

                        {/* ── Sidebar (always rendered, toggled via CSS) ── */}
                        <AIEngineSidebar
                            user={user} router={router}
                            sessions={sessions} sessionsLoading={sessionsLoading || isAuthenticating}
                            searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                            activeSessionId={activeSessionId} setActiveSessionId={setActiveSessionId}
                            setActionModal={setActionModal} setEditingTitle={setEditingTitle}
                            handleSessionClick={handleSessionClick}
                            onNewChatClick={() => { router.push('/ai-engine/workflow'); setNewChatNonce(prev => prev + 1); }}
                            isOpen={!isSidebarCollapsed} setIsOpen={(open) => setIsSidebarCollapsed(!open)}
                            workspaceProps={workspaceProps}
                        />

                        <div className={`${styles.mobileOverlay} ${isMobileSidebarOpen ? styles.mobileOverlayOpen : ''}`} onClick={() => setIsMobileSidebarOpen(false)} />

                        {/* ── Main Split Layout ── */}
                        <div className={styles.mainContentSplit}>

                            {/* Left vertical toolbar */}
                            <WorkflowToolbarPanel
                                activeView={activeView}
                                setActiveView={setActiveView}
                                isSidebarCollapsed={isSidebarCollapsed}
                                setIsSidebarCollapsed={setIsSidebarCollapsed}
                                isChatCollapsed={isChatCollapsed}
                                setIsChatCollapsed={setIsChatCollapsed}
                                isLoading={chatProps.isLoading}
                                onAddPhase={() => setIsAddingPhase(true)}
                            />

                            {/* Center canvas */}
                            <div className={styles.canvasMainArea}>
                                {showPaywall ? (
                                    <WorkflowPaywall />
                                ) : (
                                    <>
                                        {/* Add Phase popover */}
                                        {isAddingPhase && (
                                            <WorkflowAddPhaseForm
                                                onSubmit={handleAddPhaseSubmit}
                                                onCancel={() => setIsAddingPhase(false)}
                                            />
                                        )}

                                        {visualArtifact ? (
                                            <div className={styles.visualArtifactWorkspace}>
                                                <div className={styles.visualArtifactHeader}>
                                                    <span className={styles.visualArtifactTitle}>⚙️ AI Generated Component Sandbox</span>
                                                    <button 
                                                        onClick={clearVisualArtifact}
                                                        className={styles.visualArtifactCloseBtn}
                                                    >
                                                        Back to Workflow Plan ↩
                                                    </button>
                                                </div>
                                                <div className={styles.visualArtifactBody}>
                                                    <VisualRenderer 
                                                        code={visualArtifact.code}
                                                        onWorkflowStateUpdate={chatProps.onWorkflowStateUpdate}
                                                        messageId={visualArtifact.messageId}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                             <WorkflowPresenter
                                                 blueprint={activeBlueprint?.rawBlueprint || ''}
                                                 projectId={activeBlueprint?.projectId || sidParam || 'new-session'}
                                                 onWorkflowStateUpdate={chatProps.onWorkflowStateUpdate}
                                                 isChatCollapsed={isChatCollapsed}
                                                 isLoading={chatProps.isLoading || messagesLoading}
                                                 onStartProjectPlan={handleStartProjectPlan}
                                             />
                                         )}
                                    </>
                                )}
                            </div>

                            {/* Right AI chat overlay */}
                            {!isChatCollapsed && !showPaywall && (
                                <WorkflowChatOverlay
                                    onClose={() => setIsChatCollapsed(true)}
                                    messagesLoading={messagesLoading || isAuthenticating}
                                >
                                    <WorkflowChatWidget
                                        key={`workflow-chat-new-${newChatNonce}`}
                                        user={user} tool1={null} tool2={null}
                                        onSessionCreated={handleSessionCreated}
                                        onSessionTitleGenerated={onSessionTitleGenerated}
                                        initialSessionId={sidParam}
                                        initialMessages={historicalMessages}
                                        aiSettings={aiSettings}
                                        workspaceProps={workspaceProps}
                                        chatProps={chatProps}
                                        onArtifactUpdate={setVisualArtifact}
                                    />
                                </WorkflowChatOverlay>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Modals ── */}
                <AIEngineModals
                    actionModal={actionModal} setActionModal={setActionModal}
                    editingTitle={editingTitle} setEditingTitle={setEditingTitle}
                    handleRenameSubmit={handleRenameSubmit}
                    handleDeleteConfirm={handleDeleteConfirm}
                    aiSettings={aiSettings} setAiSettings={setAiSettings}
                />
            </div>
    );
}
