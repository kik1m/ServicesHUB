import React from 'react';
import { renderInline } from './MarkdownInlineElements';

export function parseUnorderedList(lines, i, elements, key, styles) {
    const listItems = [];
    let curr = i;
    while (curr < lines.length) {
        if (lines[curr].match(/^[\s]*[-*•]\s/)) {
            const indentMatch = lines[curr].match(/^[\s]+/);
            const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
            const itemText = lines[curr].replace(/^[\s]*[-*•]\s/, '');
            listItems.push(<li key={key()} style={{ marginInlineStart: `${indentLevel * 1.5}rem` }}>{renderInline(itemText)}</li>);
            curr++;
        } else if (lines[curr].trim() === '' && curr + 1 < lines.length && lines[curr+1].match(/^[\s]*[-*•]\s/)) {
            curr++;
        } else {
            break;
        }
    }
    elements.push(<ul key={key()} className={styles.mdUl}>{listItems}</ul>);
    return curr;
}

export function parseOrderedList(lines, i, elements, key, styles) {
    const listItems = [];
    let curr = i;
    while (curr < lines.length) {
        if (lines[curr].match(/^[\s]*\d+\.\s/)) {
            const indentMatch = lines[curr].match(/^[\s]+/);
            const indentLevel = indentMatch ? Math.floor(indentMatch[0].length / 2) : 0;
            const itemText = lines[curr].replace(/^[\s]*\d+\.\s/, '');
            listItems.push(<li key={key()} style={{ marginInlineStart: `${indentLevel * 1.5}rem` }}>{renderInline(itemText)}</li>);
            curr++;
        } else if (lines[curr].trim() === '' && curr + 1 < lines.length && lines[curr+1].match(/^[\s]*\d+\.\s/)) {
            curr++;
        } else {
            break;
        }
    }
    elements.push(<ol key={key()} className={styles.mdOl}>{listItems}</ol>);
    return curr;
}
