import React from 'react';
import dynamic from 'next/dynamic';
import VisualStreamingSkeleton from '../../VisualStreamingSkeleton';
import VisualErrorBoundary from '../../VisualErrorBoundary';

// Dynamic import to avoid SSR issues with iframe/postMessage
const VisualRenderer = dynamic(() => import('../../VisualRenderer'), { ssr: false });

/**
 * parseVisualBlock — HUBly AI Visual Engine v2.0
 *
 * FIXES:
 * 1. Imports VisualRenderer directly (not via index.jsx which only exported VisualFrame)
 * 2. Passes isStreaming correctly to show skeleton during stream
 * 3. Trims and validates code before rendering (prevents empty frames)
 * 4. Handles partial VISUAL_START during streaming gracefully
 */
export function parseVisualBlock(lines, i, elements, key, isStreaming) {
    const startLine = lines[i];
    if (!startLine.includes('<<<VISUAL_START>>>')) return i;

    const codeLines = [];
    let curr = i + 1;
    let foundClose = false;
    const MAX_LINES = 1500;

    while (curr < lines.length && codeLines.length < MAX_LINES) {
        if (lines[curr].includes('<<<VISUAL_END>>>')) {
            foundClose = true;
            break;
        }
        codeLines.push(lines[curr]);
        curr++;
    }

    const code = codeLines.join('\n').trim();

    if (foundClose && code.length > 10) {
        // Full visual block — render it
        elements.push(
            <div
                key={key()}
                style={{
                    opacity: 0,
                    animation: 'vb-fade 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
                }}
            >
                <style>{`@keyframes vb-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
                <VisualErrorBoundary>
                    <VisualRenderer code={code} />
                </VisualErrorBoundary>
            </div>
        );
    } else if (isStreaming && !foundClose) {
        // Still streaming — show skeleton
        elements.push(
            <div key={key()}>
                <VisualStreamingSkeleton />
            </div>
        );
    }
    // If code is empty and stream finished — skip silently (no broken empty frames)

    return foundClose ? curr + 1 : curr;
}
