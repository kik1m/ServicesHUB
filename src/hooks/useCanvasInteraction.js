import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useCanvasInteraction
 * Shared hook for zoom, pan, and node-drag interactions on the workflow/database canvas.
 * Extracted from WorkflowWorkspace and DatabaseWorkspace to eliminate duplication.
 */
export function useCanvasInteraction({ initialZoom = 0.85, initialPan = { x: 50, y: 50 } } = {}) {
    const [zoom, setZoom] = useState(initialZoom);
    const [pan, setPan] = useState(initialPan);
    const [nodePositions, setNodePositions] = useState({});
    const [draggingNodeId, setDraggingNodeId] = useState(null);
    const [isPanning, setIsPanning] = useState(false);

    const dragStartMouse = useRef({ x: 0, y: 0 });
    const dragStartNodePos = useRef({ x: 0, y: 0 });
    const panStartMouse = useRef({ x: 0, y: 0 });
    const panStartPan = useRef({ x: 0, y: 0 });

    const viewportRef = useRef(null);

    // Refs for throttling movements via requestAnimationFrame
    const latestCoords = useRef({ x: 0, y: 0 });
    const animationFrameId = useRef(null);

    // Clean up animation frame on unmount
    useEffect(() => {
        return () => {
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    // ── Recenter helpers ──────────────────────────────────────
    const recenterTo = useCallback((canvasCenterX = 700, canvasCenterY = 300, targetZoom = 0.85) => {
        setZoom(targetZoom);
        if (viewportRef.current) {
            const rect = viewportRef.current.getBoundingClientRect();
            setPan({
                x: rect.width / 2 - canvasCenterX * targetZoom,
                y: rect.height / 2 - canvasCenterY * targetZoom,
            });
        } else {
            setPan({ x: 100, y: 100 });
        }
    }, []);

    // ── Node position helpers ─────────────────────────────────
    const setNodePosition = useCallback((nodeId, pos) => {
        setNodePositions(prev => ({ ...prev, [nodeId]: pos }));
    }, []);

    const initNodePositions = useCallback((entries) => {
        // entries: [{ id, x, y }]
        setNodePositions(prev => {
            const updated = { ...prev };
            let changed = false;
            entries.forEach(({ id, x, y }) => {
                if (!updated[id]) {
                    updated[id] = { x, y };
                    changed = true;
                }
            });
            return changed ? updated : prev;
        });
    }, []);

    // ── Pointer event handlers ─────────────────────────────────
    const handleViewportPointerDown = useCallback((e) => {
        if (
            e.target.closest('.canvas-node') ||
            e.target.closest('.db-node') ||
            e.target.closest('button') ||
            e.target.closest('a') ||
            e.target.closest('select') ||
            e.target.closest('textarea')
        ) return;
        if (e.button !== 0) return;
        setIsPanning(true);
        panStartMouse.current = { x: e.clientX, y: e.clientY };
        panStartPan.current = { ...pan };
    }, [pan]);

    const handleNodePointerDown = useCallback((nodeId, e) => {
        if (e.button !== 0) return;
        if (
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('textarea') ||
            e.target.closest('select') ||
            e.target.closest('a')
        ) return;
        e.stopPropagation();
        setDraggingNodeId(nodeId);
        dragStartMouse.current = { x: e.clientX, y: e.clientY };
        dragStartNodePos.current = nodePositions[nodeId] || { x: 0, y: 0 };
    }, [nodePositions]);

    const handlePointerMove = useCallback((e) => {
        if (!draggingNodeId && !isPanning) return;
        
        latestCoords.current = { x: e.clientX, y: e.clientY };
        
        if (animationFrameId.current === null) {
            animationFrameId.current = requestAnimationFrame(() => {
                animationFrameId.current = null;
                const { x, y } = latestCoords.current;
                
                if (draggingNodeId) {
                    const dx = x - dragStartMouse.current.x;
                    const dy = y - dragStartMouse.current.y;
                    
                    setNodePositions(prev => {
                        const nextX = dragStartNodePos.current.x + dx / zoom;
                        const nextY = dragStartNodePos.current.y + dy / zoom;
                        
                        // Avoid redundant state triggers if coordinates haven't changed
                        if (prev[draggingNodeId]?.x === nextX && prev[draggingNodeId]?.y === nextY) {
                            return prev;
                        }
                        
                        return {
                            ...prev,
                            [draggingNodeId]: { x: nextX, y: nextY },
                        };
                    });
                } else if (isPanning) {
                    const dx = x - panStartMouse.current.x;
                    const dy = y - panStartMouse.current.y;
                    
                    setPan(prev => {
                        const nextX = panStartPan.current.x + dx;
                        const nextY = panStartPan.current.y + dy;
                        
                        if (prev.x === nextX && prev.y === nextY) {
                            return prev;
                        }
                        
                        return { x: nextX, y: nextY };
                    });
                }
            });
        }
    }, [draggingNodeId, isPanning, zoom]);

    const handlePointerUp = useCallback(() => {
        if (animationFrameId.current !== null) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
        setDraggingNodeId(null);
        setIsPanning(false);
    }, []);

    const handleWheel = useCallback((e) => {
        e.preventDefault();
        const ZOOM_FACTOR = 1.08;
        const rect = viewportRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const canvasX = (mouseX - pan.x) / zoom;
        const canvasY = (mouseY - pan.y) / zoom;

        const newZoom = e.deltaY < 0
            ? Math.min(zoom * ZOOM_FACTOR, 2.0)
            : Math.max(zoom / ZOOM_FACTOR, 0.25);

        setZoom(newZoom);
        setPan({
            x: mouseX - canvasX * newZoom,
            y: mouseY - canvasY * newZoom,
        });
    }, [zoom, pan]);

    return {
        // State
        zoom,
        pan,
        nodePositions,
        draggingNodeId,
        isPanning,
        // Refs
        viewportRef,
        // Actions
        setZoom,
        setPan,
        recenterTo,
        initNodePositions,
        setNodePosition,
        // Event handlers
        handleViewportPointerDown,
        handleNodePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleWheel,
    };
}
