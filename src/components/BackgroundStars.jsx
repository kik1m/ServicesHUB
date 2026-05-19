'use client';
import React, { useEffect, useRef } from 'react';

/**
 * 🌠 BackgroundStars — Global Static Star Layer
 *
 * A fixed, full-viewport canvas of gentle background stars rendered
 * behind InteractiveParticles. Stars are static (no drift) for a realistic
 * deep-space feel — only a slow, hypnotic twinkle effect.
 *
 * Depth is simulated via 3 size buckets:
 *   - Small (far):   many, dim, slow twinkle
 *   - Medium (mid):  moderate, moderate twinkle
 *   - Large (close): few, bright, faster twinkle
 */
export default function BackgroundStars() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width, height, reqId, time = 0;

        // 300 stars across 3 depth layers
        const STAR_CONFIG = [
            { count: 200, minSize: 0.2, maxSize: 0.7,  minAlpha: 0.15, maxAlpha: 0.45, twinkleSpeed: 0.008 }, // Far
            { count:  80, minSize: 0.7, maxSize: 1.2,  minAlpha: 0.30, maxAlpha: 0.65, twinkleSpeed: 0.015 }, // Mid
            { count:  20, minSize: 1.2, maxSize: 2.0,  minAlpha: 0.50, maxAlpha: 0.90, twinkleSpeed: 0.025 }, // Near
        ];

        let stars = [];
        let shootingStar = {
            active: false,
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            length: 0,
            life: 0,
            decay: 0
        };

        const spawnStars = () => {
            stars = [];
            for (const cfg of STAR_CONFIG) {
                for (let i = 0; i < cfg.count; i++) {
                    stars.push({
                        x:      Math.random() * width,
                        y:      Math.random() * height,
                        size:   cfg.minSize + Math.random() * (cfg.maxSize - cfg.minSize),
                        baseAlpha:  cfg.minAlpha + Math.random() * (cfg.maxAlpha - cfg.minAlpha),
                        twinkleSpeed: cfg.twinkleSpeed + Math.random() * cfg.twinkleSpeed,
                        twinkleOffset: Math.random() * Math.PI * 2,
                        // White-blue tint: realistic star color
                        hue:   200 + (Math.random() - 0.5) * 60,
                        sat:   10  + Math.random() * 30,
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

            // Draw Background Stars
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                const twinkle = Math.sin(time * s.twinkleSpeed + s.twinkleOffset);
                const alpha   = s.baseAlpha + twinkle * (s.baseAlpha * 0.5);

                if (alpha <= 0) continue;

                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 95%, ${alpha})`;
                ctx.fill();

                // Tiny cross-shaped diffraction spike for brighter stars
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

            // --- 🌠 Subtle Shooting Star Logic ---
            if (!shootingStar.active && Math.random() < 0.0006) { // Occurs rarely (about once every 20-30 seconds of active viewing)
                shootingStar.active = true;
                shootingStar.x = Math.random() * width * 1.2;     // Start from top right mostly
                shootingStar.y = Math.random() * height * 0.25;    // Upper section of screen
                shootingStar.dx = -7 - Math.random() * 8;         // Move diagonally left and fast
                shootingStar.dy = 3 + Math.random() * 4;          // Move down
                shootingStar.length = 70 + Math.random() * 90;
                shootingStar.life = 1.0;
                shootingStar.decay = 0.015 + Math.random() * 0.015; // Smoothly fades out in 35-65 frames
            }

            if (shootingStar.active) {
                const speed = Math.hypot(shootingStar.dx, shootingStar.dy);
                const endX = shootingStar.x - (shootingStar.dx / speed) * shootingStar.length;
                const endY = shootingStar.y - (shootingStar.dy / speed) * shootingStar.length;

                const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
                // Elegant bright white center fading into a subtle space-cyan tail
                grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.life * 0.85})`);
                grad.addColorStop(0.12, `hsla(195, 100%, 80%, ${shootingStar.life * 0.5})`);
                grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.2; // Incredibly delicate and professional
                ctx.moveTo(shootingStar.x, shootingStar.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                // Move and decay life
                shootingStar.x += shootingStar.dx;
                shootingStar.y += shootingStar.dy;
                shootingStar.life -= shootingStar.decay;

                if (shootingStar.life <= 0 || shootingStar.x < -100 || shootingStar.y > height + 100) {
                    shootingStar.active = false;
                }
            }

            reqId = requestAnimationFrame(draw);
        };

        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Fade out the stars smoothly to 20% opacity at 500px scroll depth
            const opacity = Math.max(0.20, 1 - scrollY / 500);
            canvas.style.opacity = opacity;
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
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position:      'fixed',
                top:           0,
                left:          0,
                pointerEvents: 'none',
                zIndex:        0,          // Deepest layer — below InteractiveParticles
                opacity:       1,
                transition:    'opacity 0.2s ease-out', // Smooths out rapid scrolls
            }}
        />
    );
}
