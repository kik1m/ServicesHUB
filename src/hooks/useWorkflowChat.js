import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useQuota } from './useQuota';
import { useChatSuggestions } from './useChatSuggestions';
import { useCompareTransfer } from './useCompareTransfer';
import { parseAIStream } from '../utils/aiStreamParser';

/**
 * 🚀 Premium Workflow Mode Chat Hook
 * Preserves stable chat logic while adding bidirectional state syncing for interactive visual components.
 */
export const useWorkflowChat = (tool1, tool2, user, onSessionCreated, initialSessionId = null, initialMessages = null, onSessionTitleGenerated = null, aiSettings = { tone: 'default', language: 'auto' }, workspaceContext = null, selectedModel = 'auto', isCompareMode = false) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(initialSessionId);
    const [streamPhase, setStreamPhase] = useState('idle');
    const internallyCreatedSessionId = useRef(null);

    // 🧠 Workflow State Ref — captures clicks and inputs from inside the interactive iframes
    const workflowStateRef = useRef(null);
    const [syncMessageId, setSyncMessageId] = useState(null); // Displays a visual confirmation pill in the bubble

    const onWorkflowStateUpdate = (state, messageId) => {
        console.log('[Workflow State Sync] Received update:', state);
        workflowStateRef.current = state;
        setSyncMessageId(messageId);
        // Reset confirmation pill after 3s
        setTimeout(() => setSyncMessageId(null), 3000);
    };

    // 1. Quota Logic
    const { isLimitReached, isGuestLimitReached, globalMessageCount, limitResetTime, incrementCount, handleLimitError } = useQuota(user);

    // 2. Suggestions Logic
    const { suggestions, setSuggestions, isGeneratingSuggestions } = useChatSuggestions(tool1, tool2, workspaceContext, initialSessionId, isCompareMode, messages.length);

    // Handle Session Navigation / Switching
    useEffect(() => {
        setSessionId(initialSessionId);
        if (!initialSessionId) {
            setMessages([]);
            internallyCreatedSessionId.current = null;
            workflowStateRef.current = null;
        } else if (initialSessionId !== internallyCreatedSessionId.current) {
            setMessages([]);
            setSuggestions([]);
            workflowStateRef.current = null;
        }
    }, [initialSessionId, setSuggestions]);

    // Load Historical Messages Asynchronously
    useEffect(() => {
        if (!initialSessionId) return;

        if (initialMessages && initialMessages.length > 0) {
            const formatted = initialMessages.map(msg => ({
                id: msg.id || `${Date.now()}-${Math.random()}`,
                role: msg.role,
                content: msg.content,
                timestamp: msg.created_at ? new Date(msg.created_at).getTime() : Date.now()
            }));
            setMessages(formatted);
        } else if (initialMessages !== null && initialMessages.length === 0) {
            setMessages([]);
        }
    }, [initialMessages, initialSessionId]);

    // Compare Transfer Logic
    const { initiateTransfer } = useCompareTransfer(initialSessionId, (e, txt, msgs) => sendMessage(e, txt, msgs));

    const sendMessage = async (e, directText = null, overrideMessages = null) => {
        if (e && e.preventDefault) e.preventDefault();
        const textToSend = directText || input;
        
        const baseMessages = overrideMessages || messages;
        const userMessagesCount = baseMessages.filter(m => m.role === 'user').length;
        
        if (isCompareMode && userMessagesCount >= 2) {
            initiateTransfer(sessionId, textToSend, tool1, tool2);
            if (!directText) setInput('');
            return;
        }

        if (isGuestLimitReached) return;
        if (!textToSend.trim() || isLoading || isLimitReached) return;
        
        incrementCount();

        const isFirstUserMessage = baseMessages.filter(m => m.role === 'user').length === 0;
        const currentInput = textToSend;

        const userMessage = { role: 'user', content: textToSend, id: Date.now() + Math.random(), timestamp: Date.now() };
        const newMessages = [...baseMessages, userMessage];
        
        const placeholderId = Date.now() + 1 + Math.random();
        const aiPlaceholder = { role: 'assistant', content: '', id: placeholderId, timestamp: Date.now() };

        setMessages([...newMessages, aiPlaceholder]);
        if (!directText) setInput('');
        setIsLoading(true);
        setStreamPhase('thinking');

        const abortController = new AbortController();
        let chunkTimeoutId = setTimeout(() => abortController.abort('TIMEOUT'), 180000);
        let hasError = false;

        const resetChunkTimeout = () => {
            clearTimeout(chunkTimeoutId);
            chunkTimeoutId = setTimeout(() => abortController.abort('TIMEOUT'), 180000);
        };

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            // Generate payload with current interactive state context
            const payload = {
                messages: newMessages,
                tool1Context: tool1,
                tool2Context: tool2,
                sessionId: sessionId,
                aiSettings: aiSettings,
                workspaceContext,
                selectedModel,
                mode: 'workflow' // Force Workflow Mode in the backend
            };

            // Inject the synced state if available to guide AI behavior
            if (workflowStateRef.current) {
                payload.activeWorkflowState = workflowStateRef.current;
            }

            const response = await fetch('/api/v1/engine/chat', {
                method: 'POST',
                headers,
                signal: abortController.signal,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({ details: 'Unknown error' }));
                if (response.status === 403 || errBody.error?.includes('LIMIT')) {
                    handleLimitError(errBody.resetTime);
                    setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '✨ ' + (errBody.message || 'You have reached your free AI limit. Please upgrade to Premium.') } : m));
                    setIsLoading(false);
                    setStreamPhase('idle');
                    return;
                }
                throw new Error(errBody.details || errBody.error || `HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const { hasError: streamHasError } = await parseAIStream(reader, {
                onSessionId: (id) => {
                    setSessionId(id);
                    internallyCreatedSessionId.current = id;
                    if (onSessionCreated) onSessionCreated(id);
                },
                onTitleGenerationTrigger: (id) => {
                    if (isFirstUserMessage) {
                        const titleHeaders = { 'Content-Type': 'application/json' };
                        if (session?.access_token) {
                            titleHeaders['Authorization'] = `Bearer ${session.access_token}`;
                        }
                        fetch('/api/v1/engine/chat/title', {
                            method: 'POST',
                            headers: titleHeaders,
                            body: JSON.stringify({ sessionId: id, userMessage: currentInput })
                        })
                            .then(res => res.json())
                            .then(json => {
                                if (json.title && onSessionTitleGenerated) {
                                    onSessionTitleGenerated(id, json.title);
                                }
                            })
                            .catch(err => console.error('Failed to trigger title generation:', err));
                    }
                },
                onChunk: (accumulatedText) => {
                    resetChunkTimeout();
                    setMessages(prev => prev.map(m =>
                        m.id === placeholderId
                            ? { ...m, content: (m.content + accumulatedText).replace(/\[ALL_DONE\]/g, '') }
                            : m
                    ));
                },
                onToolCall: (toolName) => setStreamPhase(`Executing: ${toolName}`),
                onToolStatus: (toolName) => setStreamPhase(toolName === 'search_external_market' ? 'searching' : 'thinking'),
                onStatus: (phase) => setStreamPhase(phase || 'thinking'),
                onError: (errMsg) => {
                    setMessages(prev => prev.map(m => {
                        if (m.id !== placeholderId) return m;
                        let cleanContent = m.content.replace(/\[[A-Z_]+[^\]]*$/, '');
                        return { ...m, content: cleanContent + '\n\n[/REASONING]\n\n[!WARNING]\n' + errMsg };
                    }));
                }
            });

            hasError = streamHasError;

        } catch (error) {
            hasError = true;
            console.error('Chat error:', error);
            let displayError = 'Sorry, there was an error connecting to the AI Engine. Please try again later.';
            if (error === 'TIMEOUT' || error?.name === 'AbortError') {
                displayError = 'The AI Engine is taking too long to respond due to high server load. Please try again.';
            }
            setMessages(prev => prev.map(m => {
                if (m.id !== placeholderId) return m;
                let cleanContent = m.content.replace(/\[[A-Z_]+[^\]]*$/, '');
                return { ...m, content: cleanContent + '\n\n[/REASONING]\n\n[!WARNING]\n' + displayError };
            }));
        } finally {
            clearTimeout(chunkTimeoutId);
            setIsLoading(false);
            setStreamPhase('idle');
        }
    };

    const retryLastMessage = () => {
        const lastUserMsg = messages.slice().reverse().find(m => m.role === 'user');
        if (!lastUserMsg) return;
        const filteredMessages = messages.filter(m => m.id !== lastUserMsg.id && !(m.role === 'assistant' && m.content?.includes('[!WARNING]')));
        sendMessage(null, lastUserMsg.content, filteredMessages);
    };

    return {
        messages,
        input,
        setInput,
        isLoading,
        sendMessage,
        retryLastMessage,
        streamPhase,
        isLimitReached,
        isGuestLimitReached,
        globalMessageCount,
        limitResetTime,
        suggestions,
        isGeneratingSuggestions,
        onWorkflowStateUpdate,
        syncMessageId
    };
};
