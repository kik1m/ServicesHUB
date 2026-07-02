'use client';
import React from 'react';
import { X } from 'lucide-react';
import AIEngineSkeleton from './AIEngineSkeleton';
import styles from './WorkflowChatOverlay.module.css';

/**
 * WorkflowChatOverlay
 * The floating glassmorphic right-side AI chat panel.
 *
 * @param {function} onClose          - close handler
 * @param {boolean}  messagesLoading  - show skeleton while loading history
 * @param {ReactNode} children        - WorkflowChatWidget rendered inside
 */
export default function WorkflowChatOverlay({ onClose, messagesLoading, children }) {
    return (
        <div className={styles.container}>
            <div className={styles.innerWrapper}>
                {/* ── Chat Panel Header ── */}
                <div className={styles.header}>
                    <div className={styles.statusRow}>
                        <span className={styles.statusDot} />
                        <h3 className={styles.headerTitle}>
                            Smart Development Assistant
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className={styles.closeBtn}
                        aria-label="Close Chat Panel"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* ── Chat Content ── */}
                <div className={styles.contentWrapper}>
                    {messagesLoading ? (
                        <div className={styles.skeletonContainer}>
                            <AIEngineSkeleton />
                        </div>
                    ) : children}
                </div>
            </div>
        </div>
    );
}
