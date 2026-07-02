'use client';
import React from 'react';
import { useVisualFrame } from '../../hooks/useVisualFrame';
import { buildHTMLDoc } from './designSystem';
import styles from './SharedComponents.module.css';

/**
 * VisualFrame
 * Sandbox iframe rendering visual HTML elements or SVG shapes.
 * Refactored to be a presenter component.
 */
export default function VisualFrame({ code }) {
    const { iframeRef, iframeHeight } = useVisualFrame();

    const transformCodeToHTML = (rawCode) => {
        let result = rawCode;

        // 1. External Tool Cards
        result = result.replace(/\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.*?)\|\|(.*?)\|(.*?)\s*\]/gi, (match, name, url, desc) => {
            return `
            <div style="display:inline-flex; align-items:center; gap:12px; background:var(--bg-secondary, rgba(255,255,255,0.05)); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--border-strong, rgba(255,255,255,0.1)); border-radius:12px; padding:10px 14px; margin:6px; max-width:100%; width:max-content; box-sizing:border-box; flex-wrap:nowrap; overflow:hidden;">
                <img src="https://www.google.com/s2/favicons?domain=${url}&sz=64" alt="${name}" style="width:36px; height:36px; border-radius:8px; background:var(--bg-tertiary, #333);" />
                <div style="display:flex; flex-direction:column; flex:1; gap:4px;">
                    <strong style="font-size:14px; color:var(--text-primary, #fff); line-height:1;">${name}</strong>
                    <span style="font-size:12px; color:var(--text-secondary, #aaa); line-height:1.4;">${desc}</span>
                </div>
                <a href="${url}" target="_blank" style="background:var(--primary, #378ADD); color:white; text-decoration:none; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; transition:opacity 0.2s;">Visit</a>
            </div>`;
        });

        // 2. Internal Tool Cards
        result = result.replace(/\[\s*TOOL_CARD\s*:\s*(.*?)\s*\]/gi, (match, slug) => {
            const cleanSlug = slug.split('|')[0].trim();
            return `
            <div style="display:inline-flex; align-items:center; gap:12px; background:var(--bg-secondary, rgba(255,255,255,0.05)); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--border-strong, rgba(255,255,255,0.1)); border-radius:12px; padding:10px 14px; margin:6px; max-width:100%; width:max-content; box-sizing:border-box; flex-wrap:nowrap; overflow:hidden;">
                <div style="width:36px; height:36px; border-radius:8px; background:rgba(83, 74, 183, 0.15); display:flex; align-items:center; justify-content:center; color:#534AB7; font-weight:bold; font-size:16px;">
                    T
                </div>
                <div style="display:flex; flex-direction:column; flex:1; gap:4px;">
                    <strong style="font-size:14px; color:var(--text-primary, #fff); line-height:1;">${cleanSlug}</strong>
                    <span style="font-size:12px; color:var(--text-secondary, #aaa); line-height:1.4;">Integrated platform-supported tool</span>
                </div>
                <a href="/tools/${cleanSlug}" target="_blank" style="background:#534AB7; color:white; text-decoration:none; padding:6px 14px; border-radius:6px; font-size:12px; font-weight:600; transition:opacity 0.2s;">View Tool</a>
            </div>`;
        });

        // 3. Icons / Callouts
        const icons = {
            '[info]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#3b82f6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
            '[check]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#10b981" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
            '[warn]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#f59e0b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
            '[insight]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#8b5cf6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
            '[metrics]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#14b8a6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>',
            '[architecture]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#64748b" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>',
            '[action]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#ef4444" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
            '[goal]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#eab308" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
            '[database]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#6366f1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
            '[security]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#10b981" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
            '[user]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#3b82f6" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
            '[idea]': '<svg style="display:inline; vertical-align:middle; margin-left:6px; color:#eab308" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>'
        };

        Object.keys(icons).forEach(tag => {
            const regex = new RegExp(`\\[\\s*${tag.slice(1, -1)}\\s*\\]`, 'gi');
            result = result.replace(regex, icons[tag]);
        });

        // Also replace [GOAL] with [goal] equivalent
        result = result.replace(/\[\s*GOAL\s*\]/gi, icons['[goal]']);

        return result;
    };

    const isSVG = code.trim().toLowerCase().startsWith('<svg');
    const finalCode = transformCodeToHTML(code);

    if (isSVG) {
        return (
            <div className={styles.svgFrameWrapper}>
                <div 
                    dangerouslySetInnerHTML={{ __html: finalCode }} 
                    className={`${styles.svgFrameContainer} ${styles.svgWrapper}`}
                />
                <style dangerouslySetInnerHTML={{ __html: `
                    .${styles.svgWrapper} svg {
                        max-width: 100%;
                        height: auto;
                        display: block;
                        margin: 0 auto;
                    }
                `}} />
            </div>
        );
    }

    return (
        <div className={styles.iframeFrameContainer}>
            <iframe
                ref={iframeRef}
                srcDoc={buildHTMLDoc(finalCode)}
                sandbox="allow-scripts allow-forms"
                className={styles.iframeFrame}
                style={{ 
                    height: `${iframeHeight}px`, 
                }}
                title="Visual Component"
            />
        </div>
    );
}
