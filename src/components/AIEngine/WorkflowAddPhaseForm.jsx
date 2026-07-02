'use client';
import React, { useState } from 'react';
import styles from './WorkflowAddPhaseForm.module.css';

/**
 * WorkflowAddPhaseForm
 * Floating popover form for manually adding a new workflow phase.
 *
 * @param {function} onSubmit  - (title: string, desc: string) => void
 * @param {function} onCancel  - close without saving
 */
export default function WorkflowAddPhaseForm({ onSubmit, onCancel }) {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (!title.trim()) { onCancel(); return; }
        onSubmit(title.trim(), desc.trim());
        setTitle('');
        setDesc('');
    };

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>
                ➕ Add New Phase Manually
            </h4>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Phase Title (e.g. Performance Testing)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={styles.input}
                />
                <textarea
                    placeholder="Brief description of phase goals..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className={styles.textarea}
                />
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelBtn}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={styles.submitBtn}
                    >
                        Add
                    </button>
                </div>
            </form>
        </div>
    );
}
