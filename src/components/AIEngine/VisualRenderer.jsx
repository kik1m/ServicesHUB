'use client';
import React from 'react';
import { useVisualRenderer } from '../../hooks/useVisualRenderer';
import VisualStreamingSkeleton from './VisualStreamingSkeleton';
import styles from './VisualRenderer.module.css';

/**
 * VisualRenderer
 * Sandbox iframe rendering visual HTML elements or managing structural blueprints.
 * Refactored to be presentational, using custom hooks.
 */
export default function VisualRenderer({ code, onWorkflowStateUpdate, messageId }) {
    const {
        iframeRef,
        height,
        status,
        setStatus,
        setErrorMsg,
        errorMsg,
        handleRetry,
        isJson,
        srcDoc
    } = useVisualRenderer({ code, onWorkflowStateUpdate, messageId });

    if (!code?.trim()) return null;

    if (isJson) {
        const isWorkflowPage = typeof window !== 'undefined' && window.location.pathname.includes('/workflow');
        if (isWorkflowPage) {
            return (
                <div className={styles.workflowNotice} dir="ltr">
                    <span className={styles.workflowNoticeIcon}>🚀</span>
                    <span>Workflow plan has been updated and is active on the main workspace.</span>
                </div>
            );
        }

        let parsed = null;
        try {
            parsed = typeof code === 'string' ? JSON.parse(code) : code;
        } catch (e) {}

        return (
            <div className={styles.blueprintPreview} dir="ltr">
                <h4 className={styles.previewTitle}>📋 Generated Project Blueprint</h4>
                {parsed?.projectName && <h5 className={styles.previewName}>{parsed.projectName}</h5>}
                {parsed?.description && <p className={styles.previewDesc}>{parsed.description}</p>}
                
                {parsed?.phases?.length > 0 && (
                    <div className={styles.previewPhases}>
                        {parsed.phases.map((phase, idx) => (
                            <div key={idx} className={styles.previewPhaseCard}>
                                <div className={styles.previewPhaseHeader}>
                                    <span className={styles.previewPhaseBadge} style={{ backgroundColor: `${phase.accentColor || '#00d2ff'}22`, color: phase.accentColor || '#00d2ff', borderColor: phase.accentColor || '#00d2ff' }}>
                                        Phase {idx + 1}
                                    </span>
                                    <span className={styles.previewPhaseTitle}>{phase.title}</span>
                                </div>
                                <p className={styles.previewPhaseDesc}>{phase.description}</p>
                                {phase.tasks?.length > 0 && (
                                    <span className={styles.previewTasksCount}>
                                        🛠️ {phase.tasks.length} actionable tasks
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={styles.container} style={{ height: status === 'loading' ? '200px' : `${height}px` }}>
            {/* Loading skeleton */}
            <div
                className={styles.skeletonContainer}
                style={{
                    opacity: status === 'loading' ? 1 : 0,
                    pointerEvents: status === 'loading' ? 'auto' : 'none',
                }}
            >
                <VisualStreamingSkeleton absolute code={code} />
            </div>

            {/* Error state */}
            {status === 'error' && (
                <div className={styles.errorBox}>
                    <span className={styles.errorTitle}>⚠ Failed to render visual component</span>
                    <span className={styles.errorMsg}>{errorMsg}</span>
                    <button className={styles.retryBtn} onClick={handleRetry}>
                        Retry
                    </button>
                </div>
            )}

            {/* The actual iframe */}
            <iframe
                ref={iframeRef}
                srcDoc={srcDoc}
                sandbox="allow-scripts allow-forms"
                loading="lazy"
                className={styles.iframe}
                style={{
                    height: `${height}px`,
                    opacity: status === 'loading' ? 0 : 1,
                }}
                title="HUBly Visual Component"
                onError={() => { setStatus('error'); setErrorMsg('iframe failed to load'); }}
            />
        </div>
    );
}
