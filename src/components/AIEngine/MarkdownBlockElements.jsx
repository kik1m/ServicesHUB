import React from 'react';
import { renderInline } from './MarkdownInlineElements';
import styles from './MarkdownRenderer.module.css';

// ReasoningBlock is now a standalone premium component
export { default as ReasoningBlock } from './ReasoningBlock';

// ─────────────────────────────────────────────────────────────
// 🔵 Markdown Table Component
// ─────────────────────────────────────────────────────────────
export function MarkdownTable({ lines }) {
    if (!lines || lines.length < 2) return null;

    const parseRow = (rowStr) => {
        let cleaned = rowStr.trim().replace(/^\||\|$/g, '');
        // Protect pipes inside tool cards so they don't break table columns
        cleaned = cleaned.replace(/\[\s*(?:EXTERNAL_TOOL_CARD|TOOL_CARD)\s*:.*?\]/gi, (match) => {
            return match.replace(/\|/g, '__PIPE__');
        });
        return cleaned.split('|').map(cell => cell.trim().replace(/__PIPE__/g, '|'));
    };

    const headers = parseRow(lines[0]);
    const dataRows = lines.slice(2).map(parseRow);

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.mdTable}>
                <thead>
                    <tr>
                        {headers.map((h, idx) => (
                            <th key={idx}>{renderInline(h, true)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((row, rIdx) => (
                        <tr key={rIdx}>
                            {row.map((cell, cIdx) => (
                                <td key={cIdx}>{renderInline(cell, true)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
