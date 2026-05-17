'use client';
import React, { useEffect, useRef } from 'react';
import { updateParticleIdealTargets } from './particleGenerators';

/**
 * 🌌 Particle Class - Advanced 3D Engine Physics & Depth Logic
 */
class Particle {
    constructor(canvas, index, total) {
        this.canvas = canvas;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.z = Math.random() * 400 - 200; // Depth between -200 (close) and +200 (far)
        this.size = Math.random() * 2 + 0.5;

        // Base drift speeds in 3D space
        this.baseSpeedX = Math.random() * 1 - 0.5;
        this.baseSpeedY = Math.random() * 1 - 0.5;
        this.baseSpeedZ = Math.random() * 0.8 - 0.4;

        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.speedZ = this.baseSpeedZ;

        this.density = (Math.random() * 25) + 1;

        // Shape targets in 3D space
        this.targetX = null;
        this.targetY = null;
        this.targetZ = null;

        // Stable JIT ideal target placeholders for zero-allocation performance
        this.idealX = this.x;
        this.idealY = this.y;
        this.idealZ = this.z;

        // Projected 2D coordinates for screen drawing & line connection
        this.px = this.x;
        this.py = this.y;
        this.pSize = this.size;
        this.pOpacity = 0.8;
        this.scale = 1;
        this.rotatedZ = this.z;

        this.index = index;
        this.total = total;
        this.chromaticShift = 0;
        this.computedHue = 195;
        this.computedLightness = 55;
    }

    /**
     * Draw individual particle with dynamic depth coloring & advanced chromatic shifting
     */
    draw(ctx, time, phaseName) {
        if (this.pOpacity <= 0) return;

        // 1. Calculate base depth ratio (0.0 foreground, 1.0 background)
        const depthRatio = Math.max(0, Math.min(1, (this.z + 200) / 500));

        // 2. Define Phase-Specific Palettes (Hues)
        let baseHue = 195; // Default Cyan (Foreground)
        let farHue = 275;  // Default Violet (Background)
        let saturation = 100;
        let lightness = 55;

        // Custom phase color signatures
        if (phaseName === 'SHAPE_DNA') {
            baseHue = 320; // Magenta
            farHue = 200;  // Cyan
        } else if (phaseName === 'SHAPE_BRAIN') {
            baseHue = 210; // Electric Blue
            farHue = 45;   // Deep Gold
        } else if (phaseName === 'SHAPE_ATOM') {
            baseHue = 160; // Emerald Green
            farHue = 280;  // Royal Purple
        } else if (phaseName === 'SHAPE_BLACKHOLE') {
            baseHue = 0;   // Crimson Red
            farHue = 35;   // Solar Orange
            lightness = 50;
        } else if (phaseName === 'SHAPE_WARP_DRIVE') {
            baseHue = 180; // Electric Teal
            farHue = 240;  // Warp Blue
            lightness = 65; // Extra bright
        } else if (phaseName === 'SHAPE_MULTIVERSE') {
            // Rainbow prism shifting over time and index
            baseHue = (time * 0.15 + this.index * 1.5) % 360;
            farHue = (baseHue + 120) % 360;
        }

        // 3. Depth Interpolation of Hue
        let currentHue = baseHue + depthRatio * (farHue - baseHue);

        // 4. Mouse Interactive Chromatic Shift (Supernova Paintbrush)
        // Shines a hot golden-rose glow on hover
        if (this.chromaticShift > 0.01) {
            const hoverHue = 340; // Hot Pink/Rose Gold
            currentHue = currentHue + (hoverHue - currentHue) * this.chromaticShift;
            saturation = 100;
            lightness = lightness + (80 - lightness) * this.chromaticShift; // Boost brightness to make it glow!
        }

        // Cache computed color states for lines to inherit them
        this.computedHue = currentHue;
        this.computedLightness = lightness;

        ctx.fillStyle = `hsla(${currentHue}, ${saturation}%, ${lightness}%, ${this.pOpacity})`;
        ctx.beginPath();
        ctx.arc(this.px, this.py, this.pSize, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    /**
     * 3D Physics update and interactive screen behavior
     */
    update(mouse, phaseName, centerX, centerY, time) {
        if (phaseName === 'STILL') {
            // Apply high friction in 3D
            this.speedX *= 0.88;
            this.speedY *= 0.88;
            this.speedZ *= 0.88;
            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;
        } else if (phaseName === 'VORTEX') {
            // Spiral towards center (Whirlpool effect) in 3D
            let dx = centerX - this.x;
            let dy = centerY - this.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // Tangent vector for spiral
            let tx = dy;
            let ty = -dx;

            // Normalize and scale speed
            let length = Math.sqrt(tx * tx + ty * ty) || 1;
            tx = (tx / length) * 8;
            ty = (ty / length) * 8;

            // Inward pull
            let pull = 0.05;
            tx += dx * pull;
            ty += dy * pull;

            this.speedX += (tx - this.speedX) * 0.08;
            this.speedY += (ty - this.speedY) * 0.08;

            // Pull Z towards deep background singularity
            let dz = 220 - this.z;
            this.speedZ += (dz - this.speedZ) * 0.05;

            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;
        } else if (phaseName === 'BREATHE') {
            // Slowly expand and contract in 3D space
            let dx = this.x - centerX;
            let dy = this.y - centerY;
            let dist = Math.sqrt(dx * dx + dy * dy) || 1;

            // Sine wave for breathing (expansion/contraction)
            let breatheForce = Math.sin(time * 0.03) * 1.5;
            let breatheForceZ = Math.cos(time * 0.03 + this.index) * 1.2;

            this.speedX += (dx / dist) * breatheForce * 0.1;
            this.speedY += (dy / dist) * breatheForce * 0.1;
            this.speedZ += breatheForceZ * 0.05;

            // Add wander back in
            this.speedX += (this.baseSpeedX * 0.5 - this.speedX) * 0.05;
            this.speedY += (this.baseSpeedY * 0.5 - this.speedY) * 0.05;
            this.speedZ += (this.baseSpeedZ * 0.5 - this.speedZ) * 0.05;

            this.speedX *= 0.96; // friction
            this.speedY *= 0.96;
            this.speedZ *= 0.96;

            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;
        } else if (this.targetX !== null && this.targetY !== null && this.targetZ !== null) {
            // Move smoothly towards 3D shape targets
            let dx = this.targetX - this.x;
            let dy = this.targetY - this.y;
            let dz = this.targetZ - this.z;

            // Premium spring physics - makes particles accelerate, overshoot slightly, and settle organically
            const springStrength = 0.004 + (this.index % 4) * 0.0015; // individual variations to create liquid morphing
            const damping = 0.84 + (this.index % 3) * 0.02;           // organic damping variations

            this.speedX += dx * springStrength;
            this.speedY += dy * springStrength;
            this.speedZ += dz * springStrength;

            // Apply friction/damping to velocities
            this.speedX *= damping;
            this.speedY *= damping;
            this.speedZ *= damping;

            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;

            // Subtle 3D floating effect while in shape to keep it organic and alive
            this.y += Math.sin(time * 0.05 + this.index) * 0.4;
            this.x += Math.cos(time * 0.04 + this.index) * 0.3;
            this.z += Math.sin(time * 0.03 + this.index) * 0.3;
        } else {
            // WANDER, WANDER_FAST, or EXPLODE
            if (phaseName === 'WANDER') {
                // Smooth flocking drift in 3D
                this.speedX += (this.baseSpeedX - this.speedX) * 0.02;
                this.speedY += (this.baseSpeedY - this.speedY) * 0.02;
                this.speedZ += (this.baseSpeedZ - this.speedZ) * 0.02;

                // Subtle organic wave
                this.y += Math.sin(time * 0.02 + this.index) * 0.5;
                this.z += Math.cos(time * 0.02 + this.index) * 0.3;
            } else if (phaseName === 'WANDER_FAST') {
                // Chaotic rapid swimming in 3D
                this.speedX *= 0.99;
                this.speedY *= 0.99;
                this.speedZ *= 0.99;
                this.speedX += (Math.random() - 0.5) * 0.6;
                this.speedY += (Math.random() - 0.5) * 0.6;
                this.speedZ += (Math.random() - 0.5) * 0.6;
            } else if (phaseName === 'EXPLODE') {
                // Big bang inertia drift
                this.speedX *= 0.96;
                this.speedY *= 0.96;
                this.speedZ *= 0.96;
            }
            this.x += this.speedX;
            this.y += this.speedY;
            this.z += this.speedZ;
        }

        // Boundary wrap for non-shape phases in 3D space
        if (['WANDER', 'WANDER_FAST', 'EXPLODE', 'BREATHE', 'VORTEX'].includes(phaseName)) {
            if (this.x > this.canvas.width) this.x = 0;
            else if (this.x < 0) this.x = this.canvas.width;
            if (this.y > this.canvas.height) this.y = 0;
            else if (this.y < 0) this.y = this.canvas.height;
            if (this.z > 300) this.z = -200;
            else if (this.z < -200) this.z = 300;
        }

        // Mouse interaction (Repel on screen projected coords + Chromatic Brush Shift)
        if (mouse.x !== null) {
            let dx = mouse.x - this.px;
            let dy = mouse.y - this.py;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouse.radius - distance) / mouse.radius;

                // Repel the absolute coordinates. Scale strength by perspective
                const pushStrength = force * this.density * 0.75 * (1 / (this.scale || 1));
                this.x -= forceDirectionX * pushStrength;
                this.y -= forceDirectionY * pushStrength;

                // Displace in Z-depth to create an interactive "depth dent" under mouse
                this.z += (Math.random() - 0.3) * pushStrength * 0.8;

                // Charge chromatic brush shift based on proximity
                const charge = 1 - (distance / mouse.radius);
                this.chromaticShift += (charge - this.chromaticShift) * 0.18;
            } else {
                // Dissipate charge
                this.chromaticShift += (0 - this.chromaticShift) * 0.06;
            }
        } else {
            // Dissipate charge
            this.chromaticShift += (0 - this.chromaticShift) * 0.06;
        }
    }
}

/**
 * 🌌 InteractiveParticles - Elite Cinematic 3D Lifecycle Edition
 */
const InteractiveParticles = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const mouse = { x: null, y: null, radius: 220 };
        let scrollY = 0;
        let globalTime = 0;

        // Camera position vectors for 3D simulation
        let cameraX = 0;
        let cameraY = 0;
        let cameraZ = 0;

        // 📖 The Story of Cosmic Intelligence: Extended Theatrical Lifecycle (19 Stages)
        const PHASES = [
            { name: 'SHAPE_DNA', duration: 1200 },       // 1. Biological Genesis (3D Double Helix)
            { name: 'SHAPE_BRAIN', duration: 1250 },     // 2. Human Intelligence (3D Brain Network)
            { name: 'SHAPE_ATOM', duration: 1150 },      // 3. Scientific Discovery (Tilted Orbit Atom)
            { name: 'SHAPE_TREE', duration: 1200 },      // 4. Tree of Knowledge (3D Neural Canopy)
            { name: 'SHAPE_GRID', duration: 1150 },      // 5. The Digital Era (3D Matrix Corridor)
            { name: 'SHAPE_NEURAL_SYNAPSE', duration: 1250 }, // 6. Cognitive Processing (Active Synaptic Sparks)
            { name: 'SHAPE_EYE', duration: 1250 },       // 7. AI Awakening (3D Responsive Lens Eye)
            { name: 'SHAPE_HOURGLASS', duration: 1150 }, // 8. Flow of Time (Twisting Double Cone)
            { name: 'SHAPE_HEXAGON', duration: 1200 },   // 9. Structural Perfection (Extruded Elite Hub)
            { name: 'SHAPE_GALAXY', duration: 1250 },    // 10. Cosmic Expansion (Tilted Spiral Galaxy)
            { name: 'WANDER', duration: 1200 },          // 11. Primordial Soup (Free drifting)

            // 🚀 Elite Futuristic Megastructure Scenes:
            { name: 'SHAPE_TESSERACT', duration: 1350 },   // 12. Higher Dimensionality (4D Hypercube projection)
            { name: 'SHAPE_BLACKHOLE', duration: 1400 },   // 13. Spacetime Singularity (Gravitational Lens & disk)
            { name: 'SHAPE_DYSON_SPHERE', duration: 1350 },// 14. Stellar Engineering (Gyro Cross-Orbit Swarm)
            { name: 'SHAPE_TORUS', duration: 1300 },       // 15. Zero-Point Energy (Sacred Geometry Torus Loop)

            // 🚀 The 3 New Ascended Interstellar Cosmic Scenes:
            { name: 'SHAPE_QUANTUM_FIELD', duration: 1300 }, // 16. Quantum Entanglement Mirror Superposition
            { name: 'SHAPE_WARP_DRIVE', duration: 1350 },   // 17. Alcubierre Hyperspeed Warp Drive Tunnel
            { name: 'SHAPE_MULTIVERSE', duration: 1400 },   // 18. Multiverse Dimensional Portal Core

            { name: 'VORTEX', duration: 700 },          // 19. The Singularity (Deep coordinate suction)
            { name: 'SHAPE_CORE', duration: 200 },      // 20. Absolute Core Compression
            { name: 'EXPLODE', duration: 350 },         // 21. The Big Bang shockwave
            { name: 'STILL', duration: 400 },           // 22. Silent Cosmic Void
            { name: 'BREATHE', duration: 900 }          // 23. Cosmic Rebirth (3D Breathing Network)
        ];

        let currentPhaseIndex = 0;
        let phaseTimer = 0;

        const init = () => {
            particles = [];
            // Safe, optimal density of 260 particles on high-res monitors
            const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 4500), 260);
            for (let i = 0; i < numberOfParticles; i++) {
                particles.push(new Particle(canvas, i, numberOfParticles));
            }
        };

        const resize = () => {
            if (typeof window !== 'undefined') {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                init();
            }
        };

        const handleScroll = (e) => {
            const target = e ? e.target : null;
            scrollY = window.scrollY
                || (target && typeof target.scrollTop === 'number' ? target.scrollTop : 0)
                || (document.documentElement ? document.documentElement.scrollTop : 0)
                || (document.body ? document.body.scrollTop : 0)
                || 0;
        };
        const handleMouseMove = (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        };
        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
        };

        /**
         * 3D Connected Line Constellation: Filters connections by spatial coordinates & depth diff
         */
        const connect = (opacity) => {
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].px - particles[b].px;
                    const dy = particles[a].py - particles[b].py;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Avoid linking foreground nodes to background nodes (looks messy in 3D)
                    const dz = particles[a].rotatedZ - particles[b].rotatedZ;

                    if (distance < 110 && Math.abs(dz) < 120) {
                        const baseLineOpacity = (1 - (distance / 110)) * ((particles[a].pOpacity + particles[b].pOpacity) / 2);
                        const lineOpacity = Math.max(0.2, baseLineOpacity); // Strong minimum connection glow

                        // Line color inherits the dynamic HSL of both connected particles
                        const avgHue = (particles[a].computedHue + particles[b].computedHue) / 2;
                        const avgLightness = (particles[a].computedLightness + particles[b].computedLightness) / 2;

                        ctx.strokeStyle = `hsla(${avgHue}, 100%, ${avgLightness}%, ${lineOpacity * 0.85})`;
                        ctx.lineWidth = 1.1 * ((particles[a].scale + particles[b].scale) / 2);
                        ctx.beginPath();
                        ctx.moveTo(particles[a].px, particles[a].py);
                        ctx.lineTo(particles[b].px, particles[b].py);
                        ctx.stroke();
                    }
                }
            }
        };

        /**
         * Recalculate mathematical shapes (both static and moving/rotating equations)
         */
        const updatePhase = (centerX, centerY, time) => {
            phaseTimer++;
            let phaseChanged = false;
            if (phaseTimer > PHASES[currentPhaseIndex].duration) {
                currentPhaseIndex = (currentPhaseIndex + 1) % PHASES.length;
                phaseTimer = 0;
                phaseChanged = true;
            }

            const phaseName = PHASES[currentPhaseIndex].name;
            const phaseDuration = PHASES[currentPhaseIndex].duration;

            // Recalculate targets on every frame for moving shapes, otherwise once on transition
            const isDynamicMovingShape = [
                'SHAPE_DNA', 'SHAPE_ATOM', 'SHAPE_GALAXY', 'SHAPE_EYE',
                'SHAPE_TESSERACT', 'SHAPE_BLACKHOLE', 'SHAPE_DYSON_SPHERE',
                'SHAPE_TORUS', 'SHAPE_HOURGLASS',
                'SHAPE_NEURAL_SYNAPSE', 'SHAPE_QUANTUM_FIELD', 'SHAPE_WARP_DRIVE', 'SHAPE_MULTIVERSE'
            ].includes(phaseName);

            if (phaseChanged || isDynamicMovingShape) {
                const DISSOLVE_FRAMES = 100;
                const ASSEMBLE_FRAMES = 120;
                const TOTAL_TRANSITION_FRAMES = DISSOLVE_FRAMES + ASSEMBLE_FRAMES;

                particles.forEach((p, i) => {
                    // 1. Early return for free dynamic non-shape phases
                    if (['WANDER', 'VORTEX', 'BREATHE', 'EXPLODE', 'STILL'].includes(phaseName)) {
                        p.targetX = null;
                        p.targetY = null;
                        p.targetZ = null;

                        if (phaseName === 'EXPLODE') {
                            const dx = p.x - centerX;
                            const dy = p.y - centerY;
                            const dz = p.z;
                            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
                            const force = Math.random() * 35 + 20;
                            p.speedX = (dx / dist) * force;
                            p.speedY = (dy / dist) * force;
                            p.speedZ = (dz / dist) * force;
                        }
                        return; // Skip to next particle
                    }

                    // 2. Compute the IDEAL structured shape coordinate matrix using the JIT-optimized zero-allocation helper
                    updateParticleIdealTargets(
                        p, phaseName, i, p.total, time, centerX, centerY, mouse
                    );

                    // 🌀 3. Cinematic Choreographed Morphing & Spatial Pipeline
                    if (phaseTimer < DISSOLVE_FRAMES) {
                        // Stage 1: Dissolve & Swirl - Recede deep into background Z-space
                        const t_dissolve = phaseTimer / DISSOLVE_FRAMES; // 0.0 to 1.0

                        // Calculate swirling orbital coordinate in deep cosmic space
                        const swirlAngle = (i * 0.16) + (time * 0.008) + (t_dissolve * Math.PI * 2.8);
                        const swirlRadius = 30 + (i % 7) * 40 + (1 - t_dissolve) * 160;

                        const swirlX = centerX + Math.cos(swirlAngle) * swirlRadius;
                        const swirlY = centerY + Math.sin(swirlAngle) * swirlRadius;
                        const swirlZ = 280 + (i % 4) * 75; // Deep cosmic background

                        p.targetX = swirlX;
                        p.targetY = swirlY;
                        p.targetZ = swirlZ;
                    } else if (phaseTimer < TOTAL_TRANSITION_FRAMES) {
                        // Stage 2: Fly-in & Assemble - Assemble forward with Cubic Ease-In-Out
                        const t_assemble = (phaseTimer - DISSOLVE_FRAMES) / ASSEMBLE_FRAMES; // 0.0 to 1.0

                        // Cubic ease-in-out curve for deceleration feel
                        const ease = t_assemble < 0.5
                            ? 4 * t_assemble * t_assemble * t_assemble
                            : 1 - Math.pow(-2 * t_assemble + 2, 3) / 2;

                        const swirlAngle = (i * 0.16) + (time * 0.008) + (Math.PI * 2.8);
                        const swirlRadius = 30 + (i % 7) * 40;

                        const swirlX = centerX + Math.cos(swirlAngle) * swirlRadius;
                        const swirlY = centerY + Math.sin(swirlAngle) * swirlRadius;
                        const swirlZ = 280 + (i % 4) * 75;

                        p.targetX = swirlX + (p.idealX - swirlX) * ease;
                        p.targetY = swirlY + (p.idealY - swirlY) * ease;
                        p.targetZ = swirlZ + (p.idealZ - swirlZ) * ease;
                    } else {
                        // Stage 3: Display Stage - Fully formed, majestic, stable 3D constellation
                        p.targetX = p.idealX;
                        p.targetY = p.idealY;
                        p.targetZ = p.idealZ;
                    }
                });
            }
        };

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            globalTime++;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // 🔄 Step 1: Update target coordinate matrices
            updatePhase(centerX, centerY, globalTime);

            const currentPhaseName = PHASES[currentPhaseIndex].name;

            // 🌟 Dynamic hardware-accelerated CSS opacity fading:
            // 100% full crisp visibility at top (scrollY = 0)
            // Fades smoothly to exactly 20% (0.20) as the user scrolls down (within 150px) for maximum readability
            const scrollFadeRange = 150;
            const canvasOpacity = Math.max(0.20, 1 - (Math.min(scrollY, scrollFadeRange) / scrollFadeRange) * 0.80);
            canvas.style.opacity = canvasOpacity;

            // Keep internal drawing fully crisp and luminous
            const globalOpacity = 1.0;

            // Sweeping transition zoom impulse: pulls particles forward, then recedes them
            let transitionZoom = 0;
            if (phaseTimer < 140) {
                // Starts at 0, peaks at 180px in 3D camera depth, then returns to 0
                transitionZoom = Math.sin((phaseTimer / 140) * Math.PI) * 180;
            }

            // 🎥 Step 2: Smooth 3D Camera Depth Pan and Parallax Breathing
            const targetCameraX = (mouse.x !== null) ? (mouse.x - centerX) * 0.22 : 0;
            const targetCameraY = (mouse.y !== null) ? (mouse.y - centerY) * 0.22 : 0;

            // Oscillates in Z-space + sweeps forward during transitions
            const targetCameraZ = Math.sin(globalTime * 0.008) * 140 - transitionZoom;

            cameraX += (targetCameraX - cameraX) * 0.04;
            cameraY += (targetCameraY - cameraY) * 0.04;
            cameraZ += (targetCameraZ - cameraZ) * 0.04;

            // Rotational angles of the camera in radians for true 3D perspective rotation
            const rotX = cameraY * 0.0012; // tilt camera vertically (X rotation)
            const rotY = cameraX * 0.0012; // rotate camera horizontally (Y rotation)

            const cosX = Math.cos(rotX);
            const sinX = Math.sin(rotX);
            const cosY = Math.cos(rotY);
            const sinY = Math.sin(rotY);

            // 📐 Step 3: Run Particle 3D Projective Mathematics
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.update(mouse, currentPhaseName, centerX, centerY, globalTime);

                // Coordinate subtraction relative to origin (centerX, centerY) before rotation
                const rx = p.x - centerX;
                const ry = p.y - centerY;
                const rz = p.z; // absolute Z coordinate

                // 1. Rotate around X-axis (tilt vertically)
                const y1 = ry * cosX - rz * sinX;
                const z1 = ry * sinX + rz * cosX;

                // 2. Rotate around Y-axis (orbit horizontally)
                const x2 = rx * cosY - z1 * sinY;
                const z2 = rx * sinY + z1 * cosY;

                // Cache rotated depth for connection line calculations in camera-space
                p.rotatedZ = z2;

                // Apply camera depth shifts (breathing + morph zoom)
                const finalRZ = z2 + cameraZ;

                // Safe focal length equation (prevents dividing by zero or massive blowouts)
                const clampedRZ = Math.max(-280, finalRZ);
                const scale = 360 / (360 + clampedRZ);

                // Project rotated coordinates into screen space
                p.px = centerX + x2 * scale;
                p.py = centerY + y1 * scale;
                p.scale = scale;
                p.pSize = Math.max(0.2, p.size * scale);

                // Near-plane and far-plane clipping to mimic professional 3D camera depth-of-field
                let nearFade = 1;
                if (clampedRZ < -150) {
                    nearFade = Math.max(0, (clampedRZ + 280) / 130);
                }
                const farFade = Math.max(0.6, 1 - (clampedRZ - 100) / 600); // Softer far-depth fade

                // High-fidelity individual starlight twinkling phase
                const twinkle = Math.sin(globalTime * 0.05 + i * 1.5) * 0.15 + 0.85;

                p.pOpacity = globalOpacity * Math.max(0.42, scale) * nearFade * farFade * twinkle * 1.15; // Solid, vibrant particle presence

                p.draw(ctx, globalTime, currentPhaseName);
            }

            // 🕸️ Step 4: Draw depth-filtered connecting line constellations
            if (globalOpacity > 0.1) {
                connect(globalOpacity);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        document.addEventListener('scroll', handleScroll, { capture: true, passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            document.removeEventListener('scroll', handleScroll, { capture: true });
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 0,
                background: 'transparent',
                opacity: 1
            }}
        />
    );
};

export default InteractiveParticles;
