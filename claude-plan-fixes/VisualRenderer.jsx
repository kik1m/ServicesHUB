'use client';
/**
 * VisualRenderer.jsx — HUBly AI Visual Engine v2.0
 *
 * FIXES:
 * 1. Shadow DOM removed — caused Tailwind CDN to fail silently (CDN injects into <head>, not shadow root)
 * 2. Now uses iframe with srcdoc for full CSS isolation + Tailwind support
 * 3. Auto-resize via postMessage
 * 4. Proper error boundary with retry
 * 5. Loading skeleton during render
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VISUAL_HTML_TEMPLATE } from './visualHtmlTemplate';

export default function VisualRenderer({ code }) {
    const iframeRef = useRef(null);
    const [height, setHeight] = useState(200);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const retryCount = useRef(0);

    const handleMessage = useCallback((event) => {
        if (!iframeRef.current) return;
        try {
            if (event.source !== iframeRef.current.contentWindow) return;
            const { action, height: h, error } = event.data || {};

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
        } catch (e) {
            // cross-origin safety
        }
    }, []);

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [handleMessage]);

    // Timeout fallback — if no message in 4s, show content anyway
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
        // Force iframe reload
        if (iframeRef.current) {
            iframeRef.current.srcdoc = VISUAL_HTML_TEMPLATE(transformCode(code));
        }
    };

    if (!code?.trim()) return null;

    const finalCode = transformCode(code);
    const srcDoc = VISUAL_HTML_TEMPLATE(finalCode);

    return (
        <div style={{
            margin: '16px 0',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.01)',
            position: 'relative',
            transition: 'height 0.3s ease',
        }}>
            {/* Loading skeleton */}
            {status === 'loading' && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    padding: '20px',
                    background: 'rgba(9,14,23,0.9)',
                    borderRadius: '16px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <div style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: '#00d2ff',
                            animation: 'vr-pulse 1.2s ease-in-out infinite',
                            boxShadow: '0 0 10px rgba(0,210,255,0.6)',
                        }} />
                        <span style={{ fontSize: '12px', color: '#00d2ff', fontWeight: 600, letterSpacing: '0.5px' }}>
                            Building visual component...
                        </span>
                    </div>
                    {[95, 80, 90, 65, 75].map((w, i) => (
                        <div key={i} style={{
                            height: '13px', width: `${w}%`, borderRadius: '6px',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 8%, rgba(255,255,255,0.09) 18%, rgba(255,255,255,0.04) 33%)',
                            backgroundSize: '800px 100%',
                            animation: `vr-shimmer 1.8s linear infinite`,
                            animationDelay: `${i * 0.12}s`,
                        }} />
                    ))}
                    <style>{`
                        @keyframes vr-pulse { 0%,100%{opacity:0.5;transform:scale(0.9)} 50%{opacity:1;transform:scale(1.1)} }
                        @keyframes vr-shimmer { 0%{background-position:-800px 0} 100%{background-position:800px 0} }
                    `}</style>
                </div>
            )}

            {/* Error state */}
            {status === 'error' && (
                <div style={{
                    padding: '20px', color: '#fca5a5', fontSize: '13px',
                    display: 'flex', flexDirection: 'column', gap: '10px',
                    background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    borderRadius: '16px',
                }}>
                    <span style={{ fontWeight: 600, color: '#ef4444' }}>⚠ Failed to render visual component</span>
                    <span style={{ opacity: 0.7, fontSize: '12px' }}>{errorMsg}</span>
                    <button onClick={handleRetry} style={{
                        alignSelf: 'flex-start', padding: '6px 14px',
                        background: 'rgba(0,210,255,0.1)', border: '1px solid rgba(0,210,255,0.3)',
                        color: '#00d2ff', borderRadius: '8px', cursor: 'pointer',
                        fontSize: '12px', fontWeight: 600,
                    }}>Retry</button>
                </div>
            )}

            {/* The actual iframe */}
            <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-same-origin"
                style={{
                    width: '100%',
                    height: `${height}px`,
                    border: 'none',
                    display: 'block',
                    opacity: status === 'loading' ? 0 : 1,
                    transition: 'opacity 0.4s ease, height 0.3s ease',
                    borderRadius: '16px',
                }}
                title="HUBly Visual Component"
                onError={() => { setStatus('error'); setErrorMsg('iframe failed to load'); }}
            />
        </div>
    );
}

// ─── Code transformer (icon tags, tool cards, etc.) ────────────────────────────
function transformCode(rawCode) {
    let result = (rawCode || '').trim();

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

    // Icon tags → inline SVG/emoji
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
