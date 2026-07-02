import { useState, useCallback, useEffect, useRef } from 'react';
import { aiEngineService } from '../services/aiEngineService';
import { useToast } from '../context/ToastContext';

export function useAISessions(userId, initialSessionId = null) {
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    // activeSessionId mirrors URL param for sidebar highlighting
    const [activeSessionId, setActiveSessionId] = useState(initialSessionId);
    
    // --- Search State ---
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- Messages State ---
    const [historicalMessages, setHistoricalMessages] = useState(null);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const createdSessionIdRef = useRef(null);

    const { showToast } = useToast();

    const fetchSessions = useCallback(async (silent = false) => {
        if (!userId) return;
        if (!silent) setSessionsLoading(true);
        try {
            const { data, error } = await aiEngineService.getUserSessions(userId);
            if (error) throw error;
            setSessions(data || []);
        } catch (error) {
            console.error('[useAISessions] Error fetching sessions:', error);
            showToast('Failed to load sessions.', 'error');
        } finally {
            setSessionsLoading(false);
        }
    }, [userId, showToast]);

    // Initial fetch
    useEffect(() => {
        fetchSessions();
    }, [fetchSessions]);

    // Sync sidebar highlight with URL param — always follow URL (source of truth)
    useEffect(() => {
        setActiveSessionId(initialSessionId);
    }, [initialSessionId]);

    const renameSession = async (sessionId, newTitle) => {
        if (!newTitle.trim()) return;

        const previousSessions = [...sessions];
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));

        try {
            const { error } = await aiEngineService.renameSession(sessionId, newTitle);
            if (error) throw error;
            showToast('Session renamed successfully.', 'success');
        } catch (err) {
            console.error('Failed to rename session:', err);
            setSessions(previousSessions);
            showToast('Failed to rename session.', 'error');
        }
    };

    const deleteSession = async (sessionId) => {
        const previousSessions = [...sessions];
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        
        let didClearActive = false;
        if (activeSessionId === sessionId) {
            setActiveSessionId(null);
            didClearActive = true;
        }

        try {
            const { error } = await aiEngineService.deleteSession(sessionId);
            if (error) throw error;
            showToast('Session deleted successfully.', 'success');
            return didClearActive;
        } catch (err) {
            console.error('Failed to delete session:', err);
            setSessions(previousSessions);
            if (didClearActive) setActiveSessionId(sessionId);
            showToast('Failed to delete session.', 'error');
            return false;
        }
    };

    const onSessionCreated = useCallback((sessionId) => {
        createdSessionIdRef.current = sessionId;
        setActiveSessionId(sessionId);
        fetchSessions(true);
    }, [fetchSessions]);

    const onSessionTitleGenerated = useCallback((sessionId, title) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
    }, []);

    const filteredSessions = sessions.filter(session => {
        if (!searchQuery) return true;
        const label = session.title || (session.tool1 && session.tool2 ? `${session.tool1.name} vs ${session.tool2.name}` : 'AI Session');
        return label.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Load messages — driven by URL param (initialSessionId) as source of truth
    useEffect(() => {
        const loadMessages = async () => {
            if (!initialSessionId) {
                // New chat: immediately clear, reset loading
                setHistoricalMessages(null);
                setMessagesLoading(false);
                return;
            }
            // Skip if session was just created in this tab (messages already in state)
            if (initialSessionId === createdSessionIdRef.current) {
                createdSessionIdRef.current = null;
                setMessagesLoading(false);
                return;
            }
            setMessagesLoading(true);
            const { data, error } = await aiEngineService.getMessages(initialSessionId);
            if (!error && data) {
                setHistoricalMessages(data);
            }
            setMessagesLoading(false);
        };
        loadMessages();
    }, [initialSessionId]);

    return {
        sessions: filteredSessions,
        sessionsLoading,
        activeSessionId,
        setActiveSessionId,
        renameSession,
        deleteSession,
        onSessionCreated,
        onSessionTitleGenerated,
        fetchSessions,
        searchQuery,
        setSearchQuery,
        // Guard: never pass stale messages from a previous session to a new chat.
        // Effects run after render, so historicalMessages might still hold old data
        // when sidParam just changed to null. This prevents the flicker.
        historicalMessages: initialSessionId ? historicalMessages : null,
        messagesLoading
    };
}
