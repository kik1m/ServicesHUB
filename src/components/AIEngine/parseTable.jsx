import React from 'react';
import { MarkdownTable } from './MarkdownBlockElements';

export function parseTable(lines, i, elements, key) {
    const tableLines = [];
    let curr = i;
    while (curr < lines.length && lines[curr].trim().startsWith('|') && lines[curr].includes('|')) {
        tableLines.push(lines[curr]);
        curr++;
    }
    elements.push(<MarkdownTable key={key()} lines={tableLines} />);
    return curr;
}
