import { useState, useEffect } from 'react';

/**
 * useVisualStreamingSkeleton
 * Custom hook to track active message index during component construction.
 */
export function useVisualStreamingSkeleton(messagesCount) {
    const [msgIdx, setMsgIdx] = useState(0);

    useEffect(() => {
        const msgTimer = setInterval(() => {
            setMsgIdx(i => (i + 1) % messagesCount);
        }, 2000);
        return () => clearInterval(msgTimer);
    }, [messagesCount]);

    return msgIdx;
}
