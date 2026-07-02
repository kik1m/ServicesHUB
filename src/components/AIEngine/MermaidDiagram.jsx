'use client';
import React from 'react';
import { useMermaidDiagram } from '../../hooks/useMermaidDiagram';
import CodeBlock from './CodeBlock';
import styles from './MermaidDiagram.module.css';

/**
 * MermaidDiagram
 * Renders graph structures dynamically using the mermaid parser engine.
 * Refactored to be a pure presentational component.
 */
export default function MermaidDiagram({ chart }) {
    const { svg, error } = useMermaidDiagram(chart);

    // Fallback: show raw code if render fails
    if (error) {
        return <CodeBlock lang="mermaid (Syntax Error)" code={chart} />;
    }

    // Loading state
    if (!svg) {
        return (
            <div className={styles.loaderContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.spinner}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                <span className={styles.loaderText}>Rendering diagram...</span>
            </div>
        );
    }

    return (
        <div
            className={styles.diagramWrapper}
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
