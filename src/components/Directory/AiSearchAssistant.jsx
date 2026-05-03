import React, { useState } from 'react';
import { Search as SearchIcon, Sparkles, Send, Loader2 } from 'lucide-react';
import styles from './AiSearchAssistant.module.css';

/** Converts **bold** markdown in AI messages to <strong> elements */
const parseMessage = (text) => {
    if (!text) return null;
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
    );
};

/**
 * 🚀 Elite Unified Search Bar
 * Replaces both standard input and floating AI assistant with a single, sleek component.
 */
const AiSearchAssistant = ({ standardQuery, setStandardQuery, onProcess, onReset, message, isThinking }) => {
    const [isAiMode, setIsAiMode] = useState(false);
    const [localAiQuery, setLocalAiQuery] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAiMode || !localAiQuery.trim() || isThinking) return;
        await onProcess(localAiQuery);
    };

    return (
        <div className={styles.unifiedContainer}>
            {/* Mode Toggle */}
            <div className={styles.toggleContainer}>
                <button 
                    type="button"
                    className={`${styles.toggleBtn} ${!isAiMode ? styles.activeStandard : ''}`}
                    onClick={() => setIsAiMode(false)}
                >
                    <SearchIcon size={14} />
                    Standard Search
                </button>
                <button 
                    type="button"
                    className={`${styles.toggleBtn} ${isAiMode ? styles.activeAi : ''}`}
                    onClick={() => setIsAiMode(true)}
                >
                    <Sparkles size={14} />
                    AI Assistant
                </button>
            </div>

            {/* Unified Input Form */}
            <form onSubmit={handleSubmit} className={`${styles.searchForm} ${isAiMode ? styles.aiActive : ''}`}>
                <div className={styles.inputWrapper}>
                    {isAiMode ? (
                        <Sparkles size={20} className={styles.aiIcon} />
                    ) : (
                        <SearchIcon size={20} className={styles.standardIcon} />
                    )}
                    
                    <input 
                        type="text"
                        placeholder={isAiMode ? "Describe what you need (e.g., 'find me a free SEO tool')" : "Search tools, tags, or technology..."}
                        value={isAiMode ? localAiQuery : standardQuery}
                        onChange={(e) => isAiMode ? setLocalAiQuery(e.target.value) : setStandardQuery(e.target.value)}
                        disabled={isThinking}
                    />
                    
                    {isAiMode && (
                        <button type="submit" className={styles.submitBtn} disabled={!localAiQuery.trim() || isThinking}>
                            {isThinking ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
                        </button>
                    )}
                </div>
            </form>

            {/* AI Status & Results Message */}
            {isAiMode && isThinking && (
                <div className={styles.statusMessage}>
                    <div className={styles.typingIndicator}>
                        <span></span><span></span><span></span>
                    </div>
                    <span>Scanning our universe...</span>
                </div>
            )}

            {isAiMode && !isThinking && message && (
                    <div className={`${styles.aiMessageBubble} ${message.includes('Limit Reached') || message.includes('used your 3') ? styles.errorBubble : ''}`}>
                        <Sparkles size={16} />
                        <div className={styles.aiMessageContent}>
                            <span>{parseMessage(message)}</span>
                            <button 
                                type="button"
                                className={styles.resetBtn}
                                onClick={() => {
                                    setLocalAiQuery('');
                                    if (onReset) onReset();
                                }}
                            >
                                ✕ Clear & Show All
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default React.memo(AiSearchAssistant);
