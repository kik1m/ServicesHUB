import { useState, useEffect } from 'react';

export function useAISettings() {
    const [aiSettings, setAiSettings] = useState({ tone: 'default', language: 'auto' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem('hubly_ai_settings');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    // Basic validation
                    if (parsed && typeof parsed === 'object') {
                        setAiSettings(prev => ({ ...prev, ...parsed }));
                    }
                }
            } catch (e) {
                console.error("Failed to parse hubly_ai_settings", e);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('hubly_ai_settings', JSON.stringify(aiSettings));
        }
    }, [aiSettings]);

    return { aiSettings, setAiSettings };
}
