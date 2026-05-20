'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * 🌠 BackgroundStars — Desktop-only STATIC star canvas.
 *
 * Rendered exactly once per resize. 0% CPU usage after initial render.
 * No animation loops, no scroll listeners, pure GPU-cached snapshot.
 */
export default function BackgroundStars() {
    const canvasRef = useRef(null);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        // ─── MOBILE GUARD: no canvas on mobile ───────────────────────────
        if (!isDesktop) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: true });

        let resizeTimeout;

        const STAR_CONFIG = [
            { count: 200, minSize: 0.2, maxSize: 0.7,  minAlpha: 0.15, maxAlpha: 0.45 },
            { count:  80, minSize: 0.7, maxSize: 1.2,  minAlpha: 0.30, maxAlpha: 0.65 },
            { count:  20, minSize: 1.2, maxSize: 2.0,  minAlpha: 0.50, maxAlpha: 0.90 },
        ];

        const drawStaticStars = () => {
            const width  = window.innerWidth;
            const height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            
            canvas.width  = width  * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width  = `${width}px`;
            canvas.style.height = `${height}px`;

            ctx.clearRect(0, 0, width, height);

            for (const cfg of STAR_CONFIG) {
                for (let i = 0; i < cfg.count; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const hue = 200 + (Math.random() - 0.5) * 60;
                    const sat = 10  + Math.random() * 30;
                    const size = cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize);
                    const alpha = cfg.minAlpha + Math.random() * (cfg.maxAlpha - cfg.minAlpha);
                    
                    const colorStr = `hsl(${hue | 0}, ${sat | 0}%, 95%)`;
                    ctx.globalAlpha = alpha;
                    ctx.fillStyle = colorStr;
                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fill();

                    // Star cross spikes for larger stars
                    if (size > 1.4 && alpha > 0.6) {
                        ctx.globalAlpha = alpha * 0.35;
                        ctx.strokeStyle = colorStr;
                        ctx.lineWidth   = 0.4;
                        ctx.beginPath();
                        ctx.moveTo(x - size * 2.5, y);
                        ctx.lineTo(x + size * 2.5, y);
                        ctx.moveTo(x, y - size * 2.5);
                        ctx.lineTo(x, y + size * 2.5);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1;
        };

        const debouncedResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(drawStaticStars, 200);
        };

        // Draw immediately, then only on debounced resize
        drawStaticStars();
        window.addEventListener('resize', debouncedResize);

        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimeout);
        };
    }, [isDesktop]);

    if (!isDesktop) return null;

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:      'fixed',
                top:           0,
                left:          0,
                pointerEvents: 'none',
                zIndex:        0,
                opacity:       0.85,
                willChange:    'transform',
                transform:     'translateZ(0)'
            }}
            className="desktop-stars-canvas"
        />
    );
}
