import React from 'react';

/**
 * renderStructuredText
 * Renders AI-generated text as a clean bullet list.
 * Supports [SPLIT] separator, bullet •, and sentence-splitting as fallback.
 */
export const renderStructuredText = (text) => {
    if (!text) return null;

    const textStr = String(text).replace(/\|/g, '').trim();

    // Split by [SPLIT], bullets, or fallback to sentences
    let items = textStr
        .split(/\[SPLIT\]|•|(\.,)/)
        .map(t => t?.trim())
        .filter(t => t && t !== '.,');

    if (items.length <= 1) {
        const sentenceSplit = textStr.split(/\. (?=[A-Z])/);
        if (sentenceSplit.length > 1) items = sentenceSplit;
        else return <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{textStr}</p>;
    }

    return (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {items.map((item, idx) => {
                const sanitizedItem = item.replace(/[.,]$/, '').trim();
                const parts = sanitizedItem.split(/(\*\*.*?\*\*)/);
                return (
                    <li
                        key={idx}
                        style={{
                            position: 'relative',
                            paddingLeft: '1.5rem',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            color: 'var(--text-secondary)',
                        }}
                    >
                        <span style={{
                            position: 'absolute',
                            left: 0,
                            color: 'var(--secondary)',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            top: '-1px',
                        }}>•</span>
                        {parts.map((part, pIdx) =>
                            part.startsWith('**') && part.endsWith('**')
                                ? <strong key={pIdx} style={{ color: 'var(--secondary)' }}>{part.slice(2, -2)}</strong>
                                : part
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
