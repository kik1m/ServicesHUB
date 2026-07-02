import React, { memo } from 'react';
import Image from 'next/image';
import { User, Zap, Check, Copy, Edit2, Sparkles, Clock } from 'lucide-react';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';
import Button from '../ui/Button';
import styles from './AIChatMessageList.module.css';

const MemoUserMessage = memo(({ content }) => {
    if (content?.startsWith('[REFINE]')) {
        try {
            const newlineIndex = content.indexOf('\n');
            const jsonStr = newlineIndex !== -1 ? content.slice(8, newlineIndex) : content.slice(8);
            const data = JSON.parse(jsonStr);
            return (
                <div className={styles.refineMessageContainer}>
                    <div className={styles.refineHeader}>
                        <span className={styles.refineBadge}>
                            <Edit2 size={12} className={styles.refineBadgeIcon} />
                            Refine
                        </span>
                        <span className={styles.refineTarget}>
                            {data.phase} ➡️ {data.step}
                        </span>
                    </div>
                    <div className={styles.refineRequestText}>
                        {data.request}
                    </div>
                </div>
            );
        } catch (e) {
            console.error('Failed to parse refine message JSON:', e);
        }
    }

    if (content?.startsWith('Please generate a comprehensive, interactive project plan/blueprint')) {
        try {
            const nameMatch = content.match(/named "([^"]+)"/);
            const projectName = nameMatch ? nameMatch[1].trim() : 'New Project';

            let description = '';
            const descHeader = '**Project Description/Goal:**';
            const paramsHeader = '**Project Parameters & Preferences:**';
            const descStart = content.indexOf(descHeader);
            const paramsStart = content.indexOf(paramsHeader);
            if (descStart !== -1 && paramsStart !== -1) {
                description = content.slice(descStart + descHeader.length, paramsStart).trim();
            } else if (descStart !== -1) {
                const timelineHeader = '**Target Timeline Constraints:**';
                const timelineStart = content.indexOf(timelineHeader);
                const descEnd = timelineStart !== -1 ? timelineStart : content.length;
                description = content.slice(descStart + descHeader.length, descEnd).trim();
            }

            let timeline = '';
            const timelineHeader = '**Target Timeline Constraints:**';
            const formatHeader = '**Format Requirements:**';
            const timelineStart = content.indexOf(timelineHeader);
            const formatStart = content.indexOf(formatHeader);
            if (timelineStart !== -1) {
                const timelineEnd = formatStart !== -1 ? formatStart : content.length;
                const timelineSection = content.slice(timelineStart + timelineHeader.length, timelineEnd).trim();
                const timelineMatch = timelineSection.match(/-\s*Timeline:\s*([^\n]+)/);
                timeline = timelineMatch ? timelineMatch[1].trim() : '';
            }

            const parameters = [];
            if (paramsStart !== -1 && timelineStart !== -1) {
                const paramsText = content.slice(paramsStart + paramsHeader.length, timelineStart).trim();
                const lines = paramsText.split('\n');
                let currentGroup = null;
                lines.forEach(line => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('**') && trimmed.endsWith('**:')) {
                        currentGroup = trimmed.replace(/\*\*/g, '').replace(':', '').trim();
                    } else if (trimmed.startsWith('- ') && currentGroup) {
                        const parts = trimmed.slice(2).split(':');
                        if (parts.length >= 2) {
                            const label = parts[0].trim();
                            const value = parts.slice(1).join(':').trim();
                            if (value && value.toLowerCase() !== 'not specified' && value.toLowerCase() !== 'no') {
                                parameters.push({ group: currentGroup, label, value });
                            }
                        }
                    }
                });
            }

            return (
                <div className={styles.wizardPromptContainer}>
                    <div className={styles.wizardPromptHeader}>
                        <div className={styles.wizardPromptIconWrapper}>
                            <Sparkles size={16} className={styles.wizardPromptIcon} />
                        </div>
                        <div className={styles.wizardPromptHeaderInfo}>
                            <h4 className={styles.wizardPromptTitle}>{projectName}</h4>
                            <span className={styles.wizardPromptBadge}>Project Plan Initialized</span>
                        </div>
                    </div>
                    
                    {description && (
                        <div className={styles.wizardPromptDesc}>
                            {description}
                        </div>
                    )}

                    <div className={styles.wizardPromptMeta}>
                        {timeline && (
                            <div className={styles.wizardPromptTimeline}>
                                <Clock size={12} className={styles.wizardPromptMetaIcon} />
                                <span>Timeline: <strong>{timeline}</strong></span>
                            </div>
                        )}
                    </div>

                    {parameters.length > 0 && (
                        <div className={styles.wizardPromptParamsWrapper}>
                            <h5 className={styles.wizardPromptParamsTitle}>Project Details & Requirements:</h5>
                            <div className={styles.wizardPromptParamsGrid}>
                                {parameters.map((param, index) => (
                                    <div key={index} className={styles.wizardPromptParamCard}>
                                        <span className={styles.wizardPromptParamGroup}>{param.group}</span>
                                        <span className={styles.wizardPromptParamLabel}>{param.label}</span>
                                        <span className={styles.wizardPromptParamValue}>{param.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            );
        } catch (e) {
            console.error('Failed to parse wizard prompt message:', e);
        }
    }

    return <div className={styles.userMessageText}>{content}</div>;
});
MemoUserMessage.displayName = 'MemoUserMessage';

export default function AIChatMessageList({
    messages,
    isLoading,
    tool1,
    tool2,
    streamPhase,
    retryLastMessage,
    copyToClipboard,
    copiedMessageId,
    avatarUrl,
    displayName,
    messagesContainerRef,
    messagesEndRef,
    onWorkflowStateUpdate,
    syncMessageId,
    onArtifactUpdate
}) {
    return (
        <div className={styles.messagesArea} style={{ display: messages.length === 0 ? 'none' : 'flex' }} ref={messagesContainerRef} aria-live="polite" aria-atomic="false">


            {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isLastMsg = idx === messages.length - 1;
                const isEmpty = msg.role === 'assistant' && !msg.content && isLoading && isLastMsg;

                const isArabic = msg.content && /[\u0600-\u06FF]/.test(msg.content);

                return (
                    <div
                        key={idx}
                        className={`${styles.messageWrapper} ${isUser ? styles.userWrapper : styles.aiWrapper}`}
                    >
                        {/* Avatar */}
                        <div className={styles.avatar}>
                            {isUser ? (
                                avatarUrl ? (
                                    <Image src={avatarUrl} alt={displayName} width={32} height={32} className={styles.avatarImg} />
                                ) : (
                                    <User size={16} />
                                )
                            ) : (
                                <Image src="/logo.png" alt="HUBly AI" width={32} height={32} className={styles.aiAvatarImg} />
                            )}
                        </div>

                        {/* Bubble */}
                        <div
                            className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.aiBubble}`}
                            dir={isArabic ? 'rtl' : 'ltr'}
                            style={{ textAlign: isArabic ? 'right' : 'left' }}
                        >
                            {isEmpty ? (
                                <TypingIndicator phase={streamPhase} />
                            ) : isUser ? (
                                <MemoUserMessage content={msg.content} />
                            ) : (
                                <>
                                    <MarkdownRenderer
                                        content={msg.content}
                                        isStreaming={isLoading && isLastMsg}
                                        onWorkflowStateUpdate={onWorkflowStateUpdate}
                                        messageId={msg.id}
                                        onArtifactUpdate={onArtifactUpdate}
                                    />
                                    {syncMessageId && msg.id && syncMessageId === msg.id && (
                                        <div className={styles.syncIndicator}>
                                            <Check size={12} strokeWidth={3} />
                                            <span>Your progress has been successfully synced with the AI</span>
                                        </div>
                                    )}
                                    {msg.content?.includes('[!WARNING]') && !isLoading && isLastMsg && (
                                        <Button
                                            variant="outline"
                                            size="small"
                                            icon={Zap}
                                            onClick={retryLastMessage}
                                            className={styles.retryButton}
                                        >
                                            Retry Request
                                        </Button>
                                    )}
                                    {!(isLoading && idx === messages.length - 1) && !msg.content?.includes('[!WARNING]') && (
                                        <button
                                            className={styles.copyButton}
                                            onClick={() => copyToClipboard(msg.content, msg.id || `${idx}-${Date.now()}`)}
                                            title="Copy message"
                                            aria-label="Copy message"
                                        >
                                            {copiedMessageId === (msg.id || idx) ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* Streaming glow indicator at the bottom */}
            {isLoading && (
                <div className={styles.streamingBar}>
                    <div className={styles.streamingPulse} />
                    <span>HUBly AI is responding...</span>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}
