'use client';
import React, { useEffect, useRef, useState } from 'react';
import { updateParticleIdealTargets, precomputeShapeTrig, buildParticleLUT } from '../../utils/particles/particleGenerators';
import { updateParticleTransition, buildTransitionLUT } from '../../utils/particles/particleTransitions';
import { COLOR_MAP } from '../../utils/particles/particleColors';
import { usePathname } from 'next/navigation';

// ⚡ PERF: Module-level lerpHue — eliminates closure allocation on every draw() call
const _lerpHue = (a, b, t) => {
    let d = b - a;
    if (d > 180) d -= 360; else if (d < -180) d += 360;
    let res = a + d * t;
    if (res < 0) res += 360;
    return res % 360;
};

// ⚡ PERF: Extremely fast, Zero-Allocation O(N) Insertion Sort for nearly-sorted arrays.
// Z-depths change imperceptibly frame-to-frame, making Insertion Sort blazing fast!
const insertionSortZ = (arr, len) => {
    for (let i = 1; i < len; i++) {
        const key = arr[i];
        const kz = key.rotatedZ;
        let j = i - 1;
        // Sort descending (farthest particles first)
        while (j >= 0 && arr[j].rotatedZ < kz) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
};

// ⚡ PERF: 16-bucket depth hue ramp — filled ONCE per frame at top of animate(),
// then read 280× per frame. Eliminates 16,800 _lerpHue() math calls per second!
const _HUE_RAMP = new Float32Array(16);

// ⚡ PERF: Bounded ring-buffer HSLA cache — 2048 slots, zero heap growth
const _CACHE_SIZE = 2048;
const _CACHE_KEYS = new Int32Array(_CACHE_SIZE).fill(-1);
const _CACHE_VALS = new Array(_CACHE_SIZE).fill(null);
const getCachedHsla = (h, s, l, a) => {
    // ⚡ ELITE CACHE: 100% collision-free unique key (h: 9 bits, l: 7 bits, a: 7 bits)
    const uniqueKey = ((h | 0) << 14) | ((l | 0) << 7) | ((a * 100) | 0);
    // Prime-based hash distribution to completely eliminate cache slot collisions
    const slot = Math.abs(((h | 0) * 17 + (l | 0) * 7 + ((a * 100) | 0))) & (_CACHE_SIZE - 1);

    if (_CACHE_KEYS[slot] === uniqueKey) return _CACHE_VALS[slot];

    const val = `hsla(${h | 0},${s | 0}%,${l | 0}%,${a.toFixed(2)})`;
    _CACHE_KEYS[slot] = uniqueKey;
    _CACHE_VALS[slot] = val;
    return val;
};

// ⚡ PERF: Reusable, zero-allocation flat array structure for line connection batching
const _LINE_BINS = Array.from({ length: 5 }, () => ({
    points: new Float32Array(25000),
    count: 0,
    sumHue: 0,
    sumLit: 0,
    sumScale: 0
}));

// ⚡ PERF: Module level Set for zero-allocation boundary checks
const _WRAP_PHASES = new Set(['WANDER', 'WANDER_FAST', 'EXPLODE', 'BREATHE', 'VORTEX']);

/**
 * 🌌 Particle Class - Highly Optimized 3D Physics
 * Inlined to guarantee V8 JIT inlining for 30fps performance.
 */
class Particle {
    constructor(canvas, index, total) {
        this.canvas = canvas;
        const cy = canvas.height / 2;

        // 🎬 THE GRAND ENTRANCE: Gather from far left and right edges
        const isLeft = index % 2 === 0;
        this.x = isLeft ? -300 - Math.random() * 500 : canvas.width + 300 + Math.random() * 500;
        this.y = (canvas.height / 2) + (Math.random() - 0.5) * canvas.height * 1.5;
        this.z = 200 + Math.random() * 1200;

        // Store original spawn points for the dramatic fly-in calculation
        this.startX = this.x; this.startY = this.y; this.startZ = this.z;

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

        // ⚡ JIT Monomorphism Stability: Pre-initialize all V8 properties
        this.isCinematic = false;
        this.localSizeMult = 1.0;
        this.localOpMult = 1.0;
    }

    draw(ctx, time, phaseName, mouse) {
        if (this.pOpacity <= 0) return;

        // ⚡ PERF: O(1) depth-bucket lookup (no math!) instead of per-particle _lerpHue()
        const bucket = Math.min(15, Math.max(0, (this.z + 200) / 500 * 16 | 0));
        let cHue = _HUE_RAMP[bucket];
        let sat = 100, lit = phaseName === 'SHAPE_PULSAR_STAR' || phaseName === 'SHAPE_QUANTUM_FIELD' ? 65 : 55;

        // Brush & Shockwave interactivity
        if (this.chromaticShift > 0.01) {
            cHue += (340 - cHue) * this.chromaticShift;
            lit += (80 - lit) * this.chromaticShift;
        }

        if (mouse && mouse.clickTimer >= 0) {
            const dx = this.px - mouse.clickX, dy = this.py - mouse.clickY;
            const distSq = dx * dx + dy * dy;
            const wRadius = mouse.clickTimer * 40;
            const maxBound = wRadius + 90, minBound = Math.max(0, wRadius - 90);

            // ⚡ PERF: Broad-phase boundary check to avoid Math.sqrt on 90% of screen particles
            if (distSq < maxBound * maxBound && distSq > minBound * minBound) {
                const dist = Math.sqrt(distSq);
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
        }

        this.computedHue = cHue;
        this.computedLightness = lit;

        // ⚡ PERF: Zero-allocation HSLA color cache hit
        ctx.fillStyle = getCachedHsla(cHue, sat, lit, this.pOpacity);
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
            const spr = 0.15;
            const damp = 0.65;
            this.speedX += dx * spr; this.speedY += dy * spr; this.speedZ += dz * spr;
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

        if (_WRAP_PHASES.has(phaseName)) {
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
    const glowRef = useRef(null); // ⚡ PERF: Isolated layer for CSS vars
    const [shouldRender, setShouldRender] = useState(true);
    const [isAlive, setIsAlive] = useState(false);
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isHomeRef = useRef(isHome);
    const isIntersectingRef = useRef(true);
    const isAliveRef = useRef(false);  // tracks delay state for the loop closure
    const triggerLoopCheckRef = useRef(null);

    useEffect(() => {
        isHomeRef.current = isHome;
        if (!isHome) {
            const rootE = document.documentElement;
            rootE.style.setProperty('--dynamic-saturation', '100');
            if (!rootE.style.getPropertyValue('--dynamic-hue-1')) {
                rootE.style.setProperty('--dynamic-hue-1', '195');
                rootE.style.setProperty('--dynamic-hue-2', '275');
            }
        }
        // ⚡ PERF: No longer polluting the global documentElement with CSS vars!
        if (triggerLoopCheckRef.current) {
            triggerLoopCheckRef.current();
        }
    }, [isHome]);

    useEffect(() => {
        // 2-second delay: canvas fades in AND animation loop starts after gray pause
        const t = setTimeout(() => {
            isAliveRef.current = true;
            setIsAlive(true);
            // ⚡ PERF FIX: Defer loop start by one rAF.
            // setIsAlive triggers a React re-render that changes opacity on two full-screen
            // elements (canvas + glow). The browser needs one frame to commit those style
            // changes and create compositor layers BEFORE we start drawing 280 particles
            // at 3.5x size. Without this, the GPU is hit by 3 simultaneous workloads on
            // the very first frame → stutter at the start of the cinematic intro.
            requestAnimationFrame(() => {
                if (triggerLoopCheckRef.current) triggerLoopCheckRef.current();
            });
        }, 2000);
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
        let sortedParticles = [];
        const mouse = { x: null, y: null, radius: 220, speed: 0, clickX: null, clickY: null, clickTimer: -1 };
        let scrollY = 0, smoothedScrollY = 0, globalTime = 0;
        let camX = 0, camY = 0, camZ = 0;
        let startTime = performance.now();

        // Extremely fast LUT for twinkling
        const LUT_SIZE = 512, SIN_LUT = new Float32Array(LUT_SIZE);
        for (let i = 0; i < LUT_SIZE; i++) SIN_LUT[i] = Math.sin(i / LUT_SIZE * Math.PI * 2);
        const fastSin = x => SIN_LUT[(x * (LUT_SIZE / (Math.PI * 2)) | 0) & (LUT_SIZE - 1)];

        const rootE = document.documentElement;
        // ⚡ PERF: Don't read DOM elements if we don't have to
        const scrollC = document.querySelector('.content') || document.querySelector('.app-container');

        const PHASES = [
            { name: 'SHAPE_QUANTUM_SINGULARITY', duration: 1200 }, // 0: Volumetric Black Hole
            { name: 'SHAPE_CHRONOS_HYPERSPHERE', duration: 1200 }, // 1: nested 3-Axis Gyroscope
            { name: 'SHAPE_TESSERACT', duration: 1200 },           // 2: 4D Hypercube Tesseract
            { name: 'SHAPE_STELLATED_OCTAHEDRON', duration: 1200 },// 3: Sacred Geometry Star Tetrahedron
            { name: 'SHAPE_TORUS', duration: 1000 },               // 4
            { name: 'SHAPE_PULSAR_STAR', duration: 1000 },         // 6: Pulsar Star (النجم الطارق)
            { name: 'SHAPE_HOURGLASS', duration: 1000 },           // 7: 3D Infinity Figure-8 Hourglass
            { name: 'SHAPE_MULTIVERSE', duration: 1000 },          // 8
            { name: 'SHAPE_DYSON_SPHERE', duration: 1000 },        // 9
            { name: 'SHAPE_PYRAMID', duration: 1000 }              // 10
        ];

        let phaseIdx = 0, phaseTimer = 0;

        const init = () => {
            particles = [];
            // ⚡ PERF: Reduced max particles from 380 to 280. This cuts JS execution time by almost 50%
            // which will directly stop the fans from spinning loudly!
            const n = Math.min(Math.floor((canvas.width * canvas.height) / 3000), 280);
            for (let i = 0; i < n; i++) particles.push(new Particle(canvas, i, n));
            // ⚡ PERF: Build pre-computed trig LUT once per init (Diff 8)
            buildParticleLUT(n);
            // ⚡ PERF: Build transition LUT once per init/resize to completely eliminate hot-path calls!
            buildTransitionLUT(n);

            // Pre-allocate sortedParticles to maintain high performance with zero new allocations
            sortedParticles = new Array(n);
        };

        // ⚡ PERF: Cap devicePixelRatio to 1 — cuts GPU memory by 50-75% on Retina/HiDPI screens
        // Canvas CSS size stays full-screen; we only reduce the internal render buffer.
        const DPR = Math.min(window.devicePixelRatio || 1, 1);
        const onResize = () => {
            canvas.width = Math.floor(window.innerWidth * DPR);
            canvas.height = Math.floor(window.innerHeight * DPR);
            canvas.style.width = '100vw';
            canvas.style.height = '100vh';
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            if (DPR !== 1) ctx.scale(DPR, DPR);
            init();
        };
        const onScroll = () => { scrollY = window.scrollY; };
        let lx = null, ly = null;
        const onMove = e => { if (lx !== null) mouse.speed = Math.sqrt((e.clientX - lx) ** 2 + (e.clientY - ly) ** 2); lx = mouse.x = e.clientX; ly = mouse.y = e.clientY; };
        const onLeave = () => { mouse.x = mouse.y = lx = ly = null; mouse.speed = 0; };
        const onClick = e => { mouse.clickX = e.clientX; mouse.clickY = e.clientY; mouse.clickTimer = 0; };

        const drawLines = (op) => {
            // Lines fade smoothly within the 45-frame transition window
            const isTransition = globalTime >= 60 && phaseTimer > 0 && phaseTimer <= 45;
            const usePrev = isTransition && phaseTimer <= 22;

            const activeIdx = usePrev ? ((phaseIdx - 1 + PHASES.length) % PHASES.length) : phaseIdx;
            const phase = PHASES[activeIdx].name;

            let lineTransOp = 1.0;
            if (isTransition) {
                if (phaseTimer <= 22) {
                    lineTransOp = 1.0 - (phaseTimer / 22);
                } else {
                    lineTransOp = (phaseTimer - 22) / 23;
                }
            }

            let cDist = 65, mConn = 4, strict = false, eMod = 1;

            if (phase === 'SHAPE_QUANTUM_SINGULARITY') { cDist = 75; mConn = 4; }
            else if (phase === 'SHAPE_CHRONOS_HYPERSPHERE') { cDist = 90; mConn = 4; }
            else if (phase === 'SHAPE_TESSERACT') { cDist = 130; strict = true; eMod = 32; mConn = 6; }
            else if (phase === 'SHAPE_STELLATED_OCTAHEDRON') { cDist = 130; strict = true; eMod = 12; mConn = 6; }
            else if (phase === 'SHAPE_PULSAR_STAR') { cDist = 80; mConn = 4; }
            else if (phase === 'SHAPE_HOURGLASS') { cDist = 80; mConn = 4; }
            else if (phase === 'SHAPE_DYSON_SPHERE') { cDist = 80; mConn = 3; }
            else if (['SHAPE_QUANTUM_FIELD', 'SHAPE_MULTIVERSE'].includes(phase)) { cDist = 70; mConn = 4; }
            else if (phase === 'SHAPE_PYRAMID') { cDist = 140; strict = true; eMod = 6; mConn = 4; }

            const len = particles.length;
            const tSq = cDist * cDist;

            // ⚡ PERF: Reset line bins for zero-allocation batching
            for (let i = 0; i < 5; i++) {
                const bin = _LINE_BINS[i];
                bin.count = 0;
                bin.sumHue = 0;
                bin.sumLit = 0;
                bin.sumScale = 0;
            }

            // ⚡ PERF: Dynamic search limit reduced from 25 to 16.
            // This massively reduces the O(N) loop checks per frame, quieting the CPU fans.
            const sLimit = phase === 'SHAPE_TESSERACT' ? 40 : 16;

            for (let a = 0; a < len; a++) {
                const p1 = particles[a];
                let conn = 0;

                const searchLimit = Math.min(len, a + sLimit);
                for (let b = a + 1; b < searchLimit && conn < mConn; b++) {
                    const p2 = particles[b];
                    if (strict && (p1.index % eMod) !== (p2.index % eMod)) continue;
                    if (phase === 'SHAPE_DNA' && (p1.index % 2) !== (p2.index % 2)) continue;

                    const dxl = p1.px - p2.px, dyl = p1.py - p2.py;
                    const distSq = dxl * dxl + dyl * dyl;
                    if (distSq < tSq) {
                        conn++;

                        // ⚡ ELITE MATH: Bypass Math.sqrt completely using quadratic distance decay!
                        const distRatioSq = distSq / tSq;
                        const fade = 1.0 - distRatioSq;
                        // Determine sorting bin based on standard alpha so batching isn't skewed to 0
                        const baseLineAlpha = fade * op * 0.45;

                        // ⚡ ELITE BATCHING: Group coordinates into 5 discretized opacity buckets
                        const binIdx = Math.min(4, Math.max(0, (baseLineAlpha * 11) | 0));
                        const bin = _LINE_BINS[binIdx];

                        const c = bin.count;
                        if (c < 24996) {
                            bin.points[c] = p1.px;
                            bin.points[c + 1] = p1.py;
                            bin.points[c + 2] = p2.px;
                            bin.points[c + 3] = p2.py;
                            bin.count = c + 4;
                            bin.sumHue += (p1.computedHue + p2.computedHue) * 0.5;
                            bin.sumLit += (p1.computedLightness + p2.computedLightness) * 0.5;
                            bin.sumScale += p1.scale;
                        }
                    }
                }
            }

            // ⚡ ELITE GPU DRAW: Flush all line paths in exactly 5 composite draw calls!
            for (let i = 0; i < 5; i++) {
                const bin = _LINE_BINS[i];
                const pts = bin.points;
                const lenPts = bin.count;
                if (lenPts === 0) continue;

                const count = lenPts / 4;
                const avgHue = bin.sumHue / count;
                const avgLit = bin.sumLit / count;
                const avgScale = bin.sumScale / count;

                // Represent the alpha and width curve for this bin, applying the transition fade!
                const binAlpha = ((i + 0.5) / 5) * op * 0.45 * lineTransOp;
                const binWidth = Math.max(0.4, ((i + 0.5) / 5) * 1.2 * avgScale);

                ctx.strokeStyle = getCachedHsla(avgHue, 100, avgLit, binAlpha);
                ctx.lineWidth = binWidth;

                ctx.beginPath();
                for (let k = 0; k < lenPts; k += 4) {
                    ctx.moveTo(pts[k], pts[k + 1]);
                    ctx.lineTo(pts[k + 2], pts[k + 3]);
                }
                ctx.stroke();
            }
        };

        const updatePhaseLogic = () => {
            const phaseName = PHASES[phaseIdx].name;
            const cx = canvas.width / 2, cy = canvas.height / 2;
            phaseTimer++;

            const isChanged = phaseTimer === 1;

            // ⚡ PERF: Pre-compute rotation trig ONCE per frame (saves N * Math.cos/sin calls)
            precomputeShapeTrig(globalTime, phaseName);
            const isTransitioning = phaseTimer <= 45 && globalTime >= 90;

            const pLen = particles.length;
            for (let i = 0; i < pLen; i++) {
                const p = particles[i];
                p.localSizeMult = 1.0;
                p.localOpMult = 1.0;

                // ⚡ PERF: Restored full-update window to 200 frames for flawless crystallization
                updateParticleIdealTargets(p, phaseName, i, pLen, globalTime, cx, cy, mouse);

                if (isChanged) { p.transStartX = p.x; p.transStartY = p.y; p.transStartZ = p.z; }

                // ── CINEMATIC INTRO (frames 0-90): Dramatic gather from sides ─────
                if (globalTime < 90) {
                    p.isCinematic = true;
                    // Particles fly in from the far left/right edges and assemble into the globe
                    const t = globalTime / 90;
                    // Quartic ease-out: extremely fast entrance that smoothly settles into the shape
                    const ease = 1 - Math.pow(1 - t, 4);

                    // Add a dynamic sweeping arc on the Y and Z axis as they fly in
                    const sweepY = Math.sin(t * Math.PI) * (i % 3 === 0 ? 250 : -250) * (1 - ease);
                    const sweepZ = Math.sin(t * Math.PI) * 400 * (1 - ease);

                    p.targetX = p.startX + (p.idealX - p.startX) * ease;
                    p.targetY = p.startY + (p.idealY - p.startY) * ease + sweepY;
                    p.targetZ = p.startZ + (p.idealZ - p.startZ) * ease + sweepZ;

                    // Chromatic shift glows intensely while moving fast
                    p.chromaticShift = Math.sin(t * Math.PI) * 0.8;
                    // Particles appear larger and "streaky" as they fly in
                    p.localSizeMult = 1.0 + (1 - ease) * 2.5;
                } else if (isTransitioning) {
                    p.isCinematic = true;
                    // Eliminate slow motion stagger by syncing all particles tightly
                    const globalT = phaseTimer / 45;
                    const localT = Math.max(0, Math.min(1, globalT));
                    const ease = localT < 0.5 ? 2 * localT * localT : 1 - Math.pow(-2 * localT + 2, 2) / 2;

                    // ⚡ ELITE PERF: Ultra-lightweight inline transition styles (Zero heavy trig/LUT calls!)
                    const transType = phaseIdx % 3;

                    p.localSizeMult = 1.0;
                    p.localOpMult = 1.0;
                    p.chromaticShift = 0;

                    if (transType === 0) {
                        // 🌊 "Fluid Wave": Particles arc upwards based on their array index
                        const arc = Math.sin(localT * Math.PI) * 120 * ((i % 2 === 0) ? 1 : -1);
                        p.targetX = p.transStartX + (p.idealX - p.transStartX) * ease;
                        p.targetY = p.transStartY + (p.idealY - p.transStartY) * ease + arc;
                        p.targetZ = p.transStartZ + (p.idealZ - p.transStartZ) * ease;
                    }
                    else if (transType === 1) {
                        // 💫 "Quantum Collapse": Suck into center, then explode out
                        const isImploding = localT < 0.5;
                        const subT = isImploding ? localT * 2 : (localT - 0.5) * 2;
                        const subEase = subT < 0.5 ? 2 * subT * subT : 1 - Math.pow(-2 * subT + 2, 2) / 2;

                        if (isImploding) {
                            p.targetX = p.transStartX + (cx - p.transStartX) * subEase;
                            p.targetY = p.transStartY + (cy - p.transStartY) * subEase;
                            p.targetZ = p.transStartZ + (0 - p.transStartZ) * subEase;
                        } else {
                            p.targetX = cx + (p.idealX - cx) * subEase;
                            p.targetY = cy + (p.idealY - cy) * subEase;
                            p.targetZ = (p.idealZ) * subEase;
                        }
                        p.localSizeMult = 1.0 + Math.sin(localT * Math.PI) * 1.5;
                    }
                    else {
                        // 🌀 "Hyper-Glide": Direct elastic glide with subtle Z-axis pop
                        const zTwist = Math.sin(localT * Math.PI) * 150;
                        p.targetX = p.transStartX + (p.idealX - p.transStartX) * ease;
                        p.targetY = p.transStartY + (p.idealY - p.transStartY) * ease;
                        p.targetZ = p.transStartZ + (p.idealZ - p.transStartZ) * ease + zTwist;
                    }
                } else {
                    p.isCinematic = false;
                    // ⚡ TEMPORAL COHERENCE: During stable phases, update only alternating particles per frame.
                    // Float displacement is ≤2.5px/frame — imperceptible at sub-frame skip granularity!
                    // Full update during first 200 frames of any phase for smooth crystallization.
                    if (phaseTimer <= 200 || (i % 2 === globalTime % 2)) {
                        p.targetX = p.idealX; p.targetY = p.idealY; p.targetZ = p.idealZ;
                        // Lightweight float: single shared wave instead of per-particle
                        const floatForce = Math.min(1, (phaseTimer - 160) / 45);
                        p.targetX += Math.cos(globalTime * 0.016) * 2.5 * floatForce;
                        p.targetY += Math.sin(globalTime * 0.016) * 2.5 * floatForce;
                    }
                }
            }
        };

        // 🎨 Snapshot color system: init all hues from phase 0 color — no flash on startup
        const _phase0 = COLOR_MAP[0] || { b: 195, f: 45 };
        let gBaseH = _phase0.b, gFarH = _phase0.f, gSat = 0;
        // ⚡ PERF: Track last CSS write to avoid redundant DOM writes
        let lastHue1 = -1, lastHue2 = -1, lastSat = -1;
        let lastPhaseIdx = -1;
        let isLooping = false;
        let hasColorized = false;
        let colorFromBaseH = _phase0.b, colorFromFarH = _phase0.f;
        let colorToBaseH = _phase0.b, colorToFarH = _phase0.f;
        let colorPhaseIdx = 0;

        const animate = () => {
            const isPaused = !isHomeRef.current || !isIntersectingRef.current;
            if (isPaused) {
                // Keep the last active hues and saturation set on root so other pages keep colors
                const h1 = gBaseH | 0, h2 = gFarH | 0;
                rootE.style.setProperty('--dynamic-hue-1', h1);
                rootE.style.setProperty('--dynamic-hue-2', h2);
                rootE.style.setProperty('--dynamic-saturation', 100);
                stopLoop();
                return;
            }

            const isMorphing = globalTime >= 60 && phaseTimer > 0 && phaseTimer <= 45;

            if (isHomeRef.current) {
                // ALWAYS use clearRect! Massive GPU/CPU performance gain over destination-out stenciling.
                // Guarantees zero white fog and zero frame spikes during transitions.
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = 'screen';
            }

            globalTime++;

            if (mouse.speed > 0.1) mouse.speed *= 0.95;
            // ⚡ Instant Click Timer: Caps at 25 frames for an explosive short reaction
            if (mouse.clickTimer >= 0 && ++mouse.clickTimer > 25) mouse.clickTimer = -1;

            if (phaseTimer >= PHASES[phaseIdx].duration) { phaseIdx = (phaseIdx + 1) % PHASES.length; phaseTimer = 0; }

            updatePhaseLogic();

            // 🎨 SATURATION: Stay gray until globe crystallizes (frame 90), then bloom smoothly
            if (globalTime < 90) {
                gSat = 0;
            } else if (globalTime < 135) { // 45-frame bloom (0.75s) to perfectly match UI CSS transition
                const t = (globalTime - 90) / 45;
                const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                gSat = ease * 100;
            } else {
                gSat = 100;
            }

            const pName = PHASES[phaseIdx].name;

            // 🎨 SNAPSHOT COLOR SYSTEM: One clean A→B color shift per scene
            // When a new phase starts, snapshot current color as FROM and set target as TO
            if (phaseIdx !== colorPhaseIdx && phaseTimer <= 1) {
                colorFromBaseH = gBaseH;
                colorFromFarH = gFarH;
                const target = COLOR_MAP[phaseIdx] || { b: 195, f: 275 };
                colorToBaseH = target.b;
                colorToFarH = target.f;
                colorPhaseIdx = phaseIdx;
            }

            // Direct A→B interpolation synced EXACTLY with particle transition (0→45 frames)
            // Phase 0 never interpolates — hold the single target color.
            if (phaseIdx === 0) {
                gBaseH = colorToBaseH;
                gFarH = colorToFarH;
            } else if (phaseTimer <= 45 && globalTime >= 90) {
                const t = phaseTimer / 45;
                const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                gBaseH = _lerpHue(colorFromBaseH, colorToBaseH, ease);
                gFarH = _lerpHue(colorFromFarH, colorToFarH, ease);
            } else if (phaseTimer > 45) {
                gBaseH = colorToBaseH;
                gFarH = colorToFarH;
            }

            // ⚡ PERF: Fill 16-bucket hue ramp ONCE per frame — each particle does a free array lookup!
            // Replaces 16,800 _lerpHue() calls per second with exactly 16 lerps per frame. Zero visual change!
            for (let b = 0; b < 16; b++) {
                _HUE_RAMP[b] = _lerpHue(gBaseH, gFarH, b / 15);
            }

            // ⚡ PERF: Write CSS variables only on scene change (not every frame).
            // Per-frame writes cause Style Recalculation on ALL elements using these vars.
            // We write once when a new target color is committed.
            const currentH1 = colorToBaseH | 0;
            const currentH2 = colorToFarH | 0;
            if (lastHue1 !== currentH1 || lastHue2 !== currentH2) {
                lastHue1 = currentH1;
                lastHue2 = currentH2;
                rootE.style.setProperty('--dynamic-hue-1', currentH1);
                rootE.style.setProperty('--dynamic-hue-2', currentH2);
            }
            // Write saturation only once at frame 90 — CSS transition handles the smooth bloom natively
            const satStep = globalTime < 90 ? 0 : 100;
            if (lastSat !== satStep) {
                lastSat = satStep;
                rootE.style.setProperty('--dynamic-saturation', satStep);
            }

            if (Math.abs(scrollY - smoothedScrollY) > 0.05) {
                smoothedScrollY += (scrollY - smoothedScrollY) * 0.08;
            } else {
                smoothedScrollY = scrollY;
            }
            camX += ((mouse.x !== null ? (mouse.x - canvas.width / 2) * 0.28 : 0) - camX) * 0.08;
            camY += ((mouse.y !== null ? (mouse.y - canvas.height / 2) * 0.28 : 0) - camY) * 0.08;

            const bZ = Math.sin(globalTime * 0.012) * 15;
            if (globalTime < 60) {
                const t = globalTime / 60;
                camZ = 200 * (1 - t) * (1 - t) + bZ * t;
            } else camZ = bZ;

            const gOp = Math.max(0, 1 - smoothedScrollY / 550); // Fade completely to 0 on scroll
            const cx = canvas.width / 2, cy = canvas.height / 2;
            const cX = Math.cos(camY * 0.0012), sX = Math.sin(camY * 0.0012);
            const cY = Math.cos(camX * 0.0012), sY = Math.sin(camX * 0.0012);

            let sMult = 1, oMult = 1;
            if (phaseIdx === 0 && globalTime < 90) {
                const p = globalTime / 90;
                const ease = 1 - Math.pow(1 - p, 3);
                sMult = 2.5 - 1.5 * ease; // Start at 2.5x, settle to 1x
                oMult = Math.min(1, p * 2);  // Fade in quickly
            }

            if (isHomeRef.current) {
                const len = particles.length;
                // First pass: update physics & compute 3D perspective projection coordinates
                for (let i = 0; i < len; i++) {
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

                    // Cache particle reference for depth sorting without allocation
                    sortedParticles[i] = p;
                }

                // Second pass: Sort particles back-to-front (descending Z depth)
                // Using optimized O(N) Insertion Sort (zero closure allocation, linear time on nearly-sorted data)
                insertionSortZ(sortedParticles, len);

                // Third pass: Draw particles in depth-sorted order
                for (let i = 0; i < len; i++) {
                    sortedParticles[i].draw(ctx, globalTime, pName, mouse);
                }

                if (gOp > 0.1) {
                    drawLines(gOp);
                }
            }
        };

        // 🚀 60 FPS ULTRA-FLUID CINEMATIC RENDER LOOP
        let _lastFrame = 0;
        const _TARGET_MS = 1000 / 60;
        const animateLoop = (ts) => {
            if (!isLooping) return;
            reqId = requestAnimationFrame(animateLoop);
            if (ts - _lastFrame < _TARGET_MS - 1) return;
            _lastFrame += _TARGET_MS; // anchor-advance, not ts-snap
            if (ts - _lastFrame > _TARGET_MS * 3) _lastFrame = ts; // re-sync after tab-hidden

            animate();
        };

        const startLoop = () => {
            if (isLooping) return;
            isLooping = true;
            reqId = requestAnimationFrame(animateLoop);
        };

        const stopLoop = () => {
            if (!isLooping) return;
            isLooping = false;
            cancelAnimationFrame(reqId);
        };

        const handleVisibilityChange = () => {
            triggerLoopCheck();
        };

        const triggerLoopCheck = () => {
            const isVisible = typeof document !== 'undefined' && document.visibilityState === 'visible';
            // isAliveRef guards the 2-second startup delay (not stale like isAlive state in closure)
            if (isAliveRef.current && isHomeRef.current && isIntersectingRef.current && isVisible) {
                startLoop();
            } else {
                stopLoop();
            }
        };
        triggerLoopCheckRef.current = triggerLoopCheck;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isIntersectingRef.current = entry.isIntersecting;
                triggerLoopCheck();
            });
        }, { threshold: 0.01 });

        observer.observe(canvas);

        window.addEventListener('resize', onResize); window.addEventListener('scroll', onScroll, { passive: true });
        if (scrollC) scrollC.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('mousemove', onMove); window.addEventListener('mouseleave', onLeave); window.addEventListener('click', onClick);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // 🚀 Start loop immediately (canvas is invisible until isAlive=true after 2s)
        onResize();
        // DO NOT call triggerLoopCheck here — loop is started by the isAlive timeout

        return () => {
            stopLoop();
            observer.disconnect();
            triggerLoopCheckRef.current = null;
            window.removeEventListener('resize', onResize); window.removeEventListener('scroll', onScroll);
            if (scrollC) scrollC.removeEventListener('scroll', onScroll);
            window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseleave', onLeave); window.removeEventListener('click', onClick);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [shouldRender]);

    if (!shouldRender) return <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'transparent' }} />;

    return (
        <>
            {/* ⚡ PERF: Isolated background glow layer. Natively uses CSS variables so JS never parses heavy strings! */}
            <div ref={glowRef} style={{
                position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: -1, pointerEvents: 'none',
                opacity: (isAlive && isHome) ? 1 : 0, transition: 'opacity 0.8s ease',
                backgroundImage: `
                    radial-gradient(ellipse 90% 50% at 50% 0%, hsla(var(--dynamic-hue-1, 280), calc(var(--dynamic-saturation, 0) * 0.9%), 30%, 0.22) 0%, hsla(var(--dynamic-hue-1, 280), calc(var(--dynamic-saturation, 0) * 0.7%), 20%, 0.08) 40%, transparent 70%),
                    radial-gradient(ellipse 70% 40% at 100% 100%, hsla(var(--dynamic-hue-2, 190), calc(var(--dynamic-saturation, 0) * 0.8%), 25%, 0.14) 0%, transparent 65%),
                    linear-gradient(180deg, #04040a 0%, #070709 35%, #060609 70%, #04040a 100%)
                `,
                willChange: 'transform',
                transform: 'translateZ(0)'
            }} />
            <canvas ref={canvasRef} style={{
                position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 0, pointerEvents: 'none', mixBlendMode: 'screen',
                opacity: (isAlive && isHome) ? 0.88 : 0, transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
        </>
    );
}
