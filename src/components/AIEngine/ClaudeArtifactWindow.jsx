import React from 'react';
import { Maximize2, Minimize2, Copy, Check, Code, FileText, Layout } from 'lucide-react';
import styles from './ClaudeArtifactWindow.module.css';
import dynamic from 'next/dynamic';
import CodeBlock from './CodeBlock';

// Dynamic import of MarkdownRenderer to prevent circular dependency
const MarkdownRenderer = dynamic(() => import('./MarkdownRenderer'), { ssr: false });

export default function ClaudeArtifactWindow({ type, title, content }) {
    const getIcon = () => {
        const t = (type || '').toLowerCase();
        if (t === 'code' || t === 'javascript' || t === 'python') return <Code size={16} className={styles.typeIcon} />;
        if (t === 'html' || t === 'react' || t === 'ui') return <Layout size={16} className={styles.typeIcon} />;
        return <FileText size={16} className={styles.typeIcon} />;
    };



    const cleanContent = (content) => {
        let cleaned = (content || '').trim();
        // If the AI wrapped the entire markdown content in ```markdown ... ```, strip it
        // Handle incomplete streams where closing ``` might be missing
        if (cleaned.startsWith('```markdown')) {
            cleaned = cleaned.replace(/^```markdown\s*\n/i, '');
            if (cleaned.endsWith('```')) {
                cleaned = cleaned.replace(/\n\s*```$/i, '');
            }
            cleaned = cleaned.trim();
        } else if (cleaned.startsWith('```') && !['code', 'html', 'react'].includes((type || '').toLowerCase())) {
            cleaned = cleaned.replace(/^```[a-z]*\s*\n/i, '');
            if (cleaned.endsWith('```')) {
                cleaned = cleaned.replace(/\n\s*```$/i, '');
            }
            cleaned = cleaned.trim();
        }
        return cleaned;
    };

    const renderCodeBlock = () => {
        let actualLang = type === 'code' ? 'javascript' : type;
        let actualCode = content || '';
        
        // Remove outer markdown fences even if there is trailing text
        const match = actualCode.match(/```([a-z0-9\-]*)\s*\n([\s\S]*?)(?:```|$)/i);
        if (match) {
            actualLang = match[1] || actualLang;
            actualCode = match[2].trim();
        }

        return <CodeBlock lang={actualLang} code={actualCode} />;
    };

    return (
        <div className={styles.artifactWrapper}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    {getIcon()}
                    <span className={styles.titleText}>{title || 'Artifact'}</span>
                </div>
            </div>
            <div className={styles.contentArea}>
                {type === 'code' || type === 'html' || type === 'react' ? (
                    renderCodeBlock()
                ) : (
                    <div className={styles.markdownArea}>
                        <MarkdownRenderer content={cleanContent(content)} />
                    </div>
                )}
            </div>
        </div>
    );
}
