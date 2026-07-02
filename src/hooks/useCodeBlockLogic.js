import { useState, useEffect, useRef } from 'react';

/**
 * useCodeBlockLogic
 * Custom hook to manage code block presentation logic, including copying with timer cleanups.
 */
export function useCodeBlockLogic(code) {
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState('code');
    const timerRef = useRef(null);

    const handleCopy = () => {
        if (typeof window === 'undefined') return;
        navigator.clipboard.writeText(code);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return {
        copied,
        viewMode,
        setViewMode,
        handleCopy
    };
}
