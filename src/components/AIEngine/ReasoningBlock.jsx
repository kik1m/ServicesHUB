'use client';
import React, { useState, useMemo } from 'react';
import { Brain, ChevronDown, ChevronUp, Sparkles, Clock } from 'lucide-react';
import { useReasoningTimer } from '../../hooks/useReasoningTimer';
import styles from './ReasoningBlock.module.css';

// ─────────────────────────────────────────────────────────────
// 🔵 HUBly AI — Elite Reasoning Block Component
// A Claude-like "thinking" section that shows the model's internal
// thought process with a live, animated, collapsible interface.
// ─────────────────────────────────────────────────────────────

function countWords(str) {
    return str ? str.trim().split(/\s+/).filter(Boolean).length : 0;
}

// A simple inline renderer for the reasoning text
// to highlight bold, code, and numbered points
function ReasoningLine({ text }) {
    const parts = [];
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    let last = 0, match, idx = 0;
    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) parts.push(<span key={idx++}>{text.slice(last, match.index)}</span>);
        const raw = match[0];
        if (raw.startsWith('**')) {
            parts.push(<strong key={idx++} className={styles.bold}>{raw.slice(2, -2)}</strong>);
        } else if (raw.startsWith('`')) {
            parts.push(<code key={idx++} className={styles.code}>{raw.slice(1, -1)}</code>);
        }
        last = match.index + raw.length;
    }
    if (last < text.length) parts.push(<span key={idx++}>{text.slice(last)}</span>);
    return <>{parts}</>;
}

export default function ReasoningBlock({ content, isStreaming = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const elapsedSeconds = useReasoningTimer(isStreaming);

    const wordCount = useMemo(() => countWords(content), [content]);

    // Parse content into meaningful segments for display
    const lines = useMemo(() => {
        if (!content) return [];
        return content
            .split('\n')
            .filter(l => l.trim().length > 0);
    }, [content]);

    const summaryLine = lines[0] || '';
    const timeLabel = isStreaming
        ? `${elapsedSeconds}s`
        : wordCount > 0
            ? `${wordCount} words`
            : null;

    return (
        <div
            className={`${styles.wrapper} ${isStreaming ? styles.streaming : styles.complete} notranslate`}
            translate="no"
            dir="ltr"
        >
            {/* Header Row */}
            <div
                className={styles.header}
                onClick={() => setIsOpen(o => !o)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setIsOpen(o => !o)}
                aria-expanded={isOpen}
            >
                <div className={styles.headerLeft}>
                    <div className={`${styles.iconBubble} ${isStreaming ? styles.iconBubblePulse : ''}`}>
                        {isStreaming ? (
                            <Sparkles size={13} className={styles.sparkleIcon} />
                        ) : (
                            <Brain size={13} className={styles.brainIcon} />
                        )}
                    </div>
                    <span className={styles.label}>
                        {isStreaming ? 'Thinking...' : 'AI Thought Process'}
                    </span>
                    {timeLabel && (
                        <span className={styles.badge}>
                            <Clock size={10} />
                            {timeLabel}
                        </span>
                    )}
                </div>
                <div className={styles.headerRight}>
                    {!isStreaming && !isOpen && summaryLine && (
                        <span className={styles.preview} title={summaryLine}>
                            <ReasoningLine text={summaryLine.length > 60 ? summaryLine.slice(0, 60) + '…' : summaryLine} />
                        </span>
                    )}
                    <span className={styles.chevronBtn}>
                        {isOpen
                            ? <ChevronUp size={14} />
                            : <ChevronDown size={14} />}
                    </span>
                </div>
            </div>

            {/* Streaming shimmer bar (visible when streaming & collapsed) */}
            {isStreaming && !isOpen && (
                <div className={styles.shimmerBar}>
                    <div className={styles.shimmerFill} />
                </div>
            )}

            {/* Expanded Content */}
            {isOpen && (
                <div className={styles.body}>
                    <div className={styles.timelineContainer}>
                        <div className={styles.timelineTrack} />
                        <div className={styles.linesList}>
                            {lines.map((line, i) => {
                                const isHeading = /^#{1,3}\s/.test(line);
                                const isBullet = /^[-*•]\s/.test(line) || /^\d+\.\s/.test(line);
                                const cleanLine = line.replace(/^#{1,3}\s/, '').replace(/^[-*•]\s/, '').replace(/^\d+\.\s/, '');
                                return (
                                    <div
                                        key={i}
                                        className={`${styles.lineRow} ${isHeading ? styles.headingRow : ''} ${isBullet ? styles.bulletRow : ''}`}
                                        style={{ animationDelay: `${Math.min(i * 15, 300)}ms` }}
                                    >
                                        <div className={styles.dot} />
                                        <div className={styles.lineText}>
                                            <ReasoningLine text={cleanLine} />
                                        </div>
                                    </div>
                                );
                            })}
                            {isStreaming && (
                                <div className={styles.lineRow}>
                                    <div className={`${styles.dot} ${styles.dotPulse}`} />
                                    <div className={styles.cursor} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
