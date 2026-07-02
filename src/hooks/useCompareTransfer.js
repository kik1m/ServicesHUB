import { useEffect } from 'react';

export function useCompareTransfer(initialSessionId, sendMessage) {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const urlParams = new URLSearchParams(window.location.search);
        const isTransfer = urlParams.get('transfer') === 'true';
        const pendingInput = urlParams.get('pendingInput');
        
        if (isTransfer) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('transfer');
            newUrl.searchParams.delete('pendingInput');
            window.history.replaceState({}, '', newUrl);

            if (pendingInput) {
                // Give the UI a moment to load messages from DB before sending
                setTimeout(() => {
                    sendMessage(null, decodeURIComponent(pendingInput));
                }, 1000);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSessionId]);

    // Handle initiating a transfer
    const initiateTransfer = (sessionId, textToSend, tool1, tool2) => {
        const pendingInputEncoded = encodeURIComponent(textToSend);
        window.open(`/ai-engine?sid=${sessionId}&t1=${tool1?.slug || ''}&t2=${tool2?.slug || ''}&transfer=true&pendingInput=${pendingInputEncoded}`, '_blank');
    };

    return { initiateTransfer };
}
