import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export function useChatSuggestions(tool1, tool2, workspaceContext, initialSessionId, isCompareMode, messagesLength) {
    const [suggestions, setSuggestions] = useState([]);
    const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
    // Use a ref to prevent duplicate fetches within the same component mount
    const fetchedRef = useRef(false);

    useEffect(() => {
        // Only generate suggestions for brand-new chats (no session, no messages)
        if (isCompareMode || initialSessionId || messagesLength > 0 || fetchedRef.current) return;

        const fetchSuggestions = async () => {
            fetchedRef.current = true; // Mark immediately to prevent duplicate calls
            
            const cacheKey = `hubly_suggestions_v2_${tool1?.slug || 'none'}_${tool2?.slug || 'none'}`;
            const cached = sessionStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (parsed?.length > 0) {
                        setSuggestions(parsed);
                        return;
                    }
                } catch (e) {
                    sessionStorage.removeItem(cacheKey);
                }
            }

            setIsGeneratingSuggestions(true);
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
                
                let result = ["What's the best tool for me?", "Help me build a project", "Compare top tools"];
                if (response.ok) {
                    const data = await response.json();
                    if (data.suggestions?.length > 0) result = data.suggestions;
                }
                setSuggestions(result);
                sessionStorage.setItem(cacheKey, JSON.stringify(result));
            } catch (e) {
                // Always show fallback suggestions so UI is never empty
                setSuggestions(["What's the best tool for me?", "Help me build a project", "Compare top tools"]);
            } finally {
                setIsGeneratingSuggestions(false);
            }
        };

        fetchSuggestions();
    // NOTE: deps intentionally minimal - this hook lives for one component mount.
    // When the key on AIChatWidget changes, this hook remounts with fetchedRef=false.
    }, [initialSessionId, messagesLength, isCompareMode]); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        suggestions,
        setSuggestions,
        isGeneratingSuggestions
    };
}
