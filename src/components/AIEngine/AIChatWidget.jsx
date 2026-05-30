'use client';
import React from 'react';
import Image from 'next/image';
import { Shield } from 'lucide-react';
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
        uiProps
    } = useAIChatWidgetLogic(props);

    const { messages, input, setInput, sendMessage, isLoading, streamPhase, isLimitReached, isGuestLimitReached, globalMessageCount, suggestions, isGeneratingSuggestions, retryLastMessage } = chatProps;
    
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

            {/* ── Input / Limits ── */}
            {isGuestLimitReached || isLimitReached ? (
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
                    ActiveModelIcon={modelProps.getSelectedModelConfig().icon === 'Star' ? require('lucide-react').Star : (modelProps.getSelectedModelConfig().icon === 'Brain' ? require('lucide-react').Brain : require('lucide-react').Zap)}
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
            {modelProps.isUpgradeModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div style={{ textAlign: 'center' }}>
                            <Shield size={48} style={{ color: '#f59e0b', margin: '0 auto 16px' }} />
                            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', color: '#fff' }}>{AI_ENGINE_CONSTANTS.upgradeModal.title}</h3>
                            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '24px' }}>
                                {AI_ENGINE_CONSTANTS.upgradeModal.description}
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                <Button variant="ghost" onClick={() => modelProps.setIsUpgradeModalOpen(false)}>Maybe Later</Button>
                                <Button variant="primary" as="a" href="/premium">{AI_ENGINE_CONSTANTS.upgradeModal.cta}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
