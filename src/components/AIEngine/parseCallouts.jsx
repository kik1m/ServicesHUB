import React from 'react';
import Callout from './Callout';
import { renderInline } from './MarkdownInlineElements';
import styles from './Callout.module.css';

export function parseCallouts(lines, i, elements, key, strippedLine) {
    const calloutMatch = strippedLine.match(/^\[\s*CALLOUT\s*:\s*(.+?)\s*\]/i) || strippedLine.match(/^\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION|SUCCESS)\]/i);
    if (!calloutMatch) return i;

    const type = (calloutMatch[1] || calloutMatch[2] || 'NOTE').toUpperCase();
    const calloutLines = [];
    
    const restOfLine = strippedLine.replace(/^\[\s*CALLOUT\s*:\s*(.+?)\s*\]/i, '').replace(/^\[!(NOTE|WARNING|IMPORTANT|TIP|CAUTION|SUCCESS)\]/i, '').trim();
    if (restOfLine) calloutLines.push(restOfLine);

    let curr = i + 1;
    while (curr < lines.length) {
        const subStripped = lines[curr].replace(/^[>\s]+/, '').trim();
        const subUpper = subStripped.toUpperCase();
        if (subUpper === '[/CALLOUT]') break;
        if (!calloutMatch[0].toUpperCase().includes('CALLOUT') && subStripped === '') {
            const nextLine = lines[curr+1] || '';
            if (!nextLine.trim().startsWith('>')) break;
        }
        if (subStripped !== '') calloutLines.push(subStripped);
        curr++;
    }
    const isArabic = /[\u0600-\u06FF]/.test(calloutLines.join(''));
    elements.push(
        <Callout key={key()} type={type} isArabic={isArabic}>
            {calloutLines.map((l, idx) => <div key={idx} className={styles.calloutLine}>{renderInline(l)}</div>)}
        </Callout>
    );
    const nextStripped = curr < lines.length ? lines[curr].replace(/^[>\s]+/, '').trim().toUpperCase() : '';
    if (nextStripped === '[/CALLOUT]') curr++;
    
    return curr;
}
