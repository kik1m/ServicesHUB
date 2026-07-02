'use client';
import React from 'react';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import styles from './AIEngineWorkspace.module.css';

/**
 * CanvasToolbar
 * Floating bottom-left zoom / recenter controls.
 * Used by both WorkflowWorkspace and DatabaseWorkspace.
 *
 * @param {number}   zoom         - current zoom level (0.25 – 2.0)
 * @param {function} onZoomIn     - zoom in handler
 * @param {function} onZoomOut    - zoom out handler
 * @param {function} onRecenter   - recenter canvas handler
 * @param {string}   [accentColor] - color for the zoom % label (default: '#00d2ff')
 */
export default function CanvasToolbar({
    zoom,
    onZoomIn,
    onZoomOut,
    onRecenter,
    accentColor = '#00d2ff',
}) {
    return (
        <div className={styles.toolbar}>
            <button
                className={styles.toolbarBtn}
                onClick={onZoomOut}
                title="Zoom Out"
            >
                <ZoomOut size={16} />
            </button>

            <span
                className={styles.toolbarZoom}
                style={{ color: accentColor }}
            >
                {Math.round(zoom * 100)}%
            </span>

            <button
                className={styles.toolbarBtn}
                onClick={onZoomIn}
                title="Zoom In"
            >
                <ZoomIn size={16} />
            </button>

            <div className={styles.toolbarSep} />

            <button
                className={styles.toolbarRecenter}
                onClick={onRecenter}
                title="Recenter Diagram"
            >
                <Maximize size={14} />
                <span>Recenter</span>
            </button>
        </div>
    );
}
