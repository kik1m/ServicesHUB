import { useState, useEffect } from 'react';
import mermaid from 'mermaid';
import DOMPurify from 'isomorphic-dompurify';
import { fixMermaidCode } from '../components/AIEngine/mermaidSyntaxFixer';

// Initialize Mermaid configs securely on the client side
if (typeof window !== 'undefined') {
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        fontFamily: 'Inter, system-ui, sans-serif',
        useMaxWidth: true,
        flowchart: { htmlLabels: true, curve: 'linear' },
        sequence: { useMaxWidth: true },
        gantt: { useMaxWidth: true },
    });
}

/**
 * useMermaidDiagram
 * Hook to render Mermaid.js charts asynchronously with a trailing debounce.
 */
export function useMermaidDiagram(chart) {
    const [svg, setSvg] = useState(null);
    const [error, setError] = useState(false);
    const [rawError, setRawError] = useState('');

    useEffect(() => {
        if (!chart) return;
        let isMounted = true;

        const renderChart = async () => {
            const originalConsoleError = console.error;
            console.error = () => { };

            const attempts = [fixMermaidCode(chart), chart];
            let rendered = false;

            for (const attempt of attempts) {
                try {
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, attempt);
                    if (isMounted) {
                        const cleanSvg = DOMPurify.sanitize(svg, {
                            USE_PROFILES: { svg: true },
                            ADD_TAGS: ['foreignObject'],
                            ADD_ATTR: ['xmlns:xhtml']
                        });
                        setSvg(cleanSvg);
                        setError(false);
                        rendered = true;
                    }
                    break;
                } catch (err) {
                    setRawError(err?.message || '');
                }
            }

            if (!rendered && isMounted) {
                setError(true);
            }

            console.error = originalConsoleError;
        };

        const timer = setTimeout(renderChart, 500);
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [chart]);

    return {
        svg,
        error,
        rawError
    };
}
