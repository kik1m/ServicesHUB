import React from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { useCodeBlockLogic } from '../../hooks/useCodeBlockLogic';
import styles from './CodeBlock.module.css';

export default function CodeBlock({ lang, code }) {
    const { copied, viewMode, setViewMode, handleCopy } = useCodeBlockLogic(code);

    const safeLang = (lang || '').toString().trim().replace(/[\r\n]/g, '').toLowerCase();
    const isHtml = safeLang.includes('html') || code.trim().startsWith('<');

    return (
        <div className={styles.codeBlockWrapper}>
            <div className={styles.codeHeader}>
                <div className={styles.codeLangInfo}>
                    <Terminal size={14} className={styles.terminalIcon} />
                    <span>{lang || 'Text'}</span>
                </div>
                <div className={styles.headerActions}>
                    {isHtml && (
                        <div className={styles.viewToggle}>
                            <button 
                                className={`${styles.toggleBtn} ${viewMode === 'code' ? styles.active : ''}`}
                                onClick={() => setViewMode('code')}
                            >
                                Code
                            </button>
                            <button 
                                className={`${styles.toggleBtn} ${viewMode === 'preview' ? styles.active : ''}`}
                                onClick={() => setViewMode('preview')}
                            >
                                Preview
                            </button>
                        </div>
                    )}
                    <button className={styles.copyBtn} onClick={handleCopy} title="Copy code">
                        {copied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                </div>
            </div>
            
            {viewMode === 'preview' ? (
                <div className={styles.previewContainer}>
                    <iframe 
                        srcDoc={code}
                        title="HTML Preview" 
                        className={styles.previewIframe}
                        sandbox="allow-scripts allow-forms"
                    />
                </div>
            ) : (
                <div className={styles.codeContent}>
                    <pre>
                        <code className={`language-${lang || 'text'}`}>{code}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}
