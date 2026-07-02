import React from 'react';
import { CheckCircle2, AlertTriangle, Info, Zap, LineChart, Layers, TerminalSquare, Globe, Lightbulb, Target, Database, Shield, User } from 'lucide-react';
import styles from './MarkdownRenderer.module.css';
import SmartToolCard from './SmartToolCard';

export function renderInline(text, inTable = false) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|<br\s*\/?>|\[check\]|\[warn\]|\[info\]|\[insight\]|\[metrics\]|\[architecture\]|\[action\]|\[idea\]|\[goal\]|\[database\]|\[security\]|\[user\]|\[step\d+\]|\[\s*PROGRESS\s*:\s*\d+%?(?:\s*\|\s*.*?)?\s*\]|\[\s*TOOL_CARD\s*:.*?\]|\[\s*EXTERNAL_TOOL_CARD\s*:.*?\]|\[\s*(?:EXTERNAL_TOOL_CARD|TOOL_CARD)\s*:[^\]]*$)/gi;
    let last = 0;
    let match;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            parts.push(<span key={idx++}>{text.slice(last, match.index)}</span>);
        }
        const raw = match[0];
        const rawUpper = raw.toUpperCase().replace(/\s+/g, '');
        
        if (raw.startsWith('**')) {
            parts.push(<strong key={idx++} className={styles.mdBold}>{renderInline(raw.slice(2, -2))}</strong>);
        } else if (raw.startsWith('*')) {
            parts.push(<em key={idx++} className={styles.mdItalic}>{renderInline(raw.slice(1, -1))}</em>);
        } else if (raw.startsWith('`')) {
            parts.push(<code key={idx++} className={styles.mdInlineCode}>{raw.slice(1, -1)}</code>);
        } else if (rawUpper === '<BR>' || rawUpper === '<BR/>' || rawUpper === '<BR />') {
            parts.push(<br key={idx++} />);

        } else if (rawUpper.startsWith('[TOOL_CARD:')) {
            if (!raw.includes(']')) {
                parts.push(
                    <span key={idx++} className={styles.mdToolCardWrapper}>
                        <span className={`${styles.mdToolCard} ${styles.mdToolCardLoading}`} dir="auto">
                            <span className={styles.mdToolIconFallback}>...</span>
                            <span className={styles.mdToolInfo}><strong className={styles.mdToolLoadingText}>Loading...</strong></span>
                        </span>
                    </span>
                );
            } else {
                const extractMatch = raw.match(/\[\s*TOOL_CARD\s*:\s*(.+?)\s*\]/i);
                if (extractMatch) {
                    const slugRaw = extractMatch[1].trim().replace(/^["'{[\]]+|["'}\]]+$/g, '');
                    const slug = slugRaw.split(/\|\||\|/)[0].trim();
                    parts.push(
                        <span key={idx++} className={styles.mdToolCardWrapper}>
                            <SmartToolCard slug={slug} compact={inTable} />
                        </span>
                    );
                }
            }
        } else if (rawUpper.startsWith('[EXTERNAL_TOOL_CARD:')) {
            if (!raw.includes(']')) {
                parts.push(
                    <span key={idx++} className={styles.mdToolCardWrapper}>
                        <span className={`${styles.mdToolCard} ${styles.mdToolCardLoading}`} dir="auto">
                            <span className={styles.mdToolIconFallback}>...</span>
                            <span className={styles.mdToolInfo}><strong className={styles.mdToolLoadingText}>Loading...</strong></span>
                        </span>
                    </span>
                );
            } else {
                const extractMatch = raw.match(/\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.+?)\s*\]/i);
                if (extractMatch) {
                    const dataRaw = extractMatch[1].trim();
                    let [name, url, description] = dataRaw.split(/\|\||\|/).map(s => s.trim().replace(/^["'{\[]+|["'}\]]+$/g, ''));
                    
                    // Extract domain for favicon
                    let domain = '';
                    try {
                        if (url) {
                            const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
                            domain = new URL(cleanUrl).hostname;
                        }
                    } catch (e) {
                        domain = url ? url.replace(/^https?:\/\//i, '').split('/')[0] : '';
                    }
                    const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=64` : '/logo.png';

                    parts.push(
                        <span key={idx++} className={styles.mdToolCardWrapper}>
                            <span className={inTable ? styles.mdToolCardCompact : styles.mdToolCard} dir="auto">
                                <img
                                    src={faviconUrl}
                                    alt={name || 'External Tool'}
                                    width={inTable ? 28 : 40}
                                    height={inTable ? 28 : 40}
                                    className={styles.mdToolFavicon}
                                    onError={(e) => {
                                        e.currentTarget.src = '/logo.png';
                                    }}
                                />
                                <span className={inTable ? styles.mdToolInfoCompact : styles.mdToolInfo}>
                                    <strong className={inTable ? styles.mdToolTitleCompact : styles.mdToolTitle}>{name || 'External Tool'}</strong>
                                    {!inTable && description && <span className={styles.mdToolDesc}>{description.substring(0, 60)}...</span>}
                                    <span className={`${styles.mdToolBadge} ${inTable ? styles.mdToolBadgeCompact : ''}`}>External</span>
                                </span>
                                <a href={(url && (url.startsWith('http://') || url.startsWith('https://'))) ? url : '#'} target="_blank" rel="noopener noreferrer" className={inTable ? styles.mdToolLinkCompact : styles.mdToolLink}>
                                    Visit
                                </a>
                            </span>
                        </span>
                    );
                }
            }
        } else if (rawUpper.startsWith('[PROGRESS')) {
            const extractMatch = raw.match(/\[\s*PROGRESS\s*:\s*(\d+)%?(?:\s*\|\s*(.*?))?\s*\]/i);
            if (extractMatch) {
                const percent = parseInt(extractMatch[1], 10);
                const label = extractMatch[2] ? extractMatch[2].trim() : 'Progress';
                parts.push(
                    <span key={idx++} className={styles.progressContainer} dir="ltr">
                        <span className={styles.progressHeader}>
                            <span className={styles.progressLabel}>{label}</span>
                            <span className={styles.progressValue}>{percent}%</span>
                        </span>
                        <span className={styles.progressBar}>
                            <span className={styles.progressBarFill} style={{ width: `${percent}%` }} />
                        </span>
                    </span>
                );
            }
        } else if (rawUpper === '[CHECK]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconGray}`}><CheckCircle2 size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[WARN]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconGold}`}><AlertTriangle size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[INFO]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconSlate}`}><Info size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[INSIGHT]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconDarkGray}`}><Zap size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[METRICS]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconGray}`}><LineChart size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[ARCHITECTURE]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconSlate}`}><Layers size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[ACTION]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconSand}`}><TerminalSquare size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[IDEA]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconGold}`}><Lightbulb size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[GOAL]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconGray}`}><Target size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[DATABASE]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconDarkGray}`}><Database size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[SECURITY]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconSlate}`}><Shield size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[USER]') {
            parts.push(<span key={idx++} className={`${styles.inlineIconWrapper} ${styles.iconSand}`}><User size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper.startsWith('[STEP')) {
            const num = raw.match(/\d+/)[0];
            parts.push(
                <span key={idx++} className={styles.stepBadge}>
                    {num}
                </span>
            );
        }
        last = match.index + raw.length;
    }
    if (last < text.length) {
        parts.push(<span key={idx++}>{text.slice(last)}</span>);
    }
    return parts;
}
