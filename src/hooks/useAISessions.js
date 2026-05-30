import { useState, useCallback, useEffect } from 'react';
import { aiEngineService } from '../services/aiEngineService';
import { useToast } from '../context/ToastContext';

export function useAISessions(userId, initialSessionId = null) {
    const [sessions, setSessions] = useState([]);
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [activeSessionId, setActiveSessionId] = useState(initialSessionId);
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

    // Sync with URL params if needed
    useEffect(() => {
        if (initialSessionId && initialSessionId !== activeSessionId) {
            setActiveSessionId(initialSessionId);
        }
    }, [initialSessionId]);

    const renameSession = async (sessionId, newTitle) => {
        if (!newTitle.trim()) return;

        // Optimistic UI Update
        const previousSessions = [...sessions];
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));

        try {
            const { error } = await aiEngineService.renameSession(sessionId, newTitle);
            if (error) throw error;
            showToast('Session renamed successfully.', 'success');
        } catch (err) {
            console.error('Failed to rename session:', err);
            // Revert on failure
            setSessions(previousSessions);
            showToast('Failed to rename session.', 'error');
        }
    };

    const deleteSession = async (sessionId) => {
        // Optimistic UI Update
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
            // Revert on failure
            setSessions(previousSessions);
            if (didClearActive) setActiveSessionId(sessionId);
            showToast('Failed to delete session.', 'error');
            return false;
        }
    };

    const onSessionCreated = useCallback((sessionId) => {
        setActiveSessionId(sessionId);
        fetchSessions(true);
    }, [fetchSessions]);

    const onSessionTitleGenerated = useCallback((sessionId, title) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title } : s));
    }, []);

    return {
        sessions,
        sessionsLoading,
        activeSessionId,
        setActiveSessionId,
        renameSession,
        deleteSession,
        onSessionCreated,
        onSessionTitleGenerated,
        fetchSessions
    };
}
