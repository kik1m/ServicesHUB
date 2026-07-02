import React, { memo } from 'react';
import styles from './MarkdownRenderer.module.css';
import { parseMarkdownElements } from './parseMarkdownElements';

// ─────────────────────────────────────────────────────────────
// 🔵 Elite Markdown Renderer (Memoized for Translation Immunity)
// ─────────────────────────────────────────────────────────────
const MarkdownRenderer = memo(function MarkdownRenderer({ content, isStreaming = false, onWorkflowStateUpdate, messageId, onArtifactUpdate }) {
    if (!content) return null;

    // Use the decoupled parser logic to convert markdown text into an array of Elite UI JSX components
    const elements = parseMarkdownElements(content, styles, isStreaming, onWorkflowStateUpdate, messageId, onArtifactUpdate);

    return <div className={styles.markdownBody}>{elements}</div>;
});

export default MarkdownRenderer;
