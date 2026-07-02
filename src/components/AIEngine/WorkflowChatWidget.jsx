'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import { Shield, Star, Brain, Zap, ArrowDown } from 'lucide-react';
import Button from '../ui/Button';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import AIChatEmptyState from './AIChatEmptyState';
import AIChatMessageList from './AIChatMessageList';
import WorkflowChatInput from './WorkflowChatInput';
import AIChatLimitAlert from './AIChatLimitAlert';
import AIChatWorkspaceModal from './AIChatWorkspaceModal';
import AIChatModelsModal from './AIChatModelsModal';
import { useWorkflowChatWidgetLogic } from '../../hooks/useWorkflowChatWidgetLogic';
import styles from './WorkflowChatWidget.module.css';

export default function WorkflowChatWidget({
    user,
    tool1,
    tool2,
    onSessionCreated,
    onSessionTitleGenerated,
    initialSessionId,
    initialMessages,
    aiSettings,
    workspaceProps,
    chatProps, // Passed from parent Client page (which uses useWorkflowChat)
    onArtifactUpdate = null
}) {
    const {
        mounted,
        isPremium,
        modelProps,
        uiProps
    } = useWorkflowChatWidgetLogic({ user, chatProps });

    const {
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isModelModalOpen,
        setIsModelModalOpen,
        getSelectedModelConfig
    } = modelProps;

    const {
        messagesEndRef,
        messagesContainerRef,
        textareaRef,
        copiedMessageId,
        showScrollButton,
        handleKeyDown,
        copyToClipboard,
        forceScrollToBottom
    } = uiProps;

    const {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
        streamPhase,
        isLimitReached,
        isGuestLimitReached,
        globalMessageCount,
        suggestions,
        isGeneratingSuggestions,
        retryLastMessage,
        onWorkflowStateUpdate,
        syncMessageId
    } = chatProps;

    // Determine active model icon
    const selectedIconString = getSelectedModelConfig().icon;
    let ActiveModelIcon = Zap;
    if (selectedIconString === 'Star') ActiveModelIcon = Star;
    if (selectedIconString === 'Brain') ActiveModelIcon = Brain;

    const displayName = user?.user_metadata?.full_name || user?.full_name || 'You';
    const avatarUrl = user?.user_metadata?.avatar_url || user?.avatar_url;

    return (
        <div className={`${styles.chatContainer} notranslate`} translate="no">

            {/* ── Empty State ── */}
            {messages.length === 0 && !isLoading && (
                <AIChatEmptyState
                    isGeneratingSuggestions={isGeneratingSuggestions}
                    suggestions={suggestions}
                    sendMessage={sendMessage}
                    isCompareMode={false}
                />
            )}

            {/* ── Messages ── */}
            <AIChatMessageList
                messages={messages}
                isLoading={isLoading}
                tool1={tool1}
                tool2={tool2}
                streamPhase={streamPhase}
                retryLastMessage={retryLastMessage}
                copyToClipboard={copyToClipboard}
                copiedMessageId={copiedMessageId}
                avatarUrl={avatarUrl}
                displayName={displayName}
                messagesContainerRef={messagesContainerRef}
                messagesEndRef={messagesEndRef}
                compact={true}
                // Custom workflow sync attributes
                onWorkflowStateUpdate={onWorkflowStateUpdate}
                syncMessageId={syncMessageId}
                onArtifactUpdate={onArtifactUpdate}
            />

            {showScrollButton && (
                <button
                    className={styles.scrollToBottomBtn}
                    onClick={forceScrollToBottom}
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown size={18} />
                </button>
            )}

            {/* ── Input / Limits ── */}
            {(isLimitReached || isGuestLimitReached) ? (
                <AIChatLimitAlert
                    isGuestLimitReached={isGuestLimitReached}
                    countdown=""
                />
            ) : (
                <WorkflowChatInput
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    handleKeyDown={handleKeyDown}
                    isLoading={isLoading}
                    textareaRef={textareaRef}
                    isPremium={isPremium}
                    isLoadingAuth={false}
                    user={user}
                    globalMessageCount={globalMessageCount}
                    ActiveModelIcon={ActiveModelIcon}
                    getSelectedModelConfig={getSelectedModelConfig}
                    setIsModelModalOpen={setIsModelModalOpen}
                    setIsWorkspaceModalOpen={workspaceProps.setIsWorkspaceModalOpen}
                    setIsUpgradeModalOpen={setIsUpgradeModalOpen}
                />
            )}

            {/* ── Modals ── */}
            <AIChatWorkspaceModal workspaceProps={workspaceProps} user={user} />
            <AIChatModelsModal modelProps={modelProps} />

            {/* Upgrade Modal */}
            {isUpgradeModalOpen && mounted && createPortal(
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.upgradeModalBody}>
                            <Shield size={48} className={styles.upgradeModalIcon} />
                            <h3 className={styles.upgradeModalTitle}>{AI_ENGINE_CONSTANTS.upgradeModal.title}</h3>
                            <p className={styles.upgradeModalDesc}>
                                {AI_ENGINE_CONSTANTS.upgradeModal.description}
                            </p>
                            <div className={styles.upgradeModalActions}>
                                <Button variant="ghost" onClick={() => setIsUpgradeModalOpen(false)}>Maybe Later</Button>
                                <Button variant="primary" as="a" href="/premium">{AI_ENGINE_CONSTANTS.upgradeModal.cta}</Button>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
