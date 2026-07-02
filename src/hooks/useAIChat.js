import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useQuota } from './useQuota';
import { useChatSuggestions } from './useChatSuggestions';
import { useCompareTransfer } from './useCompareTransfer';
import { parseAIStream } from '../utils/aiStreamParser';

/**
 * 🚀 Elite AI Chat Stream Engine
 * Follows Rule #11 (Separation of Concerns) and encapsulates the complex SSE streaming logic.
 */
export const useAIChat = (tool1, tool2, user, onSessionCreated, initialSessionId = null, initialMessages = null, onSessionTitleGenerated = null, aiSettings = { tone: 'default', language: 'auto' }, workspaceContext = null, selectedModel = 'auto', isCompareMode = false) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(initialSessionId);
    const [streamPhase, setStreamPhase] = useState('idle'); // idle, thinking, typing, searching, reasoning
    const internallyCreatedSessionId = useRef(null);

    // 1. Quota Logic
    const { isLimitReached, isGuestLimitReached, globalMessageCount, limitResetTime, incrementCount, handleLimitError, isGuest, isPremium } = useQuota(user);

    // 2. Suggestions Logic
    const { suggestions, setSuggestions, isGeneratingSuggestions } = useChatSuggestions(tool1, tool2, workspaceContext, initialSessionId, isCompareMode, messages.length);

    // 1. Handle Session Navigation / Switching
    useEffect(() => {
        setSessionId(initialSessionId);

        if (!initialSessionId) {
            // "New Chat": clear messages only. DO NOT clear suggestions here —
            // useChatSuggestions runs before this effect (React hook call order)
            // and will have already loaded them. Clearing here would wipe them out.
            setMessages([]);
            internallyCreatedSessionId.current = null;
        } else if (initialSessionId !== internallyCreatedSessionId.current) {
            // Switched to an existing session: clear both messages and suggestions
            setMessages([]);
            setSuggestions([]);
        }
    }, [initialSessionId, setSuggestions]);


    // 2. Load Historical Messages Asynchronously
    useEffect(() => {
        // Never load historical messages into a new/empty chat
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
            // Explicitly loaded empty history for an existing session
            setMessages([]);
        }
    }, [initialMessages, initialSessionId]);


    // 3. Compare Transfer Logic
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
        const currentInput = textToSend; // Capture input for the title generation

        const userMessage = { role: 'user', content: textToSend, id: Date.now() + Math.random(), timestamp: Date.now() };
        const newMessages = [...baseMessages, userMessage];
        
        const placeholderId = Date.now() + 1 + Math.random();
        const aiPlaceholder = { role: 'assistant', content: '', id: placeholderId, timestamp: Date.now() };

        setMessages([...newMessages, aiPlaceholder]);
        if (!directText) setInput('');
        setIsLoading(true);
        setStreamPhase('thinking'); // Initial phase

        const abortController = new AbortController();
        let chunkTimeoutId = setTimeout(() => abortController.abort('TIMEOUT'), 180000);
        let hasError = false; // Track if this request failed

        const resetChunkTimeout = () => {
            clearTimeout(chunkTimeoutId);
            chunkTimeoutId = setTimeout(() => abortController.abort('TIMEOUT'), 180000);
        };

        try {
            // ✅ SECURITY: Get JWT from supabase session, send in header — never trust client-sent userId
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch('/api/v1/engine/chat', {
                method: 'POST',
                headers,
                signal: abortController.signal,
                body: JSON.stringify({
                    messages: newMessages,
                    tool1Context: tool1,
                    tool2Context: tool2,
                    sessionId: sessionId,
                    aiSettings: aiSettings,
                    workspaceContext,
                    selectedModel
                })
            });

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({ details: 'Unknown error' }));

                // Handle Quota Limit gracefully without throwing exceptions
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
                    resetChunkTimeout(); // Reset timer on every chunk received
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
        
        // Remove all error messages and the last user message from the context
        const filteredMessages = messages.filter(m => m.id !== lastUserMsg.id && !(m.role === 'assistant' && m.content?.includes('[!WARNING]')));
        
        // Clear the input and send immediately with the clean history
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
        isGeneratingSuggestions
    };
};
