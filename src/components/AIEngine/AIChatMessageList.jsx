import React, { memo } from 'react';
import Image from 'next/image';
import { User, Zap, Check, Copy } from 'lucide-react';
import VersusCard from './VersusCard';
import TypingIndicator from './TypingIndicator';
import MarkdownRenderer from './MarkdownRenderer';
import Button from '../ui/Button';
import styles from './AIChatMessageList.module.css';

const MemoUserMessage = memo(({ content }) => (
    <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
));
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
    messagesEndRef
}) {
    return (
        <div className={styles.messagesArea} style={{ display: messages.length === 0 ? 'none' : 'flex' }} ref={messagesContainerRef}>
            {/* Centered Versus Card Header */}
            {messages.length > 0 && tool1?.name && tool2?.name && (
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                    <VersusCard tool1={tool1} tool2={tool2} />
                </div>
            )}
            
            {messages.map((msg, idx) => {
                const isUser = msg.role === 'user';
                const isLastMsg = idx === messages.length - 1;
                const isEmpty = msg.role === 'assistant' && !msg.content && isLoading && isLastMsg;

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
                        <div className={`${styles.messageBubble} ${isUser ? styles.userBubble : styles.aiBubble}`}>
                            {isEmpty ? (
                                <TypingIndicator phase={streamPhase} />
                            ) : isUser ? (
                                <MemoUserMessage content={msg.content} />
                            ) : (
                                <>
                                    <MarkdownRenderer content={msg.content} />
                                    {msg.content?.startsWith('[WARN]') && !isLoading && isLastMsg && (
                                        <Button 
                                            variant="outline" 
                                            size="small" 
                                            icon={Zap} 
                                            onClick={retryLastMessage}
                                            style={{ marginTop: '10px' }}
                                        >
                                            Retry Request
                                        </Button>
                                    )}
                                    {!(isLoading && idx === messages.length - 1) && !msg.content?.startsWith('[WARN]') && (
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
