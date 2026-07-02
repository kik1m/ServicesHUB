import { useEffect, useCallback, useMemo } from 'react';
import { useCanvasInteraction } from './useCanvasInteraction';

// Default positions for common schema tables to ensure clean visual routing
const PRESET_POSITIONS = {
    users: { x: 1300, y: 150 },
    restaurants: { x: 850, y: 150 },
    menu_items: { x: 400, y: 150 },
    orders: { x: 850, y: 520 },
    order_items: { x: 400, y: 520 },
};

/**
 * useDatabaseWorkspace
 * Custom hook to handle table layouts, foreign relationships, and camera controls.
 */
export function useDatabaseWorkspace({ tables = [] }) {
    const canvas = useCanvasInteraction();
    const { initNodePositions, recenterTo, nodePositions } = canvas;

    // Recenter canvas viewport
    const handleRecenter = useCallback(() => {
        recenterTo(850, 300, 0.85);
    }, [recenterTo]);

    // Position tables nodes when tables are loaded
    useEffect(() => {
        if (tables.length > 0) {
            const entries = tables.map((table, idx) => ({
                id: table.name,
                x: PRESET_POSITIONS[table.name]?.x ?? (1300 - (idx % 3) * 450),
                y: PRESET_POSITIONS[table.name]?.y ?? (150 + Math.floor(idx / 3) * 370),
            }));
            initNodePositions(entries);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tables]);

    // Auto-recenter on mount
    useEffect(() => {
        const timer = setTimeout(handleRecenter, 150);
        return () => clearTimeout(timer);
    }, [handleRecenter]);

    // relationship wires calculation
    const relationships = useMemo(() => {
        const relations = [];
        tables.forEach(table => {
            table.columns?.forEach(col => {
                if (col.desc?.includes('Foreign Key ->')) {
                    const match = col.desc.match(/Foreign Key\s*->\s*(\w+)\.(\w+)/);
                    if (match?.[1]) {
                        relations.push({
                            fromTable: table.name,
                            fromCol: col.name,
                            toTable: match[1],
                            toCol: match[2]
                        });
                    }
                }
            });
        });
        return relations;
    }, [tables]);

    // Curve paths for relationship wires
    const drawRelationPath = useCallback((rel) => {
        const posA = nodePositions[rel.fromTable] || { x: 0, y: 0 };
        const posB = nodePositions[rel.toTable] || { x: 0, y: 0 };
        const isLeft = posA.x < posB.x;
        const start = { x: isLeft ? posA.x + 290 : posA.x, y: posA.y + 90 };
        const end   = { x: isLeft ? posB.x : posB.x + 290, y: posB.y + 90 };
        const dx = start.x - end.x;
        const ctrlLen = Math.max(Math.abs(dx) * 0.45, 60);
        const c1x = isLeft ? start.x + ctrlLen : start.x - ctrlLen;
        const c2x = isLeft ? end.x - ctrlLen   : end.x + ctrlLen;
        return `M ${start.x} ${start.y} C ${c1x} ${start.y}, ${c2x} ${end.y}, ${end.x} ${end.y}`;
    }, [nodePositions]);

    return {
        canvas,
        handleRecenter,
        relationships,
        drawRelationPath
    };
}
