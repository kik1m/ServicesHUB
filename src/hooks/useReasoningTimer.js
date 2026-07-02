import { useState, useEffect, useRef } from 'react';

/**
 * useReasoningTimer
 * Custom hook to track elapsed seconds of active streaming.
 */
export function useReasoningTimer(isStreaming) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
        if (isStreaming) {
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                setElapsedSeconds(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isStreaming]);

    return elapsedSeconds;
}
