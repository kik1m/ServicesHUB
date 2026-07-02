import React from 'react';
import ReasoningBlock from './ReasoningBlock';

export function parseReasoning(lines, i, elements, key, styles, upperLine, isStreaming = false) {
    if (upperLine.length >= 1 && '[REASONING]'.startsWith(upperLine) && upperLine !== '[REASONING]') {
        // Partially streamed [REASONING] tag — show a live thinking indicator
        elements.push(
            <ReasoningBlock key={key()} content="" isStreaming={true} />
        );
        return i + 1;
    }

    if (upperLine === '[REASONING]') {
        const reasoningLines = [];
        let curr = i + 1;
        let foundClose = false;
        while (curr < lines.length) {
            const subUpper = lines[curr].trim().toUpperCase();
            if (subUpper === '[/REASONING]') { foundClose = true; break; }
            if (subUpper.length >= 2 && '[/REASONING]'.startsWith(subUpper)) { foundClose = true; break; }
            reasoningLines.push(lines[curr]);
            curr++;
        }
        // ✅ The caller (parseMarkdownElements) passes isStreaming || hasOpenStreamingReasoning.
        // So we trust isStreaming directly — it accounts for both closed + open-streaming blocks.
        const streaming = isStreaming;
        elements.push(<ReasoningBlock key={key()} content={reasoningLines.join('\n')} isStreaming={streaming} />);
        if (curr < lines.length && lines[curr].trim().toUpperCase() === '[/REASONING]') curr++;
        return curr;
    }

    return i;
}
