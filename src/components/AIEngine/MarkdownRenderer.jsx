import React, { memo, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, Zap, LineChart, Layers, TerminalSquare, Globe, Brain, ChevronDown, ChevronRight, Lightbulb, Target, Database, Shield, User } from 'lucide-react';
import styles from './MarkdownRenderer.module.css';
import SmartToolCard from './SmartToolCard';

// Inline formatting: **bold**, *italic*, `code`, tags
function renderInline(text) {
    if (!text) return null;
    const parts = [];
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[check\]|\[warn\]|\[info\]|\[insight\]|\[metrics\]|\[architecture\]|\[action\]|\[idea\]|\[goal\]|\[database\]|\[security\]|\[user\]|\[step\d+\]|\[\s*TOOL_CARD\s*:.*?\]|\[\s*EXTERNAL_TOOL_CARD\s*:.*?\])/gi;
    let last = 0;
    let match;
    let idx = 0;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
            parts.push(<span key={idx++}>{text.slice(last, match.index)}</span>);
        }
        const raw = match[0];
        const rawUpper = raw.toUpperCase().replace(/\s+/g, ''); // Normalize spaces and case for checking
        
        if (raw.startsWith('**')) {
            parts.push(<strong key={idx++} className={styles.mdBold}>{renderInline(raw.slice(2, -2))}</strong>);
        } else if (raw.startsWith('*')) {
            parts.push(<em key={idx++} className={styles.mdItalic}>{renderInline(raw.slice(1, -1))}</em>);
        } else if (raw.startsWith('`')) {
            parts.push(<code key={idx++} className={styles.mdInlineCode}>{raw.slice(1, -1)}</code>);
        } else if (rawUpper.startsWith('[TOOL_CARD:')) {
            const extractMatch = raw.match(/\[\s*TOOL_CARD\s*:\s*(.+?)\s*\]/i);
            if (extractMatch) {
                const slugRaw = extractMatch[1].trim().replace(/^["'{[\]]+|["'}\]]+$/g, '');
                const slug = slugRaw.split('||')[0].trim();
                parts.push(
                    <span key={idx++} className={styles.mdToolCardWrapper}>
                        <SmartToolCard slug={slug} />
                    </span>
                );
            }
        } else if (rawUpper.startsWith('[EXTERNAL_TOOL_CARD:')) {
            const extractMatch = raw.match(/\[\s*EXTERNAL_TOOL_CARD\s*:\s*(.+?)\s*\]/i);
            if (extractMatch) {
                const dataRaw = extractMatch[1].trim();
                let [name, url, description] = dataRaw.split('||').map(s => s.trim().replace(/^["'{\[]+|["'}\]]+$/g, ''));
                parts.push(
                    <span key={idx++} className={styles.mdToolCardWrapper}>
                        <span className={styles.mdToolCard} dir="auto">
                            <span className={styles.mdToolIconFallback} style={{ backgroundColor: 'rgba(0, 210, 255, 0.1)', color: '#00d2ff' }}>
                                <Globe size={20} />
                            </span>
                            <span className={styles.mdToolInfo}>
                                <strong style={{ fontSize: '1.05rem', margin: '0 0 4px 0', color: '#f1f5f9' }}>{name || 'External Tool'}</strong>
                                {description && <span style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0, lineHeight: 1.4, display: 'block' }}>{description.substring(0, 60)}...</span>}
                                <span className={styles.mdToolBadge} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>External</span>
                            </span>
                            <a href={url || '#'} target="_blank" rel="noopener noreferrer" className={styles.mdToolLink}>
                                Visit
                            </a>
                        </span>
                    </span>
                );
            }
        } else if (rawUpper === '[CHECK]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', margin: '0 6px', verticalAlign: 'text-bottom' }}><CheckCircle2 size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[WARN]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355', margin: '0 6px', verticalAlign: 'text-bottom' }}><AlertTriangle size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[INFO]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', margin: '0 6px', verticalAlign: 'text-bottom' }}><Info size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[INSIGHT]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', margin: '0 6px', verticalAlign: 'text-bottom' }}><Zap size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[METRICS]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', margin: '0 6px', verticalAlign: 'text-bottom' }}><LineChart size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[ARCHITECTURE]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', margin: '0 6px', verticalAlign: 'text-bottom' }}><Layers size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[ACTION]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#a89f91', margin: '0 6px', verticalAlign: 'text-bottom' }}><TerminalSquare size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[IDEA]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#8b7355', margin: '0 6px', verticalAlign: 'text-bottom' }}><Lightbulb size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[GOAL]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', margin: '0 6px', verticalAlign: 'text-bottom' }}><Target size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[DATABASE]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', margin: '0 6px', verticalAlign: 'text-bottom' }}><Database size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[SECURITY]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', margin: '0 6px', verticalAlign: 'text-bottom' }}><Shield size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper === '[USER]') {
            parts.push(<span key={idx++} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#a89f91', margin: '0 6px', verticalAlign: 'text-bottom' }}><User size={16} strokeWidth={1.5} /></span>);
        } else if (rawUpper.startsWith('[STEP')) {
            const num = raw.match(/\d+/)[0];
            parts.push(
                <span key={idx++} style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '18px', height: '18px', borderRadius: '4px', 
                    color: '#8b7355', 
                    fontSize: '12px', fontWeight: '700', margin: '0 6px', 
                    verticalAlign: 'text-bottom', border: '1px solid #8b7355'
                }}>
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

// ─────────────────────────────────────────────────────────────
// 🔵 Reasoning Block Component
// ─────────────────────────────────────────────────────────────
function ReasoningBlock({ content }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={styles.reasoningBlock}>
            <div className={styles.reasoningHeader} onClick={() => setIsOpen(!isOpen)}>
                <Brain size={16} className={styles.reasoningIcon} />
                <span>AI Thought Process</span>
                {isOpen ? <ChevronDown size={14} style={{ marginLeft: 'auto' }} /> : <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
            </div>
            {isOpen && (
                <div className={styles.reasoningContent}>
                    {content.split('\n').map((line, i) => (
                        <p key={i} style={{ margin: '0 0 6px 0', fontSize: '0.85rem' }}>{renderInline(line)}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// 🔵 Markdown Table Component
// ─────────────────────────────────────────────────────────────
function MarkdownTable({ lines }) {
    if (!lines || lines.length < 2) return null;

    const parseRow = (rowStr) => {
        const cleaned = rowStr.trim().replace(/^\||\|$/g, '');
        return cleaned.split('|').map(cell => cell.trim());
    };

    const headers = parseRow(lines[0]);
    const dataRows = lines.slice(2).map(parseRow);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.mdTable}>
                <thead>
                    <tr>
                        {headers.map((h, idx) => (
                            <th key={idx}>{renderInline(h)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                            {row.map((cell, cellIdx) => (
                                <td key={cellIdx}>{renderInline(cell)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// 🔵 Elite Markdown Renderer (Memoized for Translation Immunity)
// ─────────────────────────────────────────────────────────────
const MarkdownRenderer = memo(function MarkdownRenderer({ content }) {
    if (!content) return null;

    // AI often wraps special tags in backticks. Strip them so they render correctly.
    let cleanContent = content.replace(/`(\[\s*(?:TOOL_CARD|EXTERNAL_TOOL_CARD|step\d+|check|warn|info|insight|metrics|architecture|action|idea|goal|database|security|user).*?\])`/gi, '$1');
    
    // AI sometimes wraps tool cards in parentheses like `( [TOOL_CARD:...] )`. Strip the parentheses.
    cleanContent = cleanContent.replace(/\(\s*(\[\s*(?:TOOL_CARD|EXTERNAL_TOOL_CARD).*?\])\s*\)/gi, '$1');

    // Strip backticks around reasoning tags just in case
    cleanContent = cleanContent.replace(/`(\[\/?REASONING\])`/gi, '$1');
    
    // Ensure reasoning tags are strictly on their own lines
    cleanContent = cleanContent.replace(/\[REASONING\]/gi, '\n[REASONING]\n');
    cleanContent = cleanContent.replace(/\[\/REASONING\]/gi, '\n[/REASONING]\n');

    // Fix single-backtick multiline code blocks (e.g. `json \n {...} \n `)
    // Replace a line starting with exactly one backtick (followed by optional language name) with triple backticks
    cleanContent = cleanContent.replace(/^`(\w*)\s*$/gm, '```$1');

    const lines = cleanContent.split('\n');
    const elements = [];
    let i = 0;
    let keyCounter = 0;
    const key = () => keyCounter++;

    while (i < lines.length) {
        const line = lines[i];

        // Fallback for incomplete tags during streaming
        if (line.includes('[TOOL_CARD:') && !line.includes(']')) {
            elements.push(
                <div key={key()} className={styles.mdToolCard} style={{ opacity: 0.7, animation: 'pulse 1.2s ease-in-out infinite' }}>
                    <div className={styles.mdToolIconFallback}>...</div>
                    <div className={styles.mdToolInfo}>
                        <h4>Loading...</h4>
                        <p>Fetching tool details</p>
                    </div>
                </div>
            );
            i++; continue;
        }

        const upperLine = line.trim().toUpperCase();

        // 1. Catch partial opening tag: [R, [REAS, etc.
        if (upperLine.length >= 1 && '[REASONING]'.startsWith(upperLine) && upperLine !== '[REASONING]') {
            elements.push(
                <div key={key()} className={styles.reasoningBlock} style={{opacity: 0.7}}>
                    <div className={styles.reasoningHeader}>
                        <Brain size={16} className={styles.reasoningIcon} style={{ animation: 'pulse 1.5s infinite' }} />
                        <span>Initializing thought process...</span>
                    </div>
                </div>
            );
            i++; continue;
        }

        // 2. Catch partial closing tag: [/R, [/REAS, etc. (Hide it completely)
        if (upperLine.length >= 2 && '[/REASONING]'.startsWith(upperLine) && upperLine !== '[/REASONING]') {
            i++; continue; 
        }

        if (upperLine === '[REASONING]') {
            const reasoningLines = [];
            i++;
            while (i < lines.length) {
                const subUpper = lines[i].trim().toUpperCase();
                if (subUpper === '[/REASONING]') break;
                
                // If it's a partial closing tag at the end of the stream, skip adding it to content
                if (subUpper.length >= 2 && '[/REASONING]'.startsWith(subUpper)) {
                    // Do not push, just break because it's the end of stream being typed
                    break;
                }
                
                reasoningLines.push(lines[i]);
                i++;
            }
            elements.push(<ReasoningBlock key={key()} content={reasoningLines.join('\n')} />);
            if (i < lines.length && lines[i].trim().toUpperCase() === '[/REASONING]') i++; // skip the closing tag
            continue;
        }

        if (line.trim().startsWith('```')) {
            const lang = line.trim().slice(3).trim();
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith('```')) {
                codeLines.push(lines[i]);
                i++;
            }
            elements.push(
                <div key={key()} className={styles.codeBlock}>
                    {lang && <span className={styles.codeLang}>{lang}</span>}
                    <pre><code>{codeLines.join('\n')}</code></pre>
                </div>
            );
            i++;
            continue;
        }

        if (line.trim().startsWith('|') && line.includes('|')) {
            const tableLines = [];
            while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].includes('|')) {
                tableLines.push(lines[i]);
                i++;
            }
            elements.push(<MarkdownTable key={key()} lines={tableLines} />);
            continue;
        }

        if (line.startsWith('###### ')) { elements.push(<h6 key={key()} className={styles.mdH6}>{renderInline(line.slice(7))}</h6>); i++; continue; }
        if (line.startsWith('##### ')) { elements.push(<h5 key={key()} className={styles.mdH5}>{renderInline(line.slice(6))}</h5>); i++; continue; }
        if (line.startsWith('#### ')) { elements.push(<h4 key={key()} className={styles.mdH4}>{renderInline(line.slice(5))}</h4>); i++; continue; }
        if (line.startsWith('### ')) { elements.push(<h3 key={key()} className={styles.mdH3}>{renderInline(line.slice(4))}</h3>); i++; continue; }
        if (line.startsWith('## ')) { elements.push(<h2 key={key()} className={styles.mdH2}>{renderInline(line.slice(3))}</h2>); i++; continue; }
        if (line.startsWith('# ')) { elements.push(<h1 key={key()} className={styles.mdH1}>{renderInline(line.slice(2))}</h1>); i++; continue; }

        if (line.match(/^(-{3,}|\*{3,}|_{3,})$/)) {
            elements.push(<hr key={key()} className={styles.mdHr} />);
            i++; continue;
        }

        if (line.match(/^[\s]*[-*•]\s/)) {
            const listItems = [];
            while (i < lines.length) {
                if (lines[i].match(/^[\s]*[-*•]\s/)) {
                    const indentMatch = lines[i].match(/^[\s]+/);
                    const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
                    const itemText = lines[i].replace(/^[\s]*[-*•]\s/, '');
                    listItems.push(<li key={key()} style={{ marginLeft: `${indentLevel * 1.5}rem` }}>{renderInline(itemText)}</li>);
                    i++;
                } else if (lines[i].trim() === '' && i + 1 < lines.length && lines[i+1].match(/^[\s]*[-*•]\s/)) {
                    i++; // skip empty line
                } else {
                    break;
                }
            }
            elements.push(<ul key={key()} className={styles.mdUl}>{listItems}</ul>);
            continue;
        }

        if (line.match(/^[\s]*\d+\.\s/)) {
            const listItems = [];
            while (i < lines.length) {
                if (lines[i].match(/^[\s]*\d+\.\s/)) {
                    const indentMatch = lines[i].match(/^[\s]+/);
                    const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
                    const itemText = lines[i].replace(/^[\s]*\d+\.\s/, '');
                    listItems.push(<li key={key()} style={{ marginLeft: `${indentLevel * 1.5}rem` }}>{renderInline(itemText)}</li>);
                    i++;
                } else if (lines[i].trim() === '' && i + 1 < lines.length && lines[i+1].match(/^[\s]*\d+\.\s/)) {
                    i++; // skip empty line
                } else {
                    break;
                }
            }
            elements.push(<ol key={key()} className={styles.mdOl}>{listItems}</ol>);
            continue;
        }

        if (line.startsWith('> ')) {
            elements.push(
                <blockquote key={key()} className={styles.mdBlockquote}>
                    {renderInline(line.slice(2))}
                </blockquote>
            );
            i++; continue;
        }

        if (line.trim() === '') {
            elements.push(<div key={key()} className={styles.mdSpacer} />);
            i++; continue;
        }

        elements.push(<p key={key()} className={styles.mdP}>{renderInline(line)}</p>);
        i++;
    }

    return <div className={styles.markdownBody}>{elements}</div>;
});

export default MarkdownRenderer;
