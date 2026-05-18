'use client';
import React, { useEffect, useRef, useState } from 'react';
import { updateParticleIdealTargets, precomputeShapeTrig } from './particleGenerators';
import { updateParticleTransition } from './particleTransitions';
import { COLOR_MAP } from './particleColors';

/**
 * 🌌 Particle Class - Highly Optimized 3D Physics
 * Inlined to guarantee V8 JIT inlining for 60fps performance.
 */
class Particle {
    constructor(canvas, index, total) {
        this.canvas = canvas;
        const cy = canvas.height / 2;

        // 🎬 THE GRAND ENTRANCE: Spawn on the extreme left and right sides of the page
        const isLeft = index % 2 === 0;
        this.x = isLeft ? -250 : canvas.width + 250;
        this.y = Math.random() * canvas.height;
        this.z = -150; // Closer to camera for large, sharp particles

        this.speedX = 0; this.speedY = 0; this.speedZ = 0;
        this.baseSpeedX = (Math.random() - 0.5) * 1.6;
        this.baseSpeedY = (Math.random() - 0.5) * 1.6;
        this.baseSpeedZ = (Math.random() - 0.5) * 1.2;

        this.size = Math.random() * 1.45 + 0.85;
        this.density = Math.random() * 20 + 8;

        this.targetX = null; this.targetY = null; this.targetZ = null;
        this.transStartX = this.x; this.transStartY = this.y; this.transStartZ = this.z;
        this.idealX = this.x; this.idealY = this.y; this.idealZ = this.z;

        this.px = this.x; this.py = this.y; this.pSize = this.size;
        this.pOpacity = 0.8; this.scale = 1; this.rotatedZ = this.z;

        this.index = index;
        this.total = total;
        this.chromaticShift = 0;
        this.computedHue = 195;
        this.computedLightness = 55;

        // Zero-cost pre-calculated randomness for shapes
        this.randX = (Math.sin(index * 9.9) * 0.5) * 3.5;
        this.randY = (Math.cos(index * 7.7) * 0.5) * 3.5;
        this.randZ = (Math.sin(index * 5.5) * 0.5) * 3.5;
    }

    draw(ctx, time, phaseName, mouse, gBaseH, gFarH) {
        if (this.pOpacity <= 0) return;

        const lerpHue = (a, b, t) => {
            let d = b - a;
            while (d > 180) d -= 360;
            while (d < -180) d += 360;
            let res = a + d * t;
            while (res < 0) res += 360;
            return res % 360;
        };

        const depthRatio = Math.max(0, Math.min(1, (this.z + 200) / 500));
        let cHue = lerpHue(gBaseH, gFarH, depthRatio);
        let sat = 100, lit = phaseName === 'SHAPE_WARP_DRIVE' || phaseName === 'SHAPE_QUANTUM_FIELD' ? 65 : 55;

        // Brush & Shockwave interactivity
        if (this.chromaticShift > 0.01) {
            cHue += (340 - cHue) * this.chromaticShift;
            lit += (80 - lit) * this.chromaticShift;
        }

        if (mouse && mouse.clickTimer >= 0) {
            const dx = this.px - mouse.clickX, dy = this.py - mouse.clickY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            // ⚡ INSTANT SHOCKWAVE: Travels extremely fast (40px per frame)
            const wRadius = mouse.clickTimer * 40;
            const distDiff = Math.abs(dist - wRadius);

            if (distDiff < 90) { // Thicker wave band
                const prog = mouse.clickTimer / 25; // Faster fade out
                const int = (1 - distDiff / 90) * Math.sin(prog * Math.PI) * (1 - prog);
                let dH = 335 - cHue;
                dH = dH > 180 ? dH - 360 : dH < -180 ? dH + 360 : dH;
                cHue += dH * int;
                lit += (94 - lit) * int;

                // INSTANT PUNCH: Add massive momentum immediately
                const f = int * 6.5 / (this.scale || 1);
                this.speedX += (dx / (dist || 1)) * f;
                this.speedY += (dy / (dist || 1)) * f;
                this.speedZ += (Math.random() - 0.5) * f * 12;
            }
        }

        this.computedHue = cHue;
        this.computedLightness = lit;

        ctx.fillStyle = `hsla(${cHue}, ${sat}%, ${lit}%, ${this.pOpacity})`;
        ctx.beginPath();
        ctx.arc(this.px, this.py, this.pSize, 0, Math.PI * 2);
        ctx.fill();
    }

    update(mouse, phaseName, cx, cy, time) {
        if (phaseName === 'STILL') {
            this.speedX *= 0.88; this.speedY *= 0.88; this.speedZ *= 0.88;
        } else if (phaseName === 'VORTEX') {
            let dx = cx - this.x, dy = cy - this.y;
            let len = Math.sqrt(dx * dx + dy * dy) || 1;
            let tx = dy / len * 8 + dx * 0.05, ty = -dx / len * 8 + dy * 0.05;
            this.speedX += (tx - this.speedX) * 0.08;
            this.speedY += (ty - this.speedY) * 0.08;
            this.speedZ += ((220 - this.z) - this.speedZ) * 0.05;
        } else if (phaseName === 'BREATHE') {
            let dx = this.x - cx, dy = this.y - cy, d = Math.sqrt(dx * dx + dy * dy) || 1;
            let bf = Math.sin(time * 0.03) * 1.5, bfZ = Math.cos(time * 0.03 + this.index) * 1.2;
            this.speedX += (dx / d) * bf * 0.1 + (this.baseSpeedX * 0.5 - this.speedX) * 0.05;
            this.speedY += (dy / d) * bf * 0.1 + (this.baseSpeedY * 0.5 - this.speedY) * 0.05;
            this.speedZ += bfZ * 0.05 + (this.baseSpeedZ * 0.5 - this.speedZ) * 0.05;
            this.speedX *= 0.96; this.speedY *= 0.96; this.speedZ *= 0.96;
        } else if (this.targetX !== null) {
            let dx = this.targetX - this.x, dy = this.targetY - this.y, dz = this.targetZ - this.z;

            // 💎 FLUID BUTTERY SPRING: Moves perfectly to the target, very soft and elegant.
            // When transitioning, it's a bit looser. When fully formed, it's tighter.
            const spr = this.isCinematic ? 0.05 : 0.15;
            const damp = this.isCinematic ? 0.85 : 0.65;

            this.speedX += dx * spr;
            this.speedY += dy * spr;
            this.speedZ += dz * spr;

            this.speedX *= damp; this.speedY *= damp; this.speedZ *= damp;
            this.x += this.speedX; this.y += this.speedY; this.z += this.speedZ;
        } else {
            if (phaseName === 'WANDER') {
                this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.02;
                this.speedZ += (this.baseSpeedZ - this.speedZ) * 0.02;
                this.y += Math.sin(time * 0.02 + this.index) * 0.5;
                this.z += Math.cos(time * 0.02 + this.index) * 0.3;
            } else if (phaseName === 'WANDER_FAST') {
                this.speedX = this.speedX * 0.99 + (Math.random() - 0.5) * 0.6;
                this.speedY = this.speedY * 0.99 + (Math.random() - 0.5) * 0.6;
                this.speedZ = this.speedZ * 0.99 + (Math.random() - 0.5) * 0.6;
            } else if (phaseName === 'EXPLODE') {
                this.speedX *= 0.96; this.speedY *= 0.96; this.speedZ *= 0.96;
            }
        }

        this.x += this.speedX; this.y += this.speedY; this.z += this.speedZ;

        if (['WANDER', 'WANDER_FAST', 'EXPLODE', 'BREATHE', 'VORTEX'].includes(phaseName)) {
            if (this.x > this.canvas.width) this.x = 0; else if (this.x < 0) this.x = this.canvas.width;
            if (this.y > this.canvas.height) this.y = 0; else if (this.y < 0) this.y = this.canvas.height;
            if (this.z > 300) this.z = -200; else if (this.z < -200) this.z = 300;
        }

        // 🖱️ Mouse Interaction: Explosive Direct Force
        if (mouse.x !== null) {
            let dx = mouse.x - this.px, dy = mouse.y - this.py;
            let dSq = dx * dx + dy * dy;
            const radSq = mouse.radius * mouse.radius;

            if (dSq < radSq) {
                const d = Math.sqrt(dSq);
                const f = (mouse.radius - d) / mouse.radius;

                // RESTORED: Directly push particles violently out of the way for satisfying reaction
                const push = f * this.density * 1.5 / (this.scale || 1);
                this.x -= (dx / (d || 1)) * push;
                this.y -= (dy / (d || 1)) * push;
                this.z += (Math.random() - 0.5) * push * 1.5;

                // Add lingering momentum to the spring
                this.speedX -= (dx / (d || 1)) * push * 0.12;
                this.speedY -= (dy / (d || 1)) * push * 0.12;

                this.chromaticShift += (1 - d / mouse.radius - this.chromaticShift) * 0.25;
            } else {
                this.chromaticShift *= 0.92;
            }
        } else {
            this.chromaticShift *= 0.92;
        }
    }
}

/**
 * 🌌 InteractiveParticles Engine
 */
export default function InteractiveParticles() {
    const canvasRef = useRef(null);
    const [shouldRender, setShouldRender] = useState(true);
    const [isAlive, setIsAlive] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setIsAlive(true), 80);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const check = () => setShouldRender(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    useEffect(() => {
        if (!shouldRender || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });
        let reqId;
        let particles = [];
        const mouse = { x: null, y: null, radius: 220, speed: 0, clickX: null, clickY: null, clickTimer: -1 };
        let scrollY = 0, smoothedScrollY = 0, globalTime = 0;
        let camX = 0, camY = 0, camZ = 0;
        let startTime = performance.now();

        // Extremely fast LUT for twinkling
        const LUT_SIZE = 512, SIN_LUT = new Float32Array(LUT_SIZE);
        for (let i = 0; i < LUT_SIZE; i++) SIN_LUT[i] = Math.sin(i / LUT_SIZE * Math.PI * 2);
        const fastSin = x => SIN_LUT[(x * (LUT_SIZE / (Math.PI * 2)) | 0) & (LUT_SIZE - 1)];

        const rootE = document.documentElement;
        const scrollC = document.querySelector('.content') || document.querySelector('.app-container');

        const PHASES = [
            { name: 'SHAPE_GLOBE', duration: 1200 },       // 0: Majestic Start (Cyan/Gold)
            { name: 'SHAPE_AI_TEXT', duration: 1000 },     // 1: AI/Platform Title
            { name: 'SHAPE_MERKABA', duration: 1000 },     // 2
            { name: 'SHAPE_TESSERACT', duration: 1000 },   // 3
            { name: 'SHAPE_DNA', duration: 1000 },         // 4
            { name: 'SHAPE_TORUS', duration: 1000 },       // 5
            { name: 'SHAPE_WARP_DRIVE', duration: 1000 },  // 6
            { name: 'SHAPE_HOURGLASS', duration: 1000 },   // 7
            { name: 'SHAPE_MULTIVERSE', duration: 1000 },  // 8
            { name: 'SHAPE_DYSON_SPHERE', duration: 1000 },// 9
            { name: 'SHAPE_PYRAMID', duration: 1000 }      // 10: Epic Cybernetic Quantum Nexus Core
        ];

        let phaseIdx = 0, phaseTimer = 0;

        const init = () => {
            particles = [];
            // ⚡ PERF: Hard cap at 160 particles for 80% CPU reduction
            const n = Math.min(Math.floor((canvas.width * canvas.height) / 7000), 160);
            for (let i = 0; i < n; i++) particles.push(new Particle(canvas, i, n));
        };

        const onResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
        const onScroll = e => scrollY = Math.max(window.scrollY || 0, document.documentElement.scrollTop || 0, document.body.scrollTop || 0, e?.target?.scrollTop || 0);
        let lx = null, ly = null;
        const onMove = e => { if (lx !== null) mouse.speed = Math.sqrt((e.clientX - lx) ** 2 + (e.clientY - ly) ** 2); lx = mouse.x = e.clientX; ly = mouse.y = e.clientY; };
        const onLeave = () => { mouse.x = mouse.y = lx = ly = null; mouse.speed = 0; };
        const onClick = e => { mouse.clickX = e.clientX; mouse.clickY = e.clientY; mouse.clickTimer = 0; };

        const drawLines = (op) => {
            const phase = PHASES[phaseIdx].name;
            let cDist = 65, mConn = 4, strict = false, eMod = 1;

            if (phase === 'SHAPE_AI_TEXT') { cDist = 32; mConn = 3; }
            else if (phase === 'SHAPE_MERKABA') { cDist = 120; strict = true; eMod = 12; mConn = 6; }
            else if (phase === 'SHAPE_TESSERACT') { cDist = 140; strict = true; eMod = 32; mConn = 6; }
            else if (phase === 'SHAPE_DYSON_SPHERE') { cDist = 80; mConn = 3; }
            else if (['SHAPE_QUANTUM_FIELD', 'SHAPE_MULTIVERSE'].includes(phase)) { cDist = 70; mConn = 4; }
            else if (phase === 'SHAPE_DNA') { cDist = 58; mConn = 3; }
            else if (phase === 'SHAPE_PYRAMID') { cDist = 140; strict = true; eMod = 6; mConn = 4; }

            const len = particles.length;
            const tSq = cDist * cDist;

            // ⚡ PERF: Search limit 25 to halve line-draw work per frame
            for (let a = 0; a < len; a++) {
                const p1 = particles[a];
                let conn = 0;

                const searchLimit = Math.min(len, a + 25);
                for (let b = a + 1; b < searchLimit && conn < mConn; b++) {
                    const p2 = particles[b];
                    if (strict && (p1.index % eMod) !== (p2.index % eMod)) continue;
                    if (phase === 'SHAPE_DNA' && (p1.index % 2) !== (p2.index % 2)) continue;

                    const dxl = p1.px - p2.px, dyl = p1.py - p2.py;
                    const distSq = dxl * dxl + dyl * dyl;
                    if (distSq < tSq) {
                        conn++;
                        const dist = Math.sqrt(distSq);
                        const avgHue = (p1.computedHue + p2.computedHue) * 0.5;
                        const avgLit = (p1.computedLightness + p2.computedLightness) * 0.5;
                        const lineAlpha = ((1 - dist / cDist) * op * 0.45).toFixed(3);
                        ctx.strokeStyle = `hsla(${avgHue | 0},100%,${avgLit | 0}%,${lineAlpha})`;
                        ctx.lineWidth = Math.max(0.4, (1 - dist / cDist) * 1.2 * p1.scale);
                        ctx.beginPath(); ctx.moveTo(p1.px, p1.py); ctx.lineTo(p2.px, p2.py); ctx.stroke();
                    }
                }
            }
        };

        const updatePhaseLogic = () => {
            const phaseName = PHASES[phaseIdx].name;
            const cx = canvas.width / 2, cy = canvas.height / 2;
            phaseTimer++;

            const isChanged = phaseTimer === 1;

            // ⚡ PERF: Pre-compute rotation trig ONCE per frame (saves N * Math.cos/sin calls)
            precomputeShapeTrig(globalTime, phaseName);

            const pLen = particles.length;
            for (let i = 0; i < pLen; i++) {
                const p = particles[i];
                p.localSizeMult = 1.0;
                p.localOpMult = 1.0;
                updateParticleIdealTargets(p, phaseName, i, pLen, globalTime, cx, cy, mouse);

                if (isChanged) { p.transStartX = p.x; p.transStartY = p.y; p.transStartZ = p.z; }

                if (globalTime < 300) {
                    p.isCinematic = true;
                    const ringAngle = (i / pLen) * Math.PI * 4;
                    const ringX = cx + Math.cos(ringAngle) * 140;
                    const ringY = cy + Math.sin(ringAngle) * 140;

                    if (globalTime < 120) {
                        const t1 = globalTime / 120;
                        const ease1 = t1 < 0.5 ? 4 * t1 * t1 * t1 : 1 - Math.pow(-2 * t1 + 2, 3) / 2;
                        p.targetX = p.transStartX + (ringX - p.transStartX) * ease1;
                        p.targetY = p.transStartY + (ringY - p.transStartY) * ease1;
                        p.targetZ = p.transStartZ + (0 - p.transStartZ) * ease1;
                    } else if (globalTime < 210) {
                        const spinAngle = ringAngle + (globalTime - 120) * 0.24;
                        p.targetX = cx + Math.cos(spinAngle) * 140;
                        p.targetY = cy + Math.sin(spinAngle) * 140;
                        p.targetZ = 0;
                        p.chromaticShift = 0.5 + Math.sin(globalTime * 0.12) * 0.5;
                    } else {
                        const t3 = (globalTime - 210) / 90;
                        const ease3 = t3 < 0.5 ? 4 * t3 * t3 * t3 : 1 - Math.pow(-2 * t3 + 2, 3) / 2;
                        const lastSpinAngle = ringAngle + 90 * 0.24;
                        const ringStartX = cx + Math.cos(lastSpinAngle) * 140;
                        const ringStartY = cy + Math.sin(lastSpinAngle) * 140;
                        p.targetX = ringStartX + (p.idealX - ringStartX) * ease3;
                        p.targetY = ringStartY + (p.idealY - ringStartY) * ease3;
                        p.targetZ = (p.idealZ) * ease3;
                        p.chromaticShift = (1 - ease3) * 0.8;
                    }
                } else if (phaseTimer <= 180) {
                    p.isCinematic = true;
                    const globalT = phaseTimer / 180;
                    const dxc = p.transStartX - cx, dyc = p.transStartY - cy;
                    const distFromCenter = Math.sqrt(dxc * dxc + dyc * dyc);
                    const baseDelay = Math.min(0.45, (distFromCenter / 400) * 0.42 + (i % 20) * 0.002);
                    const localT = Math.max(0, Math.min(1, (globalT - baseDelay) / 0.55));
                    const ease = localT < 0.5 ? 16 * Math.pow(localT, 5) : 1 - Math.pow(-2 * localT + 2, 5) / 2;
                    const arc = Math.sin(localT * Math.PI);
                    // Lightweight swirl (halved intensity)
                    const swirlAngle = localT * Math.PI * 2.5 + i * 0.03;
                    const swirlRadius = arc * 7;
                    const swirlX = Math.cos(swirlAngle) * swirlRadius;
                    const swirlY = Math.sin(swirlAngle) * swirlRadius;
                    updateParticleTransition(p, phaseIdx, i, pLen, localT, ease, arc, swirlX, swirlY, globalTime, cx, cy);
                } else {
                    p.isCinematic = false;
                    p.targetX = p.idealX; p.targetY = p.idealY; p.targetZ = p.idealZ;
                    // Lightweight float: single shared wave instead of per-particle
                    const floatForce = Math.min(1, (phaseTimer - 160) / 45);
                    p.targetX += Math.cos(globalTime * 0.016 + i * 0.5) * 2.5 * floatForce;
                    p.targetY += Math.sin(globalTime * 0.016 + i * 0.5) * 2.5 * floatForce;
                }
            }
        };

        let gBaseH = 195, gFarH = 275, gSat = 0;
        // ⚡ PERF: Track last CSS write to avoid redundant DOM writes
        let lastHue1 = -1, lastHue2 = -1, lastSat = -1;


        const animate = () => {
            // High-Performance Clear & Simple Smooth Motion Blur (البلور الحركي الذكي)
            // Skip blur completely during the very first portal sweep-in entrance (globalTime < 300)
            const isMorphing = globalTime >= 300 && phaseTimer > 0 && phaseTimer <= 180;
            
            if (isMorphing) {
                // 🌊 Ultra-Soft Sine Wave Easing: Perfect bell-curve entrance and exit
                // Math.sin creates a flawless, organic ramp peaking exactly at the middle (frame 90)
                const blurStrength = Math.sin((phaseTimer / 180) * Math.PI);

                // Very subtle blur: 1.0 is pure clear (no blur), 0.55 is a short, highly elegant tail
                const activeFade = 0.55 + (1.0 - 0.55) * (1.0 - blurStrength);

                // Transparent fade clear for realistic, delicate organic trails
                ctx.globalCompositeOperation = 'destination-out';
                ctx.fillStyle = `rgba(0, 0, 0, ${activeFade})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'screen';
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            globalTime++;

            if (mouse.speed > 0.1) mouse.speed *= 0.95;
            // ⚡ Instant Click Timer: Caps at 25 frames for an explosive short reaction
            if (mouse.clickTimer >= 0 && ++mouse.clickTimer > 25) mouse.clickTimer = -1;

            if (phaseTimer >= PHASES[phaseIdx].duration) { phaseIdx = (phaseIdx + 1) % PHASES.length; phaseTimer = 0; }

            updatePhaseLogic();

            if (globalTime < 210) {
                gSat = 0; // Remain completely gray (lifeless) during sweep-in and high-speed spinning portal
            } else if (globalTime < 300) {
                // Smoothly fade in color over 90 frames in PERFECT SYNC with the bloom expansion into the Globe
                const t = (globalTime - 210) / 90;
                // Cubic ease-in-out for ultimate luxury transition
                const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                gSat = ease * 100;
            } else {
                gSat = 100; // Full, vibrant, synchronized life!
            }

            const pName = PHASES[phaseIdx].name;
            const targetColor = COLOR_MAP[phaseIdx] || { b: 195, f: 275 };

            const lerpHue = (a, b, t) => {
                let d = b - a;
                while (d > 180) d -= 360;
                while (d < -180) d += 360;
                let res = a + d * t;
                while (res < 0) res += 360;
                return res % 360;
            };

            gBaseH = lerpHue(gBaseH, targetColor.b, 0.015); // Ultra luxurious smooth color morph
            gFarH = lerpHue(gFarH, targetColor.f, 0.015);

            // ⚡ PERF: Only write CSS vars when values changed by at least 0.5 units
            const h1 = gBaseH | 0, h2 = gFarH | 0, sat = gSat | 0;
            if (Math.abs(h1 - lastHue1) > 0) { rootE.style.setProperty('--dynamic-hue-1', h1); lastHue1 = h1; }
            if (Math.abs(h2 - lastHue2) > 0) { rootE.style.setProperty('--dynamic-hue-2', h2); lastHue2 = h2; }
            if (Math.abs(sat - lastSat) > 0) { rootE.style.setProperty('--dynamic-saturation', sat); lastSat = sat; }

            smoothedScrollY += (scrollY - smoothedScrollY) * 0.08;
            camX += ((mouse.x !== null ? (mouse.x - canvas.width / 2) * 0.28 : 0) - camX) * 0.08;
            camY += ((mouse.y !== null ? (mouse.y - canvas.height / 2) * 0.28 : 0) - camY) * 0.08;

            const bZ = Math.sin(globalTime * 0.012) * 15;
            if (globalTime < 200) {
                const t = globalTime / 200;
                const blend = Math.min(1, Math.max(0, (globalTime - 100) / 100));
                camZ = 450 * (1 - t) ** 2.2 * Math.cos(globalTime * 0.015) * (1 - blend) + bZ * blend;
            } else camZ = bZ;

            const gOp = Math.max(0.15, Math.min(1, 1 - smoothedScrollY / 550)); // Fade to 15% on scroll
            const cx = canvas.width / 2, cy = canvas.height / 2;
            const cX = Math.cos(camY * 0.0012), sX = Math.sin(camY * 0.0012);
            const cY = Math.cos(camX * 0.0012), sY = Math.sin(camX * 0.0012);

            let sMult = 1, oMult = 1;
            if (phaseIdx === 0 && globalTime < 300) {
                if (globalTime < 120) {
                    const p = globalTime / 120;
                    sMult = 2.4 - 0.8 * p; // Start at 2.4x size, scale down to 1.6x
                    oMult = 1.0;
                } else if (globalTime < 210) {
                    sMult = 1.6;
                    oMult = 1.0;
                } else {
                    const p = (globalTime - 210) / 90;
                    sMult = 1.6 - 0.6 * p; // Scale down to 1.0x
                    oMult = 1.0;
                }
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update(mouse, pName, cx, cy, globalTime);

                const rx = p.x - cx, ry = p.y - cy, rz = p.z;
                const y1 = ry * cX - rz * sX, z1 = ry * sX + rz * cX;
                const x2 = rx * cY - z1 * sY, z2 = rx * sY + z1 * cY;

                p.rotatedZ = z2;
                const cRZ = Math.max(-280, z2 + camZ);
                const sc = 360 / (360 + cRZ);

                p.px = cx + x2 * sc; p.py = cy + y1 * sc; p.scale = sc;
                p.pSize = Math.max(0.2, p.size * sc * sMult * p.localSizeMult);

                const nF = cRZ < -150 ? Math.max(0, (cRZ + 280) / 130) : 1;
                const fF = Math.max(0.6, 1 - (cRZ - 100) / 600);
                p.pOpacity = Math.min(Math.max(0.42, sc) * nF * fF * (fastSin(globalTime * 0.05 + i * 1.5) * 0.15 + 0.85) * 1.15, 1) * gOp * oMult * p.localOpMult;

                p.draw(ctx, globalTime, pName, mouse, gBaseH, gFarH);
            }

            if (gOp > 0.1) drawLines(gOp);

            reqId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', onResize); window.addEventListener('scroll', onScroll, { passive: true });
        if (scrollC) scrollC.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMove); window.addEventListener('mouseleave', onLeave); window.addEventListener('click', onClick);

        onResize(); animate();

        return () => {
            cancelAnimationFrame(reqId);
            window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll);
            if (scrollC) scrollC.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); window.removeEventListener('click', onClick);
        };
    }, [shouldRender]);

    if (!shouldRender) return <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'transparent' }} />;

    return (
        <canvas ref={canvasRef} style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 0, pointerEvents: 'none', mixBlendMode: 'screen',
            opacity: isAlive ? 0.88 : 0, transition: 'opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1)'
        }} />
    );
}
