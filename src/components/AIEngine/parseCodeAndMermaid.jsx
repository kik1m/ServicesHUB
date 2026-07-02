import React from 'react';
import dynamic from 'next/dynamic';
import CodeBlock from './CodeBlock';

const MermaidDiagram = dynamic(() => import('./MermaidDiagram'), { ssr: false });
const VisualRenderer = dynamic(() => import('./VisualRenderer'), { ssr: false });
import VisualErrorBoundary from './VisualErrorBoundary';

export function parseCodeAndMermaid(lines, i, elements, key, line) {
    const lang = line.trim().slice(3).trim();
    const codeLines = [];
    let curr = i + 1;
    
    while (curr < lines.length && !lines[curr].trim().startsWith('```')) {
        codeLines.push(lines[curr]);
        curr++;
    }
    
    const codeStr = codeLines.join('\n');

    // ── CRITICAL: If code block contains <<<VISUAL_START>>>, extract & render it ──
    const visualMatch = codeStr.match(/<<<VISUAL_START>>>([\s\S]*?)<<<VISUAL_END>>>/i);
    if (visualMatch) {
        const visualCode = visualMatch[1].trim();
        if (visualCode.length > 10) {
            elements.push(
                <VisualErrorBoundary key={key()}>
                    <VisualRenderer code={visualCode} />
                </VisualErrorBoundary>
            );
        }
        curr++;
        return curr;
    }

    const hasStructuralTags = /\[(REASONING)\]/i.test(codeStr) || 
                               /\[TOOL_CARD:/i.test(codeStr) ||
                               /\[EXTERNAL_TOOL_CARD:/i.test(codeStr);

    if (
        lang.toLowerCase() === 'mermaid' || 
        (lang === '' && codeLines.length > 0 && /^(gantt|graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|pie|journey)/i.test(codeLines[0].trim()))
    ) {
        elements.push(<MermaidDiagram key={key()} chart={codeStr} />);

    } else if ((['markdown', 'text', 'plaintext', ''].includes(lang.toLowerCase())) && hasStructuralTags) {
        const MarkdownNestedRenderer = require('./MarkdownRenderer').default;
        elements.push(<MarkdownNestedRenderer key={key()} content={codeStr} />);
    } else {
        elements.push(<CodeBlock key={key()} lang={lang} code={codeStr} />);
    }
    
    curr++; // skip closing backticks
    return curr;
}
