import React from 'react';
import { Send, Loader2, Sparkles, Zap, Settings } from 'lucide-react';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './WorkflowChatInput.module.css';

export default function WorkflowChatInput({ 
    input, 
    setInput, 
    sendMessage, 
    handleKeyDown, 
    isLoading, 
    textareaRef, 
    isPremium, 
    isLoadingAuth,
    user,
    globalMessageCount,
    ActiveModelIcon,
    getSelectedModelConfig,
    setIsModelModalOpen,
    setIsWorkspaceModalOpen,
    setIsUpgradeModalOpen
}) {
    return (
        <form onSubmit={sendMessage} className={styles.inputArea}>
            <svg width="0" height="0" className={styles.hiddenSvg}>
                <defs>
                    <linearGradient id="workflowModelIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00d2ff" />
                        <stop offset="100%" stopColor="#3a7bd5" />
                    </linearGradient>
                </defs>
            </svg>
            <div className={styles.inputWrapper}>
                <button 
                    type="button" 
                    onClick={() => setIsModelModalOpen(true)} 
                    className={styles.inlineModelBtn}
                    title={`Model: ${getSelectedModelConfig().name}`}
                >
                    <ActiveModelIcon size={18} stroke="url(#workflowModelIconGradient)" />
                </button>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={AI_ENGINE_CONSTANTS.input.placeholderDefault}
                    disabled={isLoading}
                    className={styles.inputField}
                    rows={1}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={styles.sendButton}
                >
                    {isLoading
                         ? <Loader2 className={styles.spinner} size={18} />
                         : <Send size={18} />
                    }
                </button>
            </div>
            {(!isPremium || isLoadingAuth) && (
                <div className={styles.usageIndicator}>
                    <div className={styles.premiumControls}>
                        {isLoadingAuth ? (
                            <span className={styles.loadingText}>Loading...</span>
                        ) : user ? (
                            <span className={globalMessageCount >= 8 ? styles.limitTextApproaching : styles.limitTextNormal}>
                                <Zap size={12} className={`${styles.limitIcon} ${globalMessageCount >= 8 ? styles.limitIconApproaching : styles.limitIconNormal}`} /> 
                                {globalMessageCount} / 10 {AI_ENGINE_CONSTANTS.input.freeUsage}
                                {globalMessageCount >= 8 && " (Approaching Limit)"}
                            </span>
                        ) : (
                            <span className={globalMessageCount >= 2 ? styles.limitTextApproaching : styles.limitTextNormal}>
                                <Zap size={12} className={`${styles.limitIcon} ${globalMessageCount >= 2 ? styles.limitIconApproaching : styles.limitIconNormal}`} /> 
                                {globalMessageCount} / 3 Guest Messages
                                {globalMessageCount >= 2 && " (Approaching Limit)"}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </form>
    );
}
