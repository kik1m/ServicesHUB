import { useState, useEffect, useRef } from 'react';
import { MODELS, getModelById } from '../config/models.config';
import { cleanTextForCopy } from '../utils/markdownToPlainText';

/**
 * useWorkflowChatWidgetLogic
 * Custom hook encapsulating UI state and callbacks for the Workflow chat widget.
 */
export function useWorkflowChatWidgetLogic({ user, chatProps }) {
    const isPremium = user?.is_premium;

    // Premium Model Selection State
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(MODELS.GEMINI_FLASH.id);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

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

    // Scroll & Inputs Ref
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const textareaRef = useRef(null);
    const [copiedMessageId, setCopiedMessageId] = useState(null);
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
            const { scrollHeight } = messagesContainerRef.current;
            messagesContainerRef.current.scrollTo({ top: scrollHeight, behavior: 'smooth' });
        }
    };

    const forceScrollToBottom = () => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: 'smooth' });
            setShowScrollButton(false);
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatProps?.messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = '';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 150)}px`;
        }
    }, [chatProps?.input]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (chatProps?.input?.trim() && !chatProps?.isLoading) {
                if (textareaRef.current) textareaRef.current.style.height = '';
                chatProps.sendMessage(e);
            }
        }
    };

    const copyToClipboard = (text, id) => {
        if (!text) return;
        const cleanedText = cleanTextForCopy(text);
        navigator.clipboard.writeText(cleanedText);
        setCopiedMessageId(id);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    return {
        mounted,
        isPremium,
        modelProps: {
            selectedModel,
            handleModelSelect,
            getSelectedModelConfig,
            isModelModalOpen,
            setIsModelModalOpen,
            isUpgradeModalOpen,
            setIsUpgradeModalOpen,
            mounted
        },
        uiProps: {
            messagesEndRef,
            messagesContainerRef,
            textareaRef,
            copiedMessageId,
            showScrollButton,
            handleKeyDown,
            copyToClipboard,
            forceScrollToBottom
        }
    };
}
