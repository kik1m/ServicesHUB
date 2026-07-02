import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { VISUAL_HTML_TEMPLATE } from '../components/AIEngine/visualHtmlTemplate';
import { supabase } from '../lib/supabaseClient';

/**
 * useVisualRenderer
 * Custom hook to handle iframe-based sandbox loading states, dynamic height resizing,
 * postMessage communication, and fallback timers.
 */
export function useVisualRenderer({ code, onWorkflowStateUpdate, messageId }) {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState(200);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const retryCount = useRef(0);

    const handleSandboxGeneration = useCallback(async (engine, payload, requestId) => {
        if (!iframeRef.current) return;
        const targetWindow = iframeRef.current.contentWindow;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const res = await fetch('/api/v1/engine/sandbox/generate', {
                method: 'POST',
                headers,
                body: JSON.stringify({ engine, payload })
            });

            const data = await res.json();
            if (data.success) {
                targetWindow.postMessage({
                    action: 'HUB_API_RESPONSE',
                    requestId,
                    success: true,
                    result: data.result
                }, '*');
            } else {
                targetWindow.postMessage({
                    action: 'HUB_API_RESPONSE',
                    requestId,
                    success: false,
                    error: data.error || 'Generation failed'
                }, '*');
            }
        } catch (err) {
            targetWindow.postMessage({
                action: 'HUB_API_RESPONSE',
                requestId,
                success: false,
                error: err.message
            }, '*');
        }
    }, []);

    const handleMessage = useCallback((event) => {
        if (!iframeRef.current) return;
        try {
            if (event.source !== iframeRef.current.contentWindow) return;
            const { action, height: h, error, state, payload, requestId } = event.data || {};

            if (action === 'resize' && typeof h === 'number' && h > 0) {
                setHeight(Math.min(h + 24, 1200)); // cap at 1200px
                setStatus('ready');
            }
            if (action === 'error') {
                setStatus('error');
                setErrorMsg(error || 'Render failed');
            }
            if (action === 'ready') {
                setStatus('ready');
            }
            if (action === 'workflow_sync' && onWorkflowStateUpdate) {
                onWorkflowStateUpdate(state, messageId);
            }
            if (action === 'HUB_GENERATE_SPEECH') {
                handleSandboxGeneration('audio', payload, requestId);
            }
            if (action === 'HUB_GENERATE_IMAGE') {
                handleSandboxGeneration('image', payload, requestId);
            }
        } catch (e) {
            // cross-origin safety
        }
    }, [onWorkflowStateUpdate, messageId, handleSandboxGeneration]);

    // Setup window message listeners
    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    // Timeout fallback — if no postMessage in 4s, show content anyway
    useEffect(() => {
        const timer = setTimeout(() => {
            if (status === 'loading') setStatus('ready');
        }, 4000);
        return () => clearTimeout(timer);
    }, [status, code]);

    const handleRetry = () => {
        retryCount.current++;
        setStatus('loading');
        setErrorMsg('');
        if (iframeRef.current) {
            iframeRef.current.srcdoc = VISUAL_HTML_TEMPLATE(transformCode(code));
        }
    };

    const isJson = useMemo(() => {
        const trimmed = (code || '').trim();
        return (trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'));
    }, [code]);

    const finalCode = useMemo(() => transformCode(code || ''), [code]);
    const srcDoc = useMemo(() => VISUAL_HTML_TEMPLATE(finalCode), [finalCode]);

    return {
        iframeRef,
        height,
        status,
        setStatus,
        setErrorMsg,
        errorMsg,
        handleRetry,
        isJson,
        srcDoc
    };
}

// ─── Code transformer (icon tags, tool cards, etc.) ────────────────────────────
function transformCode(rawCode) {
    let result = (rawCode || '').trim();

    // Clean up literal \n, \t, \r sequences that might be left by double-escaping
    result = result.replace(/\\n/g, '\n');
    result = result.replace(/\\t/g, '\t');
    result = result.replace(/\\r/g, '\r');

    // External tool cards
    result = result.replace(
        /\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.*?)\|\|(.*?)\|(.*?)\s*\]/gi,
        (_, name, url, desc) => `
        <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 my-2 w-max max-w-full">
            <img src="https://www.google.com/s2/favicons?domain=${url.trim()}&sz=64" width="36" height="36" style="border-radius:8px;background:#1e293b;" onerror="this.style.display='none'" />
            <div class="flex flex-col gap-1">
                <strong class="text-white text-sm font-semibold">${name.trim()}</strong>
                <span class="text-slate-400 text-xs leading-snug">${(desc || '').trim()}</span>
            </div>
            <a href="${url.trim()}" target="_blank" rel="noopener" class="ml-auto bg-cyan-500/20 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">Visit</a>
        </div>`
    );

    // Internal tool cards (inline pill with avatar)
    result = result.replace(
        /\[\s*TOOL_CARD\s*:\s*(.*?)\s*\]/gi,
        (_, slug) => {
            const cleanSlug = slug.split('|')[0].trim();
            const displayName = slug.split('|')[1]?.trim() || cleanSlug;
            const formattedName = displayName
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            const firstLetter = cleanSlug.charAt(0).toUpperCase();
            
            return `
            <a href="/tools/${cleanSlug}" target="_blank" class="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-2.5 py-0.5 text-xs text-cyan-400 font-semibold transition-colors duration-150 align-middle my-0.5 whitespace-nowrap">
                <span class="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] font-extrabold uppercase shrink-0">${firstLetter}</span>
                <span class="text-white text-[11px] font-[Cairo] font-medium leading-none">${formattedName}</span>
            </a>`;
        }
    );

    // Icon tags → inline SVG
    const icons = {
        '[info]':         '<svg class="inline w-4 h-4 text-blue-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        '[check]':        '<svg class="inline w-4 h-4 text-emerald-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
        '[warn]':         '<svg class="inline w-4 h-4 text-amber-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>',
        '[insight]':      '<svg class="inline w-4 h-4 text-violet-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        '[metrics]':      '<svg class="inline w-4 h-4 text-teal-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
        '[goal]':         '<svg class="inline w-4 h-4 text-yellow-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
        '[idea]':         '<svg class="inline w-4 h-4 text-yellow-300 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 18h6M10 22h4M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14"/></svg>',
        '[database]':     '<svg class="inline w-4 h-4 text-indigo-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
        '[security]':     '<svg class="inline w-4 h-4 text-emerald-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        '[action]':       '<svg class="inline w-4 h-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>',
        '[architecture]': '<svg class="inline w-4 h-4 text-slate-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
        '[user]':         '<svg class="inline w-4 h-4 text-blue-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    };
    Object.entries(icons).forEach(([tag, svg]) => {
        result = result.replace(new RegExp(`\\[\\s*${tag.slice(1,-1)}\\s*\\]`, 'gi'), svg);
    });

    return result;
}
