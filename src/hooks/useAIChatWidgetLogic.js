import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useAIChat } from './useAIChat';
import { MODELS, getModelById } from '../config/models.config';
import { cleanTextForCopy } from '../utils/markdownToPlainText';
import { useWorkspace } from './useWorkspace';

export function useAIChatWidgetLogic({ 
    tool1, 
    tool2, 
    onSessionCreated, 
    onSessionTitleGenerated, 
    initialSessionId, 
    initialMessages, 
    aiSettings,
    isCompareMode,
    workspaceProps
}) {
    const { user, loading } = useAuth();
    // user.is_premium is undefined until the profile is fetched from the DB.
    // If it's undefined but the user is logged in, we are still loading the premium state.
    const isProfileStillLoading = user && user.is_premium === undefined;
    const isPremium = user?.is_premium;

    // Premium Model Selection State
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
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

    // Core Chat State (will be cleaned up next)
    const chatProps = useAIChat(tool1, tool2, user, onSessionCreated, initialSessionId, initialMessages, onSessionTitleGenerated, aiSettings, workspaceProps.workspaceContext, selectedModel, isCompareMode);
    
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

    // Install debug scrubber for client-side logs
    useEffect(() => {
        const originalLog = console.log;
        const originalWarn = console.warn;
        const originalError = console.error;

        console.log = (...args) => originalLog(...args.map(a => typeof a === 'string' ? a.replace(/(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/g, '[REDACTED_JWT]').replace(/"workspaceContext":\s*"[^"]+"/g, '"workspaceContext": "[REDACTED]"') : a));
        console.warn = (...args) => originalWarn(...args.map(a => typeof a === 'string' ? a.replace(/(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/g, '[REDACTED_JWT]').replace(/"workspaceContext":\s*"[^"]+"/g, '"workspaceContext": "[REDACTED]"') : a));
        console.error = (...args) => originalError(...args.map(a => typeof a === 'string' ? a.replace(/(eyJ[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,}\.[a-zA-Z0-9_-]{5,})/g, '[REDACTED_JWT]').replace(/"workspaceContext":\s*"[^"]+"/g, '"workspaceContext": "[REDACTED]"') : a));

        return () => {
            console.log = originalLog;
            console.warn = originalWarn;
            console.error = originalError;
        };
    }, []);

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

    const copyToClipboard = (text, id) => {
        if (!text) return;
        const cleanedText = cleanTextForCopy(text);
        navigator.clipboard.writeText(cleanedText);
        setCopiedMessageId(id);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const prevMessagesLength = useRef(0);
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleScroll = () => {
        if (!messagesContainerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 150);
    };

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

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

    const forceScrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
            setShowScrollButton(false);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }, [input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim() && !isLoading) {
                if (textareaRef.current) textareaRef.current.style.height = '';
                sendMessage(e);
            }
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages]);

    return {
        user,
        isPremium,
        isLoadingAuth: loading || isProfileStillLoading,
        isProfileStillLoading,
        chatProps,
        workspaceProps,
        mounted,
        modelProps: {
            selectedModel, handleModelSelect, getSelectedModelConfig,
            isModelModalOpen, setIsModelModalOpen,
            isUpgradeModalOpen, setIsUpgradeModalOpen,
            mounted
        },
        uiProps: {
            messagesEndRef, messagesContainerRef, textareaRef,
            copiedMessageId, copyToClipboard,
            countdown, handleKeyDown,
            showScrollButton, forceScrollToBottom,
            avatarUrl: user?.user_metadata?.avatar_url || user?.avatar_url,
            displayName: user?.user_metadata?.full_name || user?.full_name || 'You'
        }
    };
}
