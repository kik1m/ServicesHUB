'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * 🌠 BackgroundStars — Global Static Star Layer
 *
 * Desktop (≥768px): Full animated canvas with 300 twinkling stars,
 *   shooting stars, and a scroll-based opacity fade. Uses position:fixed
 *   and requestAnimationFrame.
 *
 * Mobile (<768px): Replaces the canvas entirely with a lightweight CSS
 *   approach. Reason: On mobile Chrome/Safari, a 60fps position:fixed canvas
 *   combined with elements using backdrop-filter:blur() above it causes a
 *   critical GPU compositor race condition — the browser reads stale canvas
 *   texture mid-frame, producing "shattered TV" glitch artifacts. Additionally,
 *   changing canvas.style.opacity in handleScroll triggers a full compositor
 *   repass on every scroll frame, causing the address-bar-resize viewport
 *   jitter to visibly shift the canvas position ("jumping background").
 *   CSS static dots are composited once, never invalidate, and have zero
 *   interaction with the canvas stack.
 */
export default function BackgroundStars() {
    const canvasRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile ONCE on mount only (SSR-safe)
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // ─── DESKTOP: Full animated canvas engine ─────────────────────────────
    useEffect(() => {
        if (isMobile) return; // Mobile uses CSS stars instead
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, reqId, time = 0;

        const STAR_CONFIG = [
            { count: 200, minSize: 0.2, maxSize: 0.7,  minAlpha: 0.15, maxAlpha: 0.45, twinkleSpeed: 0.008 },
            { count:  80, minSize: 0.7, maxSize: 1.2,  minAlpha: 0.30, maxAlpha: 0.65, twinkleSpeed: 0.015 },
            { count:  20, minSize: 1.2, maxSize: 2.0,  minAlpha: 0.50, maxAlpha: 0.90, twinkleSpeed: 0.025 },
        ];

        let stars = [];
        let shootingStar = { active: false, x: 0, y: 0, dx: 0, dy: 0, length: 0, life: 0, decay: 0 };

        const spawnStars = () => {
            stars = [];
            for (const cfg of STAR_CONFIG) {
                for (let i = 0; i < cfg.count; i++) {
                    stars.push({
                        x:            Math.random() * width,
                        y:            Math.random() * height,
                        size:         cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize),
                        baseAlpha:    cfg.minAlpha + Math.random() * (cfg.maxAlpha - cfg.minAlpha),
                        twinkleSpeed: cfg.twinkleSpeed + Math.random() * cfg.twinkleSpeed,
                        twinkleOffset:Math.random() * Math.PI * 2,
                        hue:          200 + (Math.random() - 0.5) * 60,
                        sat:          10  + Math.random() * 30,
                    });
                }
            }
        };

        const resize = () => {
            width  = window.innerWidth;
            height = window.innerHeight;
            const dpr = window.devicePixelRatio || 1;
            canvas.width  = width  * dpr;
            canvas.height = height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width  = `${width}px`;
            canvas.style.height = `${height}px`;
            spawnStars();
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            time++;

            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
                const alpha   = s.baseAlpha + twinkle * (s.baseAlpha * 0.5);
                if (alpha <= 0) continue;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 95%, ${alpha})`;
                ctx.fill();

                if (s.size > 1.4 && alpha > 0.6) {
                    ctx.globalAlpha = alpha * 0.35;
                    ctx.strokeStyle = `hsla(${s.hue}, ${s.sat}%, 95%, 1)`;
                    ctx.lineWidth   = 0.4;
                    ctx.beginPath();
                    ctx.moveTo(s.x - s.size * 2.5, s.y);
                    ctx.lineTo(s.x + s.size * 2.5, s.y);
                    ctx.moveTo(s.x, s.y - s.size * 2.5);
                    ctx.lineTo(s.x, s.y + s.size * 2.5);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }

            // Shooting star
            if (!shootingStar.active && Math.random() < 0.0006) {
                shootingStar.active = true;
                shootingStar.x      = Math.random() * width * 1.2;
                shootingStar.y      = Math.random() * height * 0.25;
                shootingStar.dx     = -7 - Math.random() * 8;
                shootingStar.dy     = 3 + Math.random() * 4;
                shootingStar.length = 70 + Math.random() * 90;
                shootingStar.life   = 1.0;
                shootingStar.decay  = 0.015 + Math.random() * 0.015;
            }
            if (shootingStar.active) {
                const speed = Math.hypot(shootingStar.dx, shootingStar.dy);
                const endX  = shootingStar.x - (shootingStar.dx / speed) * shootingStar.length;
                const endY  = shootingStar.y - (shootingStar.dy / speed) * shootingStar.length;
                const grad  = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
                grad.addColorStop(0,    `rgba(255, 255, 255, ${shootingStar.life * 0.85})`);
                grad.addColorStop(0.12, `hsla(195, 100%, 80%, ${shootingStar.life * 0.5})`);
                grad.addColorStop(1,    'rgba(255, 255, 255, 0)');
                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth   = 1.2;
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
                shootingStar.x    += shootingStar.dx;
                shootingStar.y    += shootingStar.dy;
                shootingStar.life -= shootingStar.decay;
                if (shootingStar.life <= 0 || shootingStar.x < -100 || shootingStar.y > height + 100) {
                    shootingStar.active = false;
                }
            }

            reqId = requestAnimationFrame(draw);
        };

        // Scroll fade: uses CSS transition so no per-frame style writes during scroll
        // We debounce via requestAnimationFrame to avoid thrashing the compositor
        let scrollRaf = null;
        const handleScroll = () => {
            if (scrollRaf) return;
            scrollRaf = requestAnimationFrame(() => {
                scrollRaf = null;
                const opacity = Math.max(0.20, 1 - window.scrollY / 500);
                canvas.style.opacity = opacity;
            });
        };

        window.addEventListener('resize', resize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        resize();
        handleScroll();
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(reqId);
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
        };
    }, [isMobile]);

    // ─── MOBILE: Pure CSS static stars — ZERO canvas, ZERO GPU invalidation ─
    if (isMobile) {
        return <MobileStars />;
    }

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
                opacity:       1,
                // CSS transition handles the opacity fade smoothly without JS writes
                transition:    'opacity 0.4s ease-out',
            }}
        />
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MobileStars: Pre-generated CSS star dots, painted once, scroll with the page.
// No rAF, no fixed positioning, no GPU compositing interaction with backdrop-filter.
// ─────────────────────────────────────────────────────────────────────────────
const MOBILE_STAR_COUNT = 80;

// Deterministic seed so stars don't shift on hydration
function seededRandom(seed) {
    let s = seed;
    return () => {
        s = (s * 16807 + 0) % 2147483647;
        return (s - 1) / 2147483646;
    };
}

const mobileStars = (() => {
    const rand = seededRandom(42);
    return Array.from({ length: MOBILE_STAR_COUNT }, (_, i) => ({
        id:      i,
        top:     (rand() * 100).toFixed(2),
        left:    (rand() * 100).toFixed(2),
        size:    (rand() * 1.5 + 0.5).toFixed(2),
        opacity: (rand() * 0.45 + 0.1).toFixed(2),
        delay:   (rand() * 4).toFixed(2),
        dur:     (rand() * 3 + 2).toFixed(2),
    }));
})();

function MobileStars() {
    return (
        <>
            <style>{`
                @keyframes star-twinkle {
                    0%, 100% { opacity: var(--star-op); }
                    50%       { opacity: calc(var(--star-op) * 0.3); }
                }
                .mobile-star {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(220, 235, 255, 1);
                    animation: star-twinkle var(--star-dur) ease-in-out var(--star-delay) infinite;
                    pointer-events: none;
                }
            `}</style>
            <div
                aria-hidden="true"
                style={{
                    /*
                     * position:fixed so stars cover the full viewport always.
                     * Unlike the canvas, this div is a STATIC element — it has no
                     * JavaScript updating it every frame, so the browser composites
                     * it once and never invalidates it during scroll. This means:
                     *  - No GPU race condition with backdrop-filter (no canvas texture to read)
                     *  - No style changes on scroll (no opacity writes = no compositor repasses)
                     *  - The address-bar show/hide resize does NOT cause glitches because
                     *    CSS animations are GPU-side and unaffected by JS scroll events.
                     */
                    position:      'fixed',
                    inset:         0,
                    zIndex:        0,
                    pointerEvents: 'none',
                    overflow:      'hidden',
                }}
            >
                {mobileStars.map(s => (
                    <span
                        key={s.id}
                        className="mobile-star"
                        style={{
                            top:        `${s.top}%`,
                            left:       `${s.left}%`,
                            width:      `${s.size}px`,
                            height:     `${s.size}px`,
                            '--star-op':    s.opacity,
                            '--star-dur':   `${s.dur}s`,
                            '--star-delay': `${s.delay}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}
