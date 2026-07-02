'use client';
import React from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Shield, Star, Brain, Zap, ArrowDown } from 'lucide-react';
import Button from '../ui/Button';
import { useAIChatWidgetLogic } from '../../hooks/useAIChatWidgetLogic';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import AIChatEmptyState from './AIChatEmptyState';
import AIChatMessageList from './AIChatMessageList';
import AIChatInput from './AIChatInput';
import AIChatLimitAlert from './AIChatLimitAlert';
import AIChatWorkspaceModal from './AIChatWorkspaceModal';
import AIChatModelsModal from './AIChatModelsModal';
import styles from './AIChatWidget.module.css';

export default function AIChatWidget(props) {
    const {
        user,
        isPremium,
        isLoadingAuth,
        chatProps,
        workspaceProps,
        modelProps,
        uiProps,
        mounted
    } = useAIChatWidgetLogic(props);

    const { messages, input, setInput, sendMessage, isLoading, streamPhase, isLimitReached, isGuestLimitReached, globalMessageCount, suggestions, isGeneratingSuggestions, retryLastMessage } = chatProps;

    // Determine the active model icon
    const selectedIconString = modelProps.getSelectedModelConfig().icon;
    let ActiveModelIcon = Zap;
    if (selectedIconString === 'Star') ActiveModelIcon = Star;
    if (selectedIconString === 'Brain') ActiveModelIcon = Brain;

    return (
        <div className={`${styles.chatContainer} notranslate`} translate="no">

            {/* ── Empty State ── */}
            {messages.length === 0 && !isLoading && (
                <AIChatEmptyState
                    isGeneratingSuggestions={isGeneratingSuggestions}
                    suggestions={suggestions}
                    sendMessage={sendMessage}
                    isCompareMode={props.isCompareMode}
                />
            )}

            {/* ── Messages ── */}
            <AIChatMessageList
                messages={messages}
                isLoading={isLoading}
                tool1={props.tool1}
                tool2={props.tool2}
                streamPhase={streamPhase}
                retryLastMessage={retryLastMessage}
                copyToClipboard={uiProps.copyToClipboard}
                copiedMessageId={uiProps.copiedMessageId}
                avatarUrl={uiProps.avatarUrl}
                displayName={uiProps.displayName}
                messagesContainerRef={uiProps.messagesContainerRef}
                messagesEndRef={uiProps.messagesEndRef}
            />

            {uiProps.showScrollButton && (
                <button
                    className={styles.scrollToBottomBtn}
                    onClick={uiProps.forceScrollToBottom}
                    aria-label="Scroll to bottom"
                >
                    <ArrowDown size={18} />
                </button>
            )}

            {/* ── Input / Limits ── */}
            {(isGuestLimitReached || isLimitReached) && !isLoadingAuth ? (
                <AIChatLimitAlert
                    isGuestLimitReached={isGuestLimitReached}
                    countdown={uiProps.countdown}
                />
            ) : (
                <AIChatInput
                    input={input}
                    setInput={setInput}
                    sendMessage={sendMessage}
                    handleKeyDown={uiProps.handleKeyDown}
                    isLoading={isLoading}
                    textareaRef={uiProps.textareaRef}
                    tool1={props.tool1}
                    tool2={props.tool2}
                    isPremium={isPremium}
                    isLoadingAuth={isLoadingAuth}
                    user={user}
                    globalMessageCount={globalMessageCount}
                    ActiveModelIcon={ActiveModelIcon}
                    getSelectedModelConfig={modelProps.getSelectedModelConfig}
                    setIsModelModalOpen={modelProps.setIsModelModalOpen}
                    setIsWorkspaceModalOpen={workspaceProps.setIsWorkspaceModalOpen}
                    setIsUpgradeModalOpen={modelProps.setIsUpgradeModalOpen}
                    isCompareMode={props.isCompareMode}
                />
            )}

            {/* ── Modals ── */}
            <AIChatWorkspaceModal workspaceProps={workspaceProps} user={user} />
            <AIChatModelsModal modelProps={modelProps} />

            {/* Upgrade Modal */}
            {modelProps.isUpgradeModalOpen && mounted && createPortal(
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.upgradeModalBody}>
                            <Shield size={48} className={styles.upgradeModalIcon} />
                            <h3 className={styles.upgradeModalTitle}>{AI_ENGINE_CONSTANTS.upgradeModal.title}</h3>
                            <p className={styles.upgradeModalDesc}>
                                {AI_ENGINE_CONSTANTS.upgradeModal.description}
                            </p>
                            <div className={styles.upgradeModalActions}>
                                <Button variant="ghost" onClick={() => modelProps.setIsUpgradeModalOpen(false)}>Maybe Later</Button>
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
