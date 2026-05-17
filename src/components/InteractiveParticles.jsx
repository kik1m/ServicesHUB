'use client';
import React, { useEffect, useRef } from 'react';

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

        // Projected 2D coordinates for screen drawing & line connection
        this.px = this.x;
        this.py = this.y;
        this.pSize = this.size;
        this.pOpacity = 0.8;
        this.scale = 1;
        this.rotatedZ = this.z;

        this.index = index;
        this.total = total;
    }

    /**
     * Draw individual particle with dynamic depth coloring (Neon Cyan -> Electric Violet)
     */
    draw(ctx) {
        if (this.pOpacity <= 0) return;

        // Dynamic color interpolation based on depth (Z + cameraZ relative to screen)
        // Maps depth from foreground (cyan) to deep background (violet)
        const depthRatio = Math.max(0, Math.min(1, (this.z + 200) / 500));

        const r = Math.round(0 + depthRatio * 160);
        const g = Math.round(220 * (1 - depthRatio));
        const b = 255;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.pOpacity})`;
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

        // Mouse interaction (Repel on screen projected coords)
        if (mouse.x != null) {
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
            }
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
            { name: 'WANDER', duration: 1200 },          // 1. Primordial Soup (Free drifting)
            { name: 'SHAPE_DNA', duration: 1200 },       // 2. Biological Genesis (3D Double Helix)
            { name: 'SHAPE_BRAIN', duration: 1250 },     // 3. Human Intelligence (3D Brain Network)
            { name: 'SHAPE_ATOM', duration: 1150 },      // 4. Scientific Discovery (Tilted Orbit Atom)
            { name: 'SHAPE_TREE', duration: 1200 },      // 5. Tree of Knowledge (3D Neural Canopy)
            { name: 'SHAPE_GRID', duration: 1150 },      // 6. The Digital Era (3D Matrix Corridor)
            { name: 'SHAPE_NEURAL_SYNAPSE', duration: 1250 }, // 7. Cognitive Processing (Active Synaptic Sparks)
            { name: 'SHAPE_EYE', duration: 1250 },       // 8. AI Awakening (3D Responsive Lens Eye)
            { name: 'SHAPE_HOURGLASS', duration: 1150 }, // 9. Flow of Time (Twisting Double Cone)
            { name: 'SHAPE_HEXAGON', duration: 1200 },   // 10. Structural Perfection (Extruded Elite Hub)
            { name: 'SHAPE_GALAXY', duration: 1250 },    // 11. Cosmic Expansion (Tilted Spiral Galaxy)

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

        const handleScroll = () => { scrollY = window.scrollY; };
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

                        // Line color shifts dynamically along with particle average depth
                        const avgZ = (particles[a].rotatedZ + particles[b].rotatedZ) / 2;
                        const depthRatio = Math.max(0, Math.min(1, (avgZ + 200) / 500));
                        const colorR = Math.round(0 + depthRatio * 160);
                        const colorG = Math.round(220 * (1 - depthRatio));
                        const colorB = 255;

                        ctx.strokeStyle = `rgba(${colorR}, ${colorG}, ${colorB}, ${lineOpacity * 0.85})`;
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
            const morphProgress = phaseTimer / phaseDuration; // Normalized progress (0.0 to 1.0)

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
                    const t = (i / p.total) * Math.PI * 2;
                    const progress = i / p.total;

                    // High-quality deterministic organic offsets
                    const randX = (Math.sin(i * 9.9) * 0.5) * 20;
                    const randY = (Math.cos(i * 7.7) * 0.5) * 20;
                    const randZ = (Math.sin(i * 5.5) * 0.5) * 20;

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

                    let idealX = null;
                    let idealY = null;
                    let idealZ = null;

                    // 2. Compute the IDEAL structured shape coordinate matrix
                    if (phaseName === 'SHAPE_DNA') {
                        // 🧬 Rotating 3D Double Helix
                        const isStrandA = i % 2 === 0;
                        const xOffset = -350 + progress * 700;
                        const angle = progress * Math.PI * 5.5 + time * 0.025 + (isStrandA ? 0 : Math.PI);
                        const r = 85;
                        idealX = centerX + xOffset + randX * 0.3;
                        idealY = centerY + Math.sin(angle) * r + randY * 0.3;
                        idealZ = Math.cos(angle) * r;
                    } else if (phaseName === 'SHAPE_BRAIN') {
                        // 🧠 Human Brain Neural Network in 3D depth
                        const lobe = i % 2 === 0 ? -1 : 1;
                        const fold = Math.sin(t * 15) * 15;
                        const spread = i % 3 === 0 ? 0.5 : 1;
                        idealX = centerX + (lobe * 70 + Math.cos(t) * 105 * spread + fold) + randX;
                        idealY = centerY - 25 + (Math.sin(t) * 115 * spread + fold) + randY;
                        idealZ = Math.sin(t * lobe) * 80 + randZ * 1.5;
                    } else if (phaseName === 'SHAPE_ATOM') {
                        // ⚛️ 3D Atomic Structure with Tilted Orbitals
                        if (i < p.total * 0.15) {
                            idealX = centerX + randX * 2.5;
                            idealY = centerY + randY * 2.5;
                            idealZ = randZ * 2.5;
                        } else {
                            const orbitNum = i % 3;
                            const r = 210;
                            const cx = Math.cos(t) * r;
                            const cy = Math.sin(t) * r;
                            const orbitAngle = orbitNum * (Math.PI / 3) + time * 0.012;

                            const ox = cx;
                            const oy = cy * Math.cos(Math.PI / 4);
                            const oz = cy * Math.sin(Math.PI / 4);

                            idealX = centerX + ox * Math.cos(orbitAngle) - oy * Math.sin(orbitAngle) + randX * 0.3;
                            idealY = centerY + ox * Math.sin(orbitAngle) + oy * Math.cos(orbitAngle) + randY * 0.3;
                            idealZ = oz;
                        }
                    } else if (phaseName === 'SHAPE_TREE') {
                        // 🌳 Tree of Knowledge (3D branching network)
                        if (progress < 0.22) {
                            const trunkHeight = progress / 0.22;
                            idealX = centerX + randX * 0.8;
                            idealY = centerY + 160 - trunkHeight * 160 + randY * 0.8;
                            idealZ = randZ * 0.8;
                        } else {
                            const canopyT = ((progress - 0.22) / 0.78) * Math.PI;
                            const radius = 170 + (Math.abs(randX) * 3);
                            const phi = (i * 12.3) % (Math.PI * 2);
                            idealX = centerX + Math.cos(canopyT) * radius * Math.cos(phi) * 0.85 + randX;
                            idealY = centerY - Math.sin(canopyT) * radius + randY;
                            idealZ = Math.cos(canopyT) * radius * Math.sin(phi) * 0.85;
                        }
                    } else if (phaseName === 'SHAPE_GRID') {
                        // 🔲 3D Cyber Matrix Corridor
                        const layers = 5;
                        const layer = i % layers;
                        const cols = 6;
                        const col = Math.floor(i / layers) % cols;
                        const row = Math.floor(i / (layers * cols));

                        idealX = centerX - 250 + col * 100 + randX * 0.2;
                        idealY = centerY - 150 + row * 100 + randY * 0.2;
                        idealZ = -200 + layer * 100;
                    } else if (phaseName === 'SHAPE_NEURAL_SYNAPSE') {
                        // 🧠 Cognitive Synaptic Sparking Cell Bodies
                        if (progress < 0.45) {
                            const angle = progress * Math.PI * 18;
                            const r = 40 + (i % 3) * 15;
                            idealX = centerX - 180 + Math.cos(angle) * r + randX * 0.4;
                            idealY = centerY + Math.sin(angle) * r + randY * 0.4;
                            idealZ = randZ * 1.5;
                        } else if (progress < 0.90) {
                            const angle = progress * Math.PI * 18;
                            const r = 40 + (i % 3) * 15;
                            idealX = centerX + 180 + Math.cos(angle) * r + randX * 0.4;
                            idealY = centerY + Math.sin(angle) * r + randY * 0.4;
                            idealZ = randZ * 1.5;
                        } else {
                            const sparkProgress = ((i * 13) + time * 0.04) % 1;
                            idealX = (centerX - 180) + sparkProgress * 360;
                            idealY = centerY + Math.sin(sparkProgress * Math.PI * 5) * 35 + randY * 0.3;
                            idealZ = Math.cos(sparkProgress * Math.PI * 5) * 35;
                        }
                    } else if (phaseName === 'SHAPE_EYE') {
                        // 👁️ 3D Interactive Providence Eye
                        const targetXOffset = (mouse.x !== null) ? (mouse.x - centerX) * 0.16 : 0;
                        const targetYOffset = (mouse.y !== null) ? (mouse.y - centerY) * 0.16 : 0;

                        if (i < p.total * 0.4) {
                            const p_t = (i / (p.total * 0.4)) * Math.PI;
                            idealX = centerX - 250 + p_t * (500 / Math.PI) + randX * 0.3;
                            idealY = centerY - Math.sin(p_t) * 135 + randY * 0.3;
                            idealZ = Math.sin(p_t) * 60;
                        } else if (i < p.total * 0.8) {
                            const p_t = ((i - p.total * 0.4) / (p.total * 0.4)) * Math.PI;
                            idealX = centerX - 250 + p_t * (500 / Math.PI) + randX * 0.3;
                            idealY = centerY + Math.sin(p_t) * 135 + randY * 0.3;
                            idealZ = Math.sin(p_t) * 60;
                        } else {
                            const p_t = ((i - p.total * 0.8) / (p.total * 0.2)) * Math.PI * 2 + time * 0.02;
                            const r = 40 + Math.random() * 20;
                            idealX = centerX + Math.cos(p_t) * r + targetXOffset + randX * 0.3;
                            idealY = centerY + Math.sin(p_t) * r + targetYOffset + randY * 0.3;
                            idealZ = -35;
                        }
                    } else if (phaseName === 'SHAPE_HOURGLASS') {
                        // ⏳ 3D Flow of Time
                        const scaleX = 160;
                        const scaleY = 230;
                        const twist = t * 2 + time * 0.02;
                        idealX = centerX + Math.sin(twist) * scaleX + randX * 0.3;
                        idealY = centerY + Math.cos(t) * scaleY + randY * 0.3;
                        idealZ = Math.sin(t) * 110;
                    } else if (phaseName === 'SHAPE_HEXAGON') {
                        // ⬡ 3D Hexagonal Prism
                        const sides = 6;
                        const side = Math.floor(progress * sides);
                        const sideProgress = (progress * sides) % 1;
                        const angle1 = (side / sides) * Math.PI * 2;
                        const angle2 = ((side + 1) / sides) * Math.PI * 2;
                        const r = 180;
                        const p1x = Math.cos(angle1) * r;
                        const p1y = Math.sin(angle1) * r;
                        const p2x = Math.cos(angle2) * r;
                        const p2y = Math.sin(angle2) * r;
                        idealX = centerX + p1x + (p2x - p1x) * sideProgress + randX * 0.3;
                        idealY = centerY + p1y + (p2y - p1y) * sideProgress + randY * 0.3;
                        idealZ = -120 + (i % 5) * 60;
                    } else if (phaseName === 'SHAPE_GALAXY') {
                        // 🌌 3D Tilted Spiral Galaxy
                        const turns = 3;
                        const spiralT = progress * Math.PI * 2 * turns + time * 0.01;
                        const r = progress * 280 + 35;
                        const armOffset = i % 2 === 0 ? 0 : Math.PI;
                        const rx = Math.cos(spiralT + armOffset) * r;
                        const ry = Math.sin(spiralT + armOffset) * r;
                        const rz = (Math.sin(i * 12.3)) * 35 * (1 - progress);

                        const cosT = Math.cos(Math.PI / 3);
                        const sinT = Math.sin(Math.PI / 3);

                        idealX = centerX + rx + randX * 0.4;
                        idealY = centerY + ry * cosT - rz * sinT + randY * 0.4;
                        idealZ = ry * sinT + rz * cosT;
                    } else if (phaseName === 'SHAPE_TESSERACT') {
                        // 🚀 4D Hypercube (Tesseract)
                        const vertices = [];
                        for (let x = -1; x <= 1; x += 2) {
                            for (let y = -1; y <= 1; y += 2) {
                                for (let z = -1; z <= 1; z += 2) {
                                    vertices.push({ x: x * 165, y: y * 165, z: z * 165 });
                                }
                            }
                        }
                        for (let x = -1; x <= 1; x += 2) {
                            for (let y = -1; y <= 1; y += 2) {
                                for (let z = -1; z <= 1; z += 2) {
                                    vertices.push({ x: x * 75, y: y * 75, z: z * 75 });
                                }
                            }
                        }

                        const edges = [];
                        for (let a = 0; a < 8; a++) {
                            for (let b = a + 1; b < 8; b++) {
                                let diffs = (vertices[a].x !== vertices[b].x ? 1 : 0) +
                                    (vertices[a].y !== vertices[b].y ? 1 : 0) +
                                    (vertices[a].z !== vertices[b].z ? 1 : 0);
                                if (diffs === 1) edges.push([a, b]);
                            }
                        }
                        for (let a = 8; a < 16; a++) {
                            for (let b = a + 1; b < 16; b++) {
                                let diffs = (vertices[a].x !== vertices[b].x ? 1 : 0) +
                                    (vertices[a].y !== vertices[b].y ? 1 : 0) +
                                    (vertices[a].z !== vertices[b].z ? 1 : 0);
                                if (diffs === 1) edges.push([a, b]);
                            }
                        }
                        for (let a = 0; a < 8; a++) {
                            edges.push([a, a + 8]);
                        }

                        const edgeIdx = i % edges.length;
                        const edgeProgress = ((i * 7) % 11) / 10;
                        const p1 = vertices[edges[edgeIdx][0]];
                        const p2 = vertices[edges[edgeIdx][1]];

                        let rx = p1.x + (p2.x - p1.x) * edgeProgress;
                        let ry = p1.y + (p2.y - p1.y) * edgeProgress;
                        let rz = p1.z + (p2.z - p1.z) * edgeProgress;

                        const rotX = time * 0.012;
                        const rotY = time * 0.008;
                        const rotZ = time * 0.005;

                        let y1 = ry * Math.cos(rotX) - rz * Math.sin(rotX);
                        let z1 = ry * Math.sin(rotX) + rz * Math.cos(rotX);
                        let x2 = rx * Math.cos(rotY) - z1 * Math.sin(rotY);
                        let z2 = rx * Math.sin(rotY) + z1 * Math.cos(rotY);
                        let x3 = x2 * Math.cos(rotZ) - y1 * Math.sin(rotZ);
                        let y3 = x2 * Math.sin(rotZ) + y1 * Math.cos(rotZ);

                        idealX = centerX + x3 + randX * 0.25;
                        idealY = centerY + y3 + randY * 0.25;
                        idealZ = z2;
                    } else if (phaseName === 'SHAPE_BLACKHOLE') {
                        // 🚀 3D Gravitational Singularity
                        if (progress < 0.15) {
                            idealX = centerX + randX * 1.5;
                            idealY = centerY + randY * 1.5;
                            idealZ = randZ * 1.5;
                        } else if (progress < 0.40) {
                            const angleHalo = progress * Math.PI * 12 + time * 0.015;
                            const rHalo = 75 + Math.sin(time * 0.03 + progress * 5) * 5;
                            idealX = centerX + Math.cos(angleHalo) * rHalo + randX * 0.5;
                            idealY = centerY + Math.sin(angleHalo) * rHalo + randY * 0.5;
                            idealZ = randZ * 0.5;
                        } else {
                            const r = 85 + (progress - 0.4) * 260;
                            const speedMult = Math.sqrt(80 / r);
                            const angle = progress * Math.PI * 8 + time * 0.04 * speedMult;
                            const rx = Math.cos(angle) * r;
                            const rz = Math.sin(angle) * r;
                            const ry = Math.sin(time * 0.03 + r * 0.03) * 8;

                            const cosT = Math.cos(Math.PI / 7.2);
                            const sinT = Math.sin(Math.PI / 7.2);

                            idealX = centerX + rx + randX * 0.5;
                            idealY = centerY + ry * cosT - rz * sinT + randY * 0.5;
                            idealZ = ry * sinT + rz * cosT;
                        }
                    } else if (phaseName === 'SHAPE_DYSON_SPHERE') {
                        // 🚀 Stellar Swarm Gyro Rings
                        if (progress < 0.20) {
                            const r = 35 + Math.sin(time * 0.06 + i) * 6;
                            const theta = (i * 15.3) % (Math.PI * 2);
                            const phi = Math.acos(((i * 7.7) % 2) - 1);
                            idealX = centerX + r * Math.sin(phi) * Math.cos(theta) + randX * 0.5;
                            idealY = centerY + r * Math.sin(phi) * Math.sin(theta) + randY * 0.5;
                            idealZ = r * Math.cos(phi);
                        } else {
                            const ringNum = i % 3;
                            const angle = progress * Math.PI * 6 + time * 0.015;
                            const r = 160 + ringNum * 25;

                            let rx = 0, ry = 0, rz = 0;
                            if (ringNum === 0) {
                                rx = Math.cos(angle) * r;
                                ry = Math.sin(angle) * r;
                                rz = Math.sin(time * 0.02 + i) * 8;
                            } else if (ringNum === 1) {
                                rx = Math.cos(angle) * r;
                                ry = Math.cos(time * 0.025 + i) * 8;
                                rz = Math.sin(angle) * r;
                            } else {
                                rx = Math.cos(time * 0.03 + i) * 8;
                                ry = Math.cos(angle) * r;
                                rz = Math.sin(angle) * r;
                            }

                            const tiltX = time * 0.005;
                            const tiltY = time * 0.003;

                            const y1 = ry * Math.cos(tiltX) - rz * Math.sin(tiltX);
                            const z1 = ry * Math.sin(tiltX) + rz * Math.cos(tiltX);
                            const x2 = rx * Math.cos(tiltY) - z1 * Math.sin(tiltY);
                            const z2 = rx * Math.sin(tiltY) + z1 * Math.cos(tiltY);

                            idealX = centerX + x2 + randX * 0.35;
                            idealY = centerY + y1 + randY * 0.35;
                            idealZ = z2;
                        }
                    } else if (phaseName === 'SHAPE_TORUS') {
                        // 🚀 Torus Loop
                        const majorR = 150;
                        const minorR = 45;
                        const phi = progress * Math.PI * 2;
                        const theta = progress * Math.PI * 18 + time * 0.05;

                        const rx = (majorR + minorR * Math.cos(theta)) * Math.cos(phi);
                        const ry = (majorR + minorR * Math.cos(theta)) * Math.sin(phi);
                        const rz = minorR * Math.sin(theta);

                        const rotX = time * 0.008;
                        const rotY = time * 0.006;

                        const y1 = ry * Math.cos(rotX) - rz * Math.sin(rotX);
                        const z1 = ry * Math.sin(rotX) + rz * Math.cos(rotX);
                        const x2 = rx * Math.cos(rotY) - z1 * Math.sin(rotY);
                        const z2 = rx * Math.sin(rotY) + z1 * Math.cos(rotY);

                        idealX = centerX + x2 + randX * 0.3;
                        idealY = centerY + y1 + randY * 0.3;
                        idealZ = z2;
                    } else if (phaseName === 'SHAPE_QUANTUM_FIELD') {
                        // ⚛️ Quantum Entanglement Mirror
                        const cloudA = i % 2 === 0;
                        const qubitT = progress * Math.PI * 2;

                        const rx = Math.cos(qubitT + time * 0.02) * 80;
                        const ry = Math.sin(qubitT + time * 0.02) * 80;
                        const rz = Math.sin(qubitT * 3 + time * 0.025) * 45;

                        if (cloudA) {
                            idealX = centerX - 160 + rx + randX * 0.25;
                            idealY = centerY + ry + randY * 0.25;
                            idealZ = rz;
                        } else {
                            idealX = centerX + 160 - rx + randX * 0.25;
                            idealY = centerY - ry + randY * 0.25;
                            idealZ = -rz;
                        }
                    } else if (phaseName === 'SHAPE_WARP_DRIVE') {
                        // 🚀 Space Warp Funnel
                        if (progress < 0.20) {
                            const angle = progress * Math.PI * 10 + time * 0.045;
                            idealX = centerX + Math.cos(angle) * 140 + randX * 0.3;
                            idealY = centerY + Math.sin(angle) * 140 + randY * 0.3;
                            idealZ = -120;
                        } else {
                            const zPos = -120 + ((progress - 0.2) / 0.8) * 380;
                            const rFunnel = 140 - ((progress - 0.2) / 0.8) * 115;
                            const angle = progress * Math.PI * 20 + time * 0.05;
                            idealX = centerX + Math.cos(angle) * rFunnel + randX * 0.4;
                            idealY = centerY + Math.sin(angle) * rFunnel + randY * 0.4;
                            idealZ = zPos;
                        }
                    } else if (phaseName === 'SHAPE_MULTIVERSE') {
                        // 🌌 Parallel Multiverse Portal
                        if (progress < 0.45) {
                            const angle = progress * Math.PI * 8 + time * 0.015;
                            const wave = Math.sin(time * 0.045 + i) * 12;
                            idealX = centerX + Math.cos(angle) * 230 + wave + randX * 0.3;
                            idealY = centerY + Math.sin(angle) * 230 + wave + randY * 0.3;
                            idealZ = Math.sin(angle * 2.5) * 60;
                        } else {
                            const r = ((progress - 0.45) / 0.55) * 165;
                            const angleCore = progress * Math.PI * 12 - time * 0.035;
                            idealX = centerX + Math.cos(angleCore) * r + randX * 0.45;
                            idealY = centerY + Math.sin(angleCore) * r + randY * 0.45;
                            idealZ = -70 + (1 - progress) * 200;
                        }
                    } else if (phaseName === 'SHAPE_CORE') {
                        // 🔴 Compression Core
                        idealX = centerX + randX * 1.5;
                        idealY = centerY + randY * 1.5;
                        idealZ = randZ * 1.5;
                    }

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

                        p.targetX = swirlX + (idealX - swirlX) * ease;
                        p.targetY = swirlY + (idealY - swirlY) * ease;
                        p.targetZ = swirlZ + (idealZ - swirlZ) * ease;
                    } else {
                        // Stage 3: Display Stage - Fully formed, majestic, stable 3D constellation
                        p.targetX = idealX;
                        p.targetY = idealY;
                        p.targetZ = idealZ;
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
            const globalOpacity = Math.max(0.12, 1 - (scrollY / 600));

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

                p.draw(ctx);
            }

            // 🕸️ Step 4: Draw depth-filtered connecting line constellations
            if (globalOpacity > 0.1) {
                connect(globalOpacity);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', handleScroll);
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
