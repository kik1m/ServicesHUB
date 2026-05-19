'use client';
import React, { useEffect, useRef, useState } from 'react';

/**
 * 🌠 BackgroundStars — Desktop-only animated star canvas.
 *
 * Mobile (<768px): Component returns null — background is handled purely
 * by CSS (solid dark color in Base.css). This eliminates ALL mobile canvas
 * GPU compositing bugs, backdrop-filter glitches, and viewport-resize
 * position:fixed jumping issues.
 *
 * Desktop (≥768px): Full 300-star twinkling canvas with shooting stars
 * and scroll-based opacity fade.
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
                        x:             Math.random() * width,
                        y:             Math.random() * height,
                        size:          cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize),
                        baseAlpha:     cfg.minAlpha + Math.random() * (cfg.maxAlpha - cfg.minAlpha),
                        twinkleSpeed:  cfg.twinkleSpeed + Math.random() * cfg.twinkleSpeed,
                        twinkleOffset: Math.random() * Math.PI * 2,
                        hue:           200 + (Math.random() - 0.5) * 60,
                        sat:           10  + Math.random() * 30,
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

        // Debounced scroll opacity — avoids per-frame style thrashing
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
                opacity:       1,
                transition:    'opacity 0.4s ease-out',
            }}
            className="desktop-stars-canvas"
        />
    );
}
