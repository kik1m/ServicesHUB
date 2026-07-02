import React from 'react';
import { GripVertical } from 'lucide-react';
import Skeleton from '../ui/Skeleton';
import styles from './TableNode.module.css';

/**
 * TableNode
 * Single draggable database table card on the DatabaseWorkspace canvas.
 */
function TableNode({ table, position, isDragging, onPointerDown, isLoading }) {
    if (isLoading) {
        return (
            <div
                className={styles.node}
                style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: 5 }}
            >
                {/* Skeleton Header */}
                <div className={styles.nodeHeader} style={{ cursor: 'default' }}>
                    <Skeleton width="12px" height="12px" />
                    <Skeleton width="120px" height="16px" style={{ marginLeft: '8px' }} />
                </div>
                {/* Skeleton Desc */}
                <Skeleton width="100%" height="12px" style={{ marginTop: '8px', marginBottom: '8px' }} />
                {/* Skeleton Columns */}
                <div className={styles.columnsList} style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={styles.columnRow}>
                        <Skeleton width="60%" height="12px" />
                        <Skeleton width="30%" height="12px" />
                    </div>
                    <div className={styles.columnRow}>
                        <Skeleton width="50%" height="12px" />
                        <Skeleton width="25%" height="12px" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div
            className={`${styles.node} ${isDragging ? styles.nodeDragging : ''}`}
            style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: isDragging ? 1000 : 5 }}
        >
            {/* ── Grip Header ── */}
            <div
                className={styles.nodeHeader}
                onPointerDown={(e) => onPointerDown(table.name, e)}
            >
                <GripVertical size={12} className={styles.gripIcon} />
                <h4 className={styles.nodeTitle}>
                    <span className={styles.tableBadge}>TABLE</span>
                    <span>{table.name}</span>
                </h4>
            </div>

            {/* ── Description ── */}
            <p className={styles.nodeDesc}>{table.desc}</p>

            {/* ── Columns ── */}
            <div className={styles.columnsList}>
                {table.columns.map(col => {
                    const isPK = col.desc?.includes('Primary Key');
                    const isFK = col.desc?.includes('Foreign Key');

                    return (
                        <div
                            key={col.name}
                            className={`${styles.columnRow} ${
                                isPK ? styles.columnRowPK :
                                isFK ? styles.columnRowFK :
                                styles.columnRowDefault
                            }`}
                        >
                            <div className={styles.columnHeader}>
                                <span className={`${styles.columnName} ${isPK ? styles.columnNamePK : styles.columnNameDefault}`}>
                                    {isPK && '🔑 '}{col.name}
                                </span>
                                <span className={`${styles.columnType} ${
                                    isPK ? styles.columnTypePK :
                                    isFK ? styles.columnTypeFK :
                                    styles.columnTypeDefault
                                }`}>
                                    {col.type}
                                </span>
                            </div>
                            <span className={styles.columnDesc}>{col.desc}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TableNode;
