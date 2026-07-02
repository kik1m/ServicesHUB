import { useState, useEffect, useRef } from 'react';

/**
 * useVisualFrame
 * Logic hook to handle message listener and height resizing for sandbox iframes.
 */
export function useVisualFrame() {
    const iframeRef = useRef(null);
    const [iframeHeight, setIframeHeight] = useState(150);

    useEffect(() => {
        const handleMessage = (event) => {
            if (iframeRef.current && event.source === iframeRef.current.contentWindow) {
                if (event.data && event.data.action === 'resize' && event.data.height) {
                    setIframeHeight(event.data.height);
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return { iframeRef, iframeHeight };
}
