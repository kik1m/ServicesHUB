import React from 'react';
import { renderInline } from './MarkdownInlineElements';
import { parseReasoning } from './parseReasoning';
import { parseVisualBlock } from './parseVisualBlock';
import { parseCallouts } from './parseCallouts';
import { parseCodeAndMermaid } from './parseCodeAndMermaid';
import { parseTable } from './parseTable';
import { parseUnorderedList, parseOrderedList } from './parseLists';

export function parseMarkdownElements(content, styles, isStreaming = false, onWorkflowStateUpdate, messageId, onArtifactUpdate) {
    if (!content) return [];

    let cleanContent = content.replace(/`(\[\s*\/?\s*REASONING\s*\])`/gi, '$1');
    cleanContent = cleanContent.replace(/\*\*(\[\s*\/?\s*REASONING\s*\])\*\*/gi, '$1');
    cleanContent = cleanContent.replace(/\[\s*REASONING\s*\]/gi, '\n[REASONING]\n');
    cleanContent = cleanContent.replace(/\[\s*\/\s*REASONING\s*\]/gi, '\n[/REASONING]\n');
    cleanContent = cleanContent.replace(/`(\[\s*\/?\s*CALLOUT\s*\])`/gi, '$1');
    cleanContent = cleanContent.replace(/\*\*(\[\s*\/?\s*CALLOUT\s*\])\*\*/gi, '$1');
    cleanContent = cleanContent.replace(/\[\s*CALLOUT\s*\]/gi, '\n[CALLOUT]\n');
    cleanContent = cleanContent.replace(/\[\s*\/\s*CALLOUT\s*\]/gi, '\n[/CALLOUT]\n');
    cleanContent = cleanContent.replace(/^`(\w*)\s*$/gm, '```$1');

    // ✅ FIX: Merge multiple [REASONING] blocks into one.
    // When the AI uses multiple tool calls or continuations, each pass may inject
    // a new [REASONING] block. We consolidate them all into a single block.
    const allReasoningBlocks = [];
    cleanContent = cleanContent.replace(
        /\[REASONING\]([\s\S]*?)\[\/REASONING\]/gi,
        (_, inner) => { allReasoningBlocks.push(inner.trim()); return ''; }
    );
    // Also handle an unclosed [REASONING] block that is still streaming
    const openReasoningMatch = cleanContent.match(/\[REASONING\]([\s\S]*)$/i);
    let hasOpenStreamingReasoning = false;
    if (openReasoningMatch) {
        allReasoningBlocks.push(openReasoningMatch[1].trim());
        cleanContent = cleanContent.slice(0, cleanContent.search(/\[REASONING\]/i));
        hasOpenStreamingReasoning = isStreaming;
    }
    if (allReasoningBlocks.length > 0) {
        const mergedReasoning = allReasoningBlocks.join('\n\n---\n\n');
        cleanContent = `\n[REASONING]\n${mergedReasoning}\n[/REASONING]\n${cleanContent.trimStart()}`;
    }

    // ── VISUAL BLOCK UNWRAPPER ─────────────────────────────────────────────────
    // If AI wraps <<<VISUAL_START>>> inside ```...``` code fences, strip the fences.
    // This is the most common cause of visual components showing as plain text.
    cleanContent = cleanContent.replace(
        /```[\w]*\s*\n([\s\S]*?<<<VISUAL_START>>>[\s\S]*?<<<VISUAL_END>>>[\s\S]*?)\n```/gi,
        '$1'
    );
    // Also handle case where AI puts VISUAL markers inside single-line backtick blocks
    cleanContent = cleanContent.replace(/`+(<<<VISUAL_START>>>)/gi, '$1');
    cleanContent = cleanContent.replace(/(<<<VISUAL_END>>>)`+/gi, '$1');

    const lines = cleanContent.split('\n');
    const elements = [];
    let i = 0;
    let keyCounter = 0;
    const key = () => keyCounter++;

    while (i < lines.length) {
        const line = lines[i];



        let strippedLine = line.replace(/^[>\s#]+/, '').trim();
        let upperLine = strippedLine.toUpperCase();

        const cleanUpperLine = upperLine.replace(/^(\*\*|\*|__|_)(.*?)(\*\*|\*|__|_)$/, '$2').trim();
        if (cleanUpperLine.startsWith('[')) {
            upperLine = cleanUpperLine;
            strippedLine = line.replace(/^[>\s#]+/, '').replace(/^(\*\*|\*|__|_)/, '').replace(/(\*\*|\*|__|_)$/, '').trim();
        }



        if (upperLine === '[REASONING]' ||
            (upperLine.length >= 4 && '[REASONING]'.startsWith(upperLine))) {
            // Pass hasOpenStreamingReasoning so the block shows as streaming when the original had an unclosed tag
            const nextI = parseReasoning(lines, i, elements, key, styles, upperLine, hasOpenStreamingReasoning);
            if (nextI > i) { i = nextI; continue; }
        }

        if (
            (upperLine.length >= 4 && '[/REASONING]'.startsWith(upperLine)) ||
            (upperLine.length >= 14 && '<<<VISUAL_END>>>'.startsWith(upperLine))
        ) {
            i++; continue;
        }

        // ── VISUAL BLOCK — must be checked BEFORE code fences ──────────────
        if (line.toLowerCase().includes('<<<visual_start>>>')) {
            const nextI = parseVisualBlock(lines, i, elements, key, isStreaming, onWorkflowStateUpdate, messageId, onArtifactUpdate);
            if (nextI > i) { i = nextI; continue; }
        }

        if (line.trim().startsWith('```')) {
            // Skip if this line is wrapping a visual block (AI sometimes wraps in backticks)
            const blockContent = lines.slice(i + 1).join('\n');
            if (blockContent.toLowerCase().includes('<<<visual_start>>>')) {
                // Skip the opening backtick line and let the next iteration catch VISUAL_START
                i++; continue;
            }
            i = parseCodeAndMermaid(lines, i, elements, key, line);
            continue;
        }

        if (line.trim().startsWith('|') && line.includes('|')) {
            i = parseTable(lines, i, elements, key);
            continue;
        }

        // Inline formatting handlers
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
            i = parseUnorderedList(lines, i, elements, key, styles);
            continue;
        }

        if (line.match(/^[\s]*\d+\.\s/)) {
            i = parseOrderedList(lines, i, elements, key, styles);
            continue;
        }

        // ── CALLOUTS (Alerts) ──
        if (strippedLine.match(/^\[\s*CALLOUT\s*:\s*(.+?)\s*\]/i) || strippedLine.match(/^\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION|SUCCESS)\]/i)) {
            const nextI = parseCallouts(lines, i, elements, key, strippedLine);
            if (nextI > i) { i = nextI; continue; }
        }

        if (line.startsWith('> ')) {
            elements.push(<blockquote key={key()} className={styles.mdBlockquote}>{renderInline(line.slice(2))}</blockquote>);
            i++; continue;
        }

        if (line.trim() === '') {
            elements.push(<div key={key()} className={styles.mdSpacer} />);
            i++; continue;
        }

        elements.push(<div key={key()} className={styles.mdP}>{renderInline(line)}</div>);
        i++;
    }

    return elements;
}
