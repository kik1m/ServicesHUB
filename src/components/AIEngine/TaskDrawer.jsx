'use client';
import React from 'react';
import { X, CheckSquare, Square, ExternalLink, Play } from 'lucide-react';
import styles from './TaskDrawer.module.css';

/**
 * TaskDrawer
 * Slide-in panel showing full task details, completion toggle, tool info, and notes.
 * Extracted from the `renderDrawer()` function inside WorkflowWorkspace.
 *
 * @param {object}   task                    - selectedTask object
 * @param {boolean}  isMobile                - responsive layout flag
 * @param {function} onClose                 - close handler
 * @param {function} onToggleComplete        - (phaseId, taskId) toggle completion
 * @param {function} onSaveNotes             - (phaseId, taskId, notes) save notes
 */
export default function TaskDrawer({
    task,
    isMobile = false,
    onClose,
    onToggleComplete,
    onSaveNotes,
}) {
    if (!task) return null;

    const isCompleted = task.status === 'completed';

    return (
        <div
            className={`${styles.backdrop} ${isMobile ? styles.backdropMobile : ''}`}
            onClick={onClose}
        >
            <div
                className={`${styles.panel} ${isMobile ? styles.panelMobile : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header ── */}
                <div className={styles.header}>
                    <div className={styles.headerMeta}>
                        <span className={styles.badge}>Task Details</span>
                        <h3 className={styles.title}>{task.title}</h3>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <X size={14} />
                    </button>
                </div>

                {/* ── Completion Toggle ── */}
                <div className={styles.statusRow}>
                    <div className={styles.statusLeft}>
                        <span
                            className={`${styles.checkIcon} ${isCompleted ? styles.completedIcon : styles.pendingIcon}`}
                            onClick={() => onToggleComplete(task.phaseId, task.id)}
                        >
                            {isCompleted ? <CheckSquare size={20} /> : <Square size={20} />}
                        </span>
                        <div>
                            <span className={styles.statusLabel}>Completion Status</span>
                            <span className={styles.statusSubLabel}>
                                {isCompleted ? 'Completed' : 'Pending'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Description ── */}
                <div className={styles.descSection}>
                    <h4 className={styles.descLabel}>Description & Action Items</h4>
                    <p className={styles.descText}>{task.description}</p>
                </div>

                {/* ── Recommended Tool ── */}
                {task.tool && (
                    <div className={styles.toolCard}>
                        <div className={styles.toolCardHeader}>
                            <div className={styles.toolName}>
                                <span className={styles.toolDot} />
                                <strong>Suggested Tool: {task.tool.name}</strong>
                            </div>
                            {task.tool.url && (
                                <a
                                    href={task.tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.toolLink}
                                >
                                    <span>Visit Website</span>
                                    <ExternalLink size={10} />
                                </a>
                            )}
                        </div>
                        <div className={styles.toolGuideBox}>
                            <span className={styles.toolGuideLabel}>
                                <Play size={10} className={styles.playIcon} />
                                Onboarding & Integration Guide:
                            </span>
                            {/<[a-z][\s\S]*>/i.test(task.tool.guide) ? (
                                <div 
                                    className={styles.formattedHtmlContent}
                                    dangerouslySetInnerHTML={{ __html: task.tool.guide }}
                                />
                            ) : (
                                <p className={styles.toolGuideText}>{task.tool.guide}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Notes / Outputs ── */}
                <div className={styles.notesSection}>
                    <h4 className={styles.notesLabel}>Task Outputs & Notes</h4>
                    <textarea
                        className={styles.notesTextarea}
                        value={task.notes || ''}
                        onChange={(e) => onSaveNotes(task.phaseId, task.id, e.target.value)}
                        placeholder="Paste tool code, save result links, or take notes here..."
                    />
                    <span className={styles.notesHint}>Saved and synced automatically.</span>
                </div>
            </div>
        </div>
    );
}
