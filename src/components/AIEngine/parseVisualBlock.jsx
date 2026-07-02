import React from 'react';
import dynamic from 'next/dynamic';
import VisualStreamingSkeleton from './VisualStreamingSkeleton';
import VisualErrorBoundary from './VisualErrorBoundary';
import styles from './VisualRenderer.module.css';

// Dynamic import to avoid SSR issues with iframe/postMessage
const VisualRenderer = dynamic(() => import('./VisualRenderer'), { ssr: false });

/**
 * parseVisualBlock — HUBly AI Visual Engine v2.0
 *
 * FIXES:
 * 1. Imports VisualRenderer via dynamic() (avoids SSR crash with iframe/postMessage)
 * 2. Passes isStreaming correctly to show skeleton during stream
 * 3. Trims and validates code before rendering (prevents empty frames)
 * 4. Handles partial VISUAL_START during streaming gracefully
 */
function checkIsRealVisualBlock(lines, startI) {
    const startLine = lines[startI];
    const startIdx = startLine.toLowerCase().indexOf('<<<visual_start>>>');
    const afterStart = startLine.slice(startIdx + 18).trim();

    const endIdx = startLine.toLowerCase().indexOf('<<<visual_end>>>', startIdx + 18);
    if (endIdx !== -1) {
        const code = startLine.slice(startIdx + 18, endIdx).trim();
        return code.startsWith('{') || code.startsWith('[') || code.startsWith('<') || code.startsWith('`');
    }

    if (afterStart.length > 0) {
        return afterStart.startsWith('{') || afterStart.startsWith('[') || afterStart.startsWith('<') || afterStart.startsWith('`');
    }

    for (let curr = startI + 1; curr < lines.length; curr++) {
        const trimmedLine = lines[curr].trim();
        if (trimmedLine.toLowerCase().includes('<<<visual_end>>>')) {
            return false;
        }
        if (trimmedLine.length > 0) {
            return trimmedLine.startsWith('{') || trimmedLine.startsWith('[') || trimmedLine.startsWith('<') || trimmedLine.startsWith('`');
        }
    }

    return true; // Assume true if streaming and no content yet
}

export function parseVisualBlock(lines, i, elements, key, isStreaming, onWorkflowStateUpdate, messageId, onArtifactUpdate) {
    const startLine = lines[i];
    if (!startLine.toLowerCase().includes('<<<visual_start>>>')) return i;
    if (!checkIsRealVisualBlock(lines, i)) return i;

    const codeLines = [];
    let curr = i + 1;
    let foundClose = false;
    const MAX_LINES = 1500;

    while (curr < lines.length && codeLines.length < MAX_LINES) {
        if (lines[curr].toLowerCase().includes('<<<visual_end>>>')) {
            foundClose = true;
            break;
        }
        codeLines.push(lines[curr]);
        curr++;
    }

    const code = codeLines.join('\n').trim();
    const isJson = code.startsWith('{') || code.startsWith('[');

    if (onArtifactUpdate && !isJson) {
        const isCurrentlyStreaming = isStreaming && !foundClose;
        
        // Notify the side panel about the updated code
        onArtifactUpdate(code, isCurrentlyStreaming, messageId);

        // Display a clean inline placeholder in the chat log
        elements.push(
            <div key={key()} className={styles.artifactChatPlaceholder}>
                <div className={styles.artifactChatPlaceholderText}>
                    <span className={`${styles.artifactChatPlaceholderIcon} ${isCurrentlyStreaming ? styles.pulse : ''}`}>
                        {isCurrentlyStreaming ? '⚙️' : '✨'}
                    </span>
                    <span>
                        {isCurrentlyStreaming
                            ? 'Generating interactive component in workspace...'
                            : 'Interactive component loaded in workspace.'}
                    </span>
                </div>
                {!isCurrentlyStreaming && (
                    <div className={styles.artifactChatPlaceholderLink}>
                        View ←
                    </div>
                )}
            </div>
        );
    } else {
        // Legacy inline rendering
        if (foundClose && code.length > 10) {
            // Render the visual block (only when complete)
            elements.push(
                <VisualErrorBoundary key={key()}>
                    <VisualRenderer code={code} onWorkflowStateUpdate={onWorkflowStateUpdate} messageId={messageId} />
                </VisualErrorBoundary>
            );
        } else if (isStreaming && !foundClose) {
            // Still streaming — show skeleton
            elements.push(
                <VisualStreamingSkeleton key={key()} />
            );
        } else if (!foundClose && code.length > 10) {
            // Stream finished but no close tag (truncated) - auto-close and render gracefully
            elements.push(
                <VisualErrorBoundary key={key()}>
                    <VisualRenderer code={code} onWorkflowStateUpdate={onWorkflowStateUpdate} messageId={messageId} />
                </VisualErrorBoundary>
            );
        }
    }
    // If code is empty and stream finished — skip silently (no broken empty frames)

    return foundClose ? curr + 1 : curr;
}

