import React, { useCallback, useRef } from 'react';
import { useDatabaseWorkspace } from '../../hooks/useDatabaseWorkspace';
import TableNode from './TableNode';
import CanvasToolbar from './CanvasToolbar';
import styles from './AIEngineWorkspace.module.css';

/**
 * DatabaseWorkspace
 * Renders the proposed database schema nodes and foreign relationships.
 * Refactored to be a pure presentational component.
 */
export default function DatabaseWorkspace({ tables = [], isChatCollapsed = false, isLoading }) {
    const displayTables = tables.length > 0 ? tables : (isLoading ? [
        { name: 'sk_table_1', desc: 'Extracting tables and relationships dynamically...', columns: [] },
        { name: 'sk_table_2', desc: 'Extracting tables and relationships dynamically...', columns: [] },
        { name: 'sk_table_3', desc: 'Extracting tables and relationships dynamically...', columns: [] }
    ] : []);

    const {
        canvas,
        handleRecenter,
        relationships,
        drawRelationPath
    } = useDatabaseWorkspace({ tables: displayTables });

    const {
        zoom,
        pan,
        nodePositions,
        draggingNodeId,
        isPanning,
        viewportRef,
        setZoom,
        handleViewportPointerDown,
        handleNodePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleWheel
    } = canvas;

    const defaultPos = useRef({});
    const getTablePosition = useCallback((tableName, idx) => {
        if (nodePositions[tableName]) return nodePositions[tableName];
        if (!defaultPos.current[tableName]) {
            const PRESETS = {
                users: { x: 1300, y: 150 },
                restaurants: { x: 850, y: 150 },
                menu_items: { x: 400, y: 150 },
                orders: { x: 850, y: 520 },
                order_items: { x: 400, y: 520 },
            };
            defaultPos.current[tableName] = PRESETS[tableName] ?? {
                x: 1300 - (idx % 3) * 450,
                y: 150 + Math.floor(idx / 3) * 370
            };
        }
        return defaultPos.current[tableName];
    }, [nodePositions]);

    return (
        <div className={styles.canvasRoot} dir="ltr">
            <style>{`
                @keyframes relationDash { to { stroke-dashoffset: -20; } }
            `}</style>

            {/* ── Viewport ── */}
            <div
                ref={viewportRef}
                className={styles.canvasViewport}
                style={{ cursor: isPanning || draggingNodeId ? 'grabbing' : 'grab' }}
                onWheel={handleWheel}
                onPointerDown={handleViewportPointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                {/* Scale & Pan */}
                <div
                    className={styles.canvasScaleLayer}
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                >
                    {/* Dot Grid */}
                    <div className={styles.canvasDotGrid} />

                    {/* ── Relation Wires SVG ── */}
                    <svg className={styles.canvasSvg}>
                        {relationships.map((rel, i) => {
                            const d = drawRelationPath(rel);
                            return (
                                <g key={`rel-${i}`}>
                                    <path d={d} fill="none" stroke="rgba(168,85,247,0.08)" strokeWidth="8" strokeLinecap="round" />
                                    <path d={d} fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round"
                                        strokeDasharray="5,5"
                                        className={styles.relationWire}
                                    />
                                </g>
                            );
                        })}
                    </svg>
 
                    {/* ── Table Nodes ── */}
                    <div className={styles.canvasNodesLayer}>
                        {displayTables.map((table, idx) => (
                            <TableNode
                                key={table.name}
                                table={table}
                                position={getTablePosition(table.name, idx)}
                                isDragging={draggingNodeId === table.name}
                                onPointerDown={handleNodePointerDown}
                                isLoading={isLoading && tables.length === 0}
                            />
                        ))}
                    </div>
                </div>
            </div>
 
            {/* ── Floating Header Card ── */}
            <div
                className={styles.headerCard}
                style={{ left: '24px', right: isChatCollapsed ? '24px' : '468px' }}
            >
                <div className={styles.headerRow}>
                    <div
                        className={styles.headerTitle}
                        title="Tables and relationships are extracted and distributed dynamically for database initialization (Supabase/PostgreSQL)"
                    >
                        <h2 className={styles.headerTitleText}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className={styles.headerTitleIconPurple} strokeWidth="2.5">
                                <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                            </svg>
                            <span className={styles.headerTitleSpan}>
                                Proposed Database Schema Blueprint
                            </span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* ── Canvas Toolbar ── */}
            <CanvasToolbar
                zoom={zoom}
                onZoomIn={() => setZoom(z => Math.min(z * 1.15, 2.0))}
                onZoomOut={() => setZoom(z => Math.max(z / 1.15, 0.25))}
                onRecenter={handleRecenter}
                accentColor="#a855f7"
            />
        </div>
    );
}
