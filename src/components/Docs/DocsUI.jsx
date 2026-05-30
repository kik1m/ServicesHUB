import React from 'react';
import Link from 'next/link';
import { Info, AlertTriangle, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import styles from '../../app/docs/docsContent.module.css';

export const DocsCallout = ({ type = 'info', title, children }) => {
    const icons = {
        info: <Info size={24} className={styles.calloutIcon} color="#3b82f6" />,
        warning: <AlertTriangle size={24} className={styles.calloutIcon} color="#f59e0b" />,
        success: <CheckCircle size={24} className={styles.calloutIcon} color="#10b981" />
    };

    return (
        <div className={`${styles.callout} ${styles[type]}`}>
            {icons[type]}
            <div className={styles.calloutContent}>
                {title && <strong>{title}</strong>}
                <div>{children}</div>
            </div>
        </div>
    );
};

export const DocsImage = ({ src, alt, caption }) => {
    return (
        <div className={styles.imageWrapper}>
            <img src={src} alt={alt} loading="lazy" />
            {caption && <div className={styles.imageCaption}>{caption}</div>}
        </div>
    );
};

export const DocsNav = ({ prev, next }) => {
    return (
        <div className={styles.docNav}>
            {prev ? (
                <Link href={prev.href} className={`${styles.navBtn} ${styles.prev}`}>
                    <span className={styles.navLabel}>Previous</span>
                    <span className={styles.navTitle}>
                        <ChevronLeft size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                        {prev.title}
                    </span>
                </Link>
            ) : <div />}

            {next ? (
                <Link href={next.href} className={`${styles.navBtn} ${styles.next}`}>
                    <span className={styles.navLabel}>Next</span>
                    <span className={styles.navTitle}>
                        {next.title}
                        <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                    </span>
                </Link>
            ) : <div />}
        </div>
    );
};

export const DocsFAQ = ({ children }) => {
    return (
        <div className={styles.faqSection}>
            <h2 className={styles.faqHeader}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
                {children}
            </div>
        </div>
    );
};

export const DocsFAQItem = ({ question, children }) => {
    return (
        <details className={styles.faqItem}>
            <summary className={styles.faqQuestion}>
                {question}
            </summary>
            <div className={styles.faqAnswer}>
                {children}
            </div>
        </details>
    );
};
