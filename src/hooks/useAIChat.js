import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

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
    const [globalMessageCount, setGlobalMessageCount] = useState(0);
    const [limitResetTime, setLimitResetTime] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    const isGeneratingSuggestionsRef = useRef(false);
    const internallyCreatedSessionId = useRef(null);

    const subscriptionTier = user?.subscription_tier || (user?.is_premium ? 'pro' : 'free');
    const isPremium = subscriptionTier === 'pro' || subscriptionTier === 'elite';
    const isGuest = !user;
    const [guestMessageCount, setGuestMessageCount] = useState(0);
    const [isGuestLimitReached, setIsGuestLimitReached] = useState(false);
    
    let quotaLimit = 10;
    if (subscriptionTier === 'elite') quotaLimit = 500;
    else if (subscriptionTier === 'pro') quotaLimit = 120;

    const isLimitReached = (globalMessageCount >= quotaLimit) || (isGuest && guestMessageCount >= 3);

    // Sync state when loading a different session
    useEffect(() => {
        setSessionId(initialSessionId);

        if (initialMessages && initialMessages.length > 0) {
            // Map DB format to UI format if needed
            const formatted = initialMessages.map(msg => ({
                id: msg.id || `${Date.now()}-${Math.random()}`,
                role: msg.role,
                content: msg.content
            }));
            setMessages(formatted);
        } else if (initialSessionId !== internallyCreatedSessionId.current || !initialSessionId) {
            // Clear messages if we switch to a new empty session OR to "New Chat" (null)
            setMessages([]);
            setSuggestions([]); // Clear previous suggestions so they can be regenerated
            if (!initialSessionId) internallyCreatedSessionId.current = null;
        }
    }, [initialSessionId, initialMessages]);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (isCompareMode) return; // Save API Quota in compare mode
            if (initialSessionId || messages.length > 0 || isGeneratingSuggestionsRef.current || suggestions.length > 0) return;

            const cacheKey = `hubly_ai_suggestions_${tool1?.slug || ''}_${tool2?.slug || ''}_${workspaceContext?.idea || 'default'}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed && parsed.length > 0) {
                        setSuggestions(parsed);
                        return;
                    }
                } catch (e) {
                    sessionStorage.removeItem(cacheKey);
                }
            }

            setIsGeneratingSuggestions(true);
            isGeneratingSuggestionsRef.current = true;
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const headers = { 'Content-Type': 'application/json' };
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                }
                const response = await fetch('/api/v1/engine/chat', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({
                        action: 'generate_suggestions',
                        tool1Context: tool1,
                        tool2Context: tool2,
                        workspaceContext
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    const fetchedSuggestions = data.suggestions || ["What's the best tool for me?", "Help me build a project", "Compare top tools"];
                    setSuggestions(fetchedSuggestions);
                    if (fetchedSuggestions.length > 0) {
                        sessionStorage.setItem(cacheKey, JSON.stringify(fetchedSuggestions));
                    }
                } else {
                    // Fallback if API fails (e.g., rate limit)
                    setSuggestions(["What's the best tool for me?", "Help me build a project", "Compare top tools"]);
                }
            } catch (e) {
                console.error('Failed to fetch suggestions', e);
                setSuggestions(["What's the best tool for me?", "Help me build a project", "Compare top tools"]);
            } finally {
                setIsGeneratingSuggestions(false);
                isGeneratingSuggestionsRef.current = false;
            }
        };
        fetchSuggestions();
    }, [initialSessionId, tool1, tool2, workspaceContext, messages.length]); // Added messages.length so it triggers when chat clears

    // --- Transfer from Compare Mode ---
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const transferPayloadStr = sessionStorage.getItem('hubly_pending_ai_transfer');
        const urlParams = new URLSearchParams(window.location.search);
        
        if (transferPayloadStr && urlParams.get('transfer') === 'true') {
            try {
                const payload = JSON.parse(transferPayloadStr);
                sessionStorage.removeItem('hubly_pending_ai_transfer');
                
                setMessages(payload.messages || []);
                
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.delete('transfer');
                window.history.replaceState({}, '', newUrl);

                if (payload.pendingInput) {
                    setTimeout(() => {
                        sendMessage(null, payload.pendingInput, payload.messages);
                    }, 500);
                }
            } catch (e) {
                console.error('Failed to parse transfer payload', e);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch the true global limit from the database on mount
    useEffect(() => {
        if (isGuest) {
            const count = parseInt(localStorage.getItem('hubly_guest_count') || '0', 10);
            setGuestMessageCount(count);
            if (count >= 3) setIsGuestLimitReached(true);
            return;
        } else {
            setIsGuestLimitReached(false);
        }

        if (user && user.id) {
            const fetchLimit = async () => {
                const { data } = await supabase.from('profiles').select('ai_messages_today, ai_last_reset_date').eq('id', user.id).single();
                if (data) {
                    let resetDateStr = data.ai_last_reset_date;
                    let msgs = data.ai_messages_today || 0;

                    if (resetDateStr) {
                        if (resetDateStr.length === 10) {
                            msgs = 0; // Legacy format
                        } else {
                            const resetTime = new Date(resetDateStr).getTime();
                            if (Date.now() >= resetTime) {
                                msgs = 0;
                            } else if (msgs >= quotaLimit) {
                                setLimitResetTime(resetDateStr);
                            }
                        }
                    }
                    setGlobalMessageCount(msgs);
                }
            };
            fetchLimit();
        }
    }, [user, isPremium, isGuest, quotaLimit]);

    const sendMessage = async (e, directText = null, overrideMessages = null) => {
        if (e && e.preventDefault) e.preventDefault();
        const textToSend = directText || input;
        
        const baseMessages = overrideMessages || messages;
        const userMessagesCount = baseMessages.filter(m => m.role === 'user').length;
        
        if (isCompareMode && userMessagesCount >= 2) {
            // Intercept and transfer to full AI Studio
            const transferPayload = {
                messages: baseMessages,
                pendingInput: textToSend,
                tool1Slug: tool1?.slug,
                tool2Slug: tool2?.slug
            };
            sessionStorage.setItem('hubly_pending_ai_transfer', JSON.stringify(transferPayload));
            
            // Open full AI studio in a new tab
            window.open(`/ai-engine?t1=${tool1?.slug || ''}&t2=${tool2?.slug || ''}&transfer=true`, '_blank');
            if (!directText) setInput('');
            return;
        }

        if (isGuest && guestMessageCount >= 3) {
            setIsGuestLimitReached(true);
            return;
        }
        if (!textToSend.trim() || isLoading || isLimitReached) return;
        
        if (isGuest) {
            const newCount = guestMessageCount + 1;
            setGuestMessageCount(newCount);
            localStorage.setItem('hubly_guest_count', newCount.toString());
            if (newCount >= 3) setIsGuestLimitReached(true);
        }

        const isFirstUserMessage = baseMessages.filter(m => m.role === 'user').length === 0;
        const currentInput = textToSend; // Capture input for the title generation

        const userMessage = { role: 'user', content: textToSend, id: Date.now() + Math.random() };
        const newMessages = [...baseMessages, userMessage];
        
        const placeholderId = Date.now() + 1 + Math.random();
        const aiPlaceholder = { role: 'assistant', content: '', id: placeholderId };

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

            // Client-Side Context Windowing: Send only the last 15 messages to save tokens and avoid server-side summarization
            let messagesToSend = newMessages;
            if (newMessages.length > 15) {
                messagesToSend = newMessages.slice(-15);
            }

            const response = await fetch('/api/v1/engine/chat', {
                method: 'POST',
                headers,
                signal: abortController.signal,
                body: JSON.stringify({
                    messages: messagesToSend,
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
                    if (errBody.resetTime) setLimitResetTime(errBody.resetTime);
                    setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '✨ ' + (errBody.message || 'You have reached your free AI limit. Please upgrade to Premium.') } : m));
                    setIsLoading(false);
                    setStreamPhase('idle');
                    return;
                }

                throw new Error(errBody.details || errBody.error || `HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let streamFinishedCleanly = false;

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    if (!streamFinishedCleanly && !hasError) {
                        hasError = true;
                        setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '[WARN] The AI Engine connection was unexpectedly interrupted (e.g. server timeout). Please try again.' } : m));
                    }
                    break;
                }

                resetChunkTimeout(); // Reset timer on every chunk received

                buffer += decoder.decode(value, { stream: true });

                let boundary = buffer.indexOf('\n\n');
                while (boundary !== -1) {
                    const line = buffer.slice(0, boundary).trim();
                    buffer = buffer.slice(boundary + 2);

                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));

                            if (data.type === 'session_id') {
                                setSessionId(data.id);
                                internallyCreatedSessionId.current = data.id;
                                if (data.id && onSessionCreated) onSessionCreated(data.id);

                                // Generate title asynchronously if this is the first user message
                                if (isFirstUserMessage && data.id) {
                                    const titleHeaders = { 'Content-Type': 'application/json' };
                                    const { data: { session: titleSession } } = await supabase.auth.getSession();
                                    if (titleSession?.access_token) {
                                        titleHeaders['Authorization'] = `Bearer ${titleSession.access_token}`;
                                    }
                                    fetch('/api/v1/engine/chat/title', {
                                        method: 'POST',
                                        headers: titleHeaders,
                                        body: JSON.stringify({ sessionId: data.id, userMessage: currentInput })
                                    })
                                        .then(res => res.json())
                                        .then(json => {
                                            if (json.title && onSessionTitleGenerated) {
                                                onSessionTitleGenerated(data.id, json.title);
                                            }
                                        })
                                        .catch(err => console.error('Failed to trigger title generation:', err));
                                }
                            } else if (data.type === 'chunk') {
                                setStreamPhase('typing');
                                const textStr = data.text;
                                if (!textStr) continue;
                                // Smooth update on placeholder
                                setMessages(prev => prev.map(m =>
                                    m.id === placeholderId
                                        ? { ...m, content: m.content + textStr }
                                        : m
                                ));
                            } else if (data.type === 'tool_call') {
                                setStreamPhase(`Executing: ${data.toolName}`);
                            } else if (data.type === 'tool_status') {
                                setStreamPhase(data.toolName === 'search_external_market' ? 'searching' : 'thinking');
                            } else if (data.type === 'status') {
                                setStreamPhase(data.phase || 'thinking');
                            } else if (data.type === 'done') {
                                streamFinishedCleanly = true;
                            } else if (data.type === 'error') {
                                let errMsg = data.message || 'An error occurred during generation.';

                                // Clean up ugly nested JSON if it's there (e.g. Gemini 503 errors)
                                try {
                                    if (typeof errMsg === 'string') {
                                        const jsonStart = errMsg.indexOf('{');
                                        if (jsonStart !== -1) {
                                            const jsonStr = errMsg.slice(jsonStart);
                                            const parsed1 = JSON.parse(jsonStr);
                                            if (parsed1.error?.message) {
                                                try {
                                                    const parsed2 = JSON.parse(parsed1.error.message);
                                                    if (parsed2.error?.message) errMsg = parsed2.error.message;
                                                    else errMsg = parsed1.error.message;
                                                } catch (e) {
                                                    errMsg = parsed1.error.message;
                                                }
                                            }
                                        }
                                    }
                                } catch (e) {
                                    // Fallback: use regex to find the innermost message string
                                    const match = errMsg.match(/"message"\s*:\s*"([^"]+)"/g);
                                    if (match && match.length > 0) {
                                        const lastMatch = match[match.length - 1];
                                        const extract = lastMatch.match(/"message"\s*:\s*"([^"]+)"/);
                                        if (extract && extract[1]) errMsg = extract[1];
                                    }
                                }

                                // Clean up any lingering ugly prefixes
                                errMsg = errMsg.replace(/^got status:[^{]+/, '').trim();
                                if (errMsg.startsWith('{')) errMsg = 'Service is currently unavailable. Please try again.';

                                // Final safety check to sanitize any raw internal API errors from leaking to UI
                                const lowerErr = errMsg.toLowerCase();
                                if (lowerErr.includes('quota') || lowerErr.includes('gemini') || lowerErr.includes('generative') || lowerErr.includes('google') || lowerErr.includes('429') || lowerErr.includes('exceeded')) {
                                    console.error('[AI Engine] Raw error hidden by UI:', errMsg);
                                    errMsg = 'The AI Engine is currently processing a massive volume of requests. Please wait a moment and try again.';
                                }

                                hasError = true;
                                setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '[WARN] ' + errMsg } : m));
                                return; // Exit gracefully
                            }
                        } catch (err) {
                            if (err.message && err.message !== 'Unexpected end of JSON input') {
                                console.error('Stream processing error:', err);
                                hasError = true;
                                setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '[WARN] Connection error or stream interrupted.' } : m));
                                return; // Exit gracefully instead of throwing
                            }
                            console.error('JSON Parse error in stream:', err);
                        }
                    }
                    boundary = buffer.indexOf('\n\n');
                }
            }
        } catch (error) {
            hasError = true;
            console.error('Chat error:', error);

            let displayError = 'Sorry, there was an error connecting to the AI Engine. Please try again later.';
            if (error === 'TIMEOUT' || error?.name === 'AbortError') {
                displayError = 'The AI Engine is taking too long to respond due to high server load. Please try again.';
            }

            setMessages(prev => prev.map(m => m.id === placeholderId ? { ...m, content: '[WARN] ' + displayError } : m));
        } finally {
            clearTimeout(chunkTimeoutId);
            // Increment local counter ONLY if there were no errors
            if (!isPremium && !hasError) {
                setGlobalMessageCount(prev => {
                    const next = prev + 1;
                    if (next >= 10 && !limitResetTime) {
                        setLimitResetTime(new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString());
                    }
                    return next;
                });
            }
            setIsLoading(false);
            setStreamPhase('idle');
        }
    };

    const retryLastMessage = () => {
        const lastUserMsg = messages.slice().reverse().find(m => m.role === 'user');
        if (!lastUserMsg) return;
        
        // Remove all error messages and the last user message from the context
        const filteredMessages = messages.filter(m => m.id !== lastUserMsg.id && !(m.role === 'assistant' && m.content?.startsWith('[WARN]')));
        
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
