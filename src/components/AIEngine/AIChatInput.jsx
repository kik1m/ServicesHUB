import React from 'react';
import { Send, Loader2, Sparkles, Zap, Settings } from 'lucide-react';
import { AI_ENGINE_CONSTANTS } from '../../constants/aiEngineConstants';
import styles from './AIChatInput.module.css';

export default function AIChatInput({ 
    input, 
    setInput, 
    sendMessage, 
    handleKeyDown, 
    isLoading, 
    textareaRef, 
    tool1, 
    tool2, 
    isPremium, 
    isLoadingAuth,
    user,
    globalMessageCount,
    ActiveModelIcon,
    getSelectedModelConfig,
    setIsModelModalOpen,
    setIsWorkspaceModalOpen,
    setIsUpgradeModalOpen,
    isCompareMode
}) {
    return (
        <form onSubmit={sendMessage} className={styles.inputArea}>
            <div className={styles.inputWrapper}>
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tool1 && tool2 ? AI_ENGINE_CONSTANTS.input.placeholderCompare : AI_ENGINE_CONSTANTS.input.placeholderDefault}
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
            <div className={styles.usageIndicator}>
                <div className={styles.premiumControls}>
                    {isLoadingAuth ? (
                        <span style={{ opacity: 0 }}>Loading...</span>
                    ) : isPremium ? (
                        <span><Sparkles size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#00d2ff' }} /> {AI_ENGINE_CONSTANTS.input.premiumUsage}</span>
                    ) : (
                        <span><Zap size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle', color: '#f59e0b' }} /> {globalMessageCount} / 10 {AI_ENGINE_CONSTANTS.input.freeUsage}</span>
                    )}
                    <div className={styles.premiumActions}>
                        <button type="button" onClick={() => setIsModelModalOpen(true)} className={styles.modelBtn}>
                            <ActiveModelIcon size={14} style={{ color: getSelectedModelConfig().color }} /> {getSelectedModelConfig().name}
                        </button>
                        {!isCompareMode && (
                            <button type="button" onClick={() => isPremium ? setIsWorkspaceModalOpen(true) : setIsUpgradeModalOpen(true)} className={styles.workspaceBtn}>
                                <Settings size={14} /> Workspace
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}
