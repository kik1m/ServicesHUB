import { useState, useCallback } from 'react';

/**
 * 🤖 Elite AI Semantic Search Hook v4.0 (Independent Result Mode)
 * Responsibility: Processing queries and holding independent tool results.
 */
export const useAiSearch = ({ userId }) => {
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [aiResults, setAiResults] = useState(null); // Independent results
    const [error, setError] = useState(null);

    const processQuery = useCallback(async (query) => {
        if (!query || query.length < 3) return;

        setIsAiLoading(true);
        setError(null);
        setAiMessage('');

        try {
            const response = await fetch('/api/ai-search-analysis', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, userId, model: 'gemini-2.5-flash' }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 429) {
                    setError('The AI service is currently at full capacity (Daily Limit Reached). Please try again later or use standard search.');
                    setAiMessage('Limit Reached: Please try again in a few moments.');
                    return;
                }
                const errorMsg = data.error?.message || data.message || 'The AI is taking a short break. Please try again in a moment.';
                setError(errorMsg);
                return;
            }

            // Set Independent Results
            setAiResults(data.tools || []);
            setAiMessage(data.message || 'I found these tools for you.');

        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
            console.error('[useAiSearch] Error:', err);
        } finally {
            setIsAiLoading(false);
        }
    }, [userId]);

    const resetAi = useCallback(() => {
        setAiResults(null);
        setAiMessage('');
        setError(null);
    }, []);

    return {
        isAiLoading,
        aiMessage,
        aiResults,
        error,
        processQuery,
        resetAi,
        setAiMessage,
        setError
    };
};
