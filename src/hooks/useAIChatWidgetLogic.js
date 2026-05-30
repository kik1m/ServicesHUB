import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAIChat } from './useAIChat';
import { supabase } from '../lib/supabaseClient';
import { MODELS, getModelById } from '../config/models.config';

export function useAIChatWidgetLogic({ 
    tool1, 
    tool2, 
    onSessionCreated, 
    onSessionTitleGenerated, 
    initialSessionId, 
    initialMessages, 
    aiSettings,
    isCompareMode
}) {
    const { user, loading } = useAuth();
    const isPremium = user?.is_premium;

    // Premium Workspace State
    const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
    const [workspaceStep, setWorkspaceStep] = useState(1);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [workspaceContext, setWorkspaceContext] = useState(user?.workspace_context || { idea: '', goal: '', rules: '' });
    const [selectedModel, setSelectedModel] = useState(MODELS.GEMINI_FLASH.id);

    const handleModelSelect = (value) => {
        const modelConfig = getModelById(value);
        if (!isPremium && modelConfig.isPremium) {
            setIsModelModalOpen(false);
            setIsUpgradeModalOpen(true);
            return;
        }
        setSelectedModel(value);
        setIsModelModalOpen(false);
    };

    const getSelectedModelConfig = () => getModelById(selectedModel);

    const chatProps = useAIChat(tool1, tool2, user, onSessionCreated, initialSessionId, initialMessages, onSessionTitleGenerated, aiSettings, workspaceContext, selectedModel, isCompareMode);
    
    const { messages, input, setInput, sendMessage, isLoading, isLimitReached, limitResetTime } = chatProps;

    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
    const [countdown, setCountdown] = useState('');

    const prevSessionId = useRef(initialSessionId);
    useEffect(() => {
        if (initialSessionId !== prevSessionId.current) {
            setSelectedModel(MODELS.GEMINI_FLASH.id);
            prevSessionId.current = initialSessionId;
        }
    }, [initialSessionId]);

    // Save Workspace Context
    useEffect(() => {
        if (!user?.id || !workspaceContext.idea) return;
        const timer = setTimeout(() => {
            supabase.from('profiles')
                .update({ workspace_context: workspaceContext })
                .eq('id', user.id).then();
        }, 1000);
        return () => clearTimeout(timer);
    }, [workspaceContext, user?.id]);

    // Limit Countdown
    useEffect(() => {
        if (!isLimitReached || !limitResetTime) return;

        const updateCountdown = () => {
            const target = new Date(limitResetTime).getTime();
            const now = Date.now();
            const diff = target - now;

            if (diff <= 0) {
                setCountdown('Refreshing now...');
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            setCountdown(`${h}h ${m}m`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 60000);
        return () => clearInterval(interval);
    }, [isLimitReached, limitResetTime]);

    // Clipboard Formatter
    const cleanTextForCopy = (rawText) => {
        if (!rawText) return '';
        let clean = rawText;
        clean = clean.replace(/\[check\]/gi, '✅').replace(/\[warn\]/gi, '⚠️').replace(/\[info\]/gi, 'ℹ️')
            .replace(/\[insight\]/gi, '💡').replace(/\[metrics\]/gi, '📊').replace(/\[architecture\]/gi, '🏗️')
            .replace(/\[action\]/gi, '🛠️');
        clean = clean.replace(/\[REASONING\]([\s\S]*?)\[\/REASONING\]/gi, (m, p1) => `🧠 AI Thought Process:\n${p1.trim()}\n\n---\n`);
        clean = clean.replace(/\[step(\d+)\]/gi, '$1.');
        clean = clean.replace(/\[\s*TOOL_CARD\s*:\s*(.+?)\s*\]/gi, (m, p1) => {
            const slug = p1.trim().replace(/^["'{[\]]+|["'}\]]+$/g, '').split('||')[0].trim();
            return `🚀 Tool: ${slug} (https://hubly.com/tool/${slug})`;
        });
        clean = clean.replace(/\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.+?)\s*\]/gi, (m, p1) => {
            let [name, url, desc] = p1.trim().split('||').map(s => s.trim().replace(/^["'{\[]+|["'}\]]+$/g, ''));
            return `🌐 ${name || 'External Link'}: ${url || '#'} ${desc ? `- ${desc}` : ''}`;
        });
        return clean;
    };

    const copyToClipboard = (text, id) => {
        if (!text) return;
        const cleanedText = cleanTextForCopy(text);
        navigator.clipboard.writeText(cleanedText);
        setCopiedMessageId(id);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const prevMessagesLength = useRef(0);

    const scrollToBottom = () => {
        if (messagesContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
            const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
            
            if (isNearBottom || messages.length > prevMessagesLength.current) {
                messagesContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
            }
        }
        prevMessagesLength.current = messages.length;
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
                sendMessage(e);
            }
        }
    };

    useEffect(() => { scrollToBottom(); }, [messages]);

    return {
        user,
        isPremium,
        isLoadingAuth: loading,
        chatProps,
        workspaceProps: {
            isWorkspaceModalOpen, setIsWorkspaceModalOpen,
            workspaceStep, setWorkspaceStep,
            workspaceContext, setWorkspaceContext
        },
        modelProps: {
            selectedModel, handleModelSelect, getSelectedModelConfig,
            isModelModalOpen, setIsModelModalOpen,
            isUpgradeModalOpen, setIsUpgradeModalOpen
        },
        uiProps: {
            messagesEndRef, messagesContainerRef, textareaRef,
            copiedMessageId, copyToClipboard,
            countdown, handleKeyDown,
            avatarUrl: user?.user_metadata?.avatar_url || user?.avatar_url,
            displayName: user?.user_metadata?.full_name || user?.full_name || 'You'
        }
    };
}
