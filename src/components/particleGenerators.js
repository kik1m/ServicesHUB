/**
 * 🌌 particleGenerators.js - Pure Mathematical 3D Physics Engine for Constellations
 * Decoupled from React to achieve extreme JIT compiler optimizations (V8 Engine)
 * and rock-solid rendering performance.
 *
 * ⚡ Optimized with Zero-Allocation Loop: Mutates particle targets in-place to
 * eliminate Garbage Collection pauses and battery heating on mobile devices.
 */

export function updateParticleIdealTargets(p, phaseName, i, total, time, centerX, centerY, mouse) {
    const t = (i / total) * Math.PI * 2;
    const progress = i / total;

    // High-quality deterministic organic offsets - Extremely reduced to 3px for laser-sharp mathematical precision
    const randX = (Math.sin(i * 9.9) * 0.5) * 3;
    const randY = (Math.cos(i * 7.7) * 0.5) * 3;
    const randZ = (Math.sin(i * 5.5) * 0.5) * 3;

    let idealX = centerX;
    let idealY = centerY;
    let idealZ = 0;

    if (phaseName === 'SHAPE_LOGO') {
        // 💎 HUBly Brand Identity - Futuristic slanted H, Orbiting Ring, and Satellite Dot
        const satEnd = total * 0.10;
        const ringEnd = total * 0.60;

        if (i < satEnd) {
            // 1. Satellite Dot (Top right)
            const angle = -0.65; // ~40 degrees top-right
            const r = 185;
            idealX = centerX + Math.cos(angle) * r + randX * 0.3;
            idealY = centerY + Math.sin(angle) * r + randY * 0.3;
            idealZ = randZ * 0.3;
        } else if (i < ringEnd) {
            // 2. Outer Orbit Ring (3D Ribbon Circle)
            const ringProgress = (i - satEnd) / (ringEnd - satEnd);
            // Circle with slow continuous spin
            const angle = ringProgress * Math.PI * 2 + time * 0.006;
            const r = 160;
            idealX = centerX + Math.cos(angle) * r + randX * 0.15;
            idealY = centerY + Math.sin(angle) * r + randY * 0.15;
            // 3D waves in the ring
            idealZ = Math.sin(angle * 2.5) * 35;
        } else {
            // 3. Inner Slanted futuristic 'H'
            const hProgress = (i - ringEnd) / (total - ringEnd);
            
            if (hProgress < 0.45) {
                // Left Leg (Slanted, bottom Bending left)
                const t_leg = hProgress / 0.45; // 0.0 to 1.0
                let xOffset = -55 + (t_leg - 0.5) * 30; // Slanted angle
                const yOffset = -95 + t_leg * 190;
                
                // Stylized curve at the bottom left
                if (t_leg > 0.82) {
                    xOffset -= Math.pow((t_leg - 0.82) / 0.18, 2.2) * 22;
                }
                
                idealX = centerX + xOffset + randX * 0.1;
                idealY = centerY + yOffset + randY * 0.1;
                idealZ = -15;
            } else if (hProgress < 0.90) {
                // Right Leg (Slanted, top Bending right)
                const t_leg = (hProgress - 0.45) / 0.45; // 0.0 to 1.0
                let xOffset = 55 + (t_leg - 0.5) * 30; // Slanted angle
                const yOffset = -95 + t_leg * 190;
                
                // Stylized curve at the top right
                if (t_leg < 0.18) {
                    xOffset += Math.pow((0.18 - t_leg) / 0.18, 2.2) * 22;
                }
                
                idealX = centerX + xOffset + randX * 0.1;
                idealY = centerY + yOffset + randY * 0.1;
                idealZ = -15;
            } else {
                // Crossbar
                const t_bar = (hProgress - 0.90) / 0.10; // 0.0 to 1.0
                // Connect left mid-point to right mid-point
                const xStart = -55;
                const xEnd = 55;
                idealX = centerX + xStart + t_bar * (xEnd - xStart) + randX * 0.2;
                // Slightly slanted crossbar to match the futuristic design
                idealY = centerY - 10 + t_bar * 20 + randY * 0.2;
                idealZ = -15;
            }
        }
    } else if (phaseName === 'SHAPE_DNA') {
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
        if (i < total * 0.15) {
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
        const targetXOffset = (mouse && mouse.x !== null) ? (mouse.x - centerX) * 0.16 : 0;
        const targetYOffset = (mouse && mouse.y !== null) ? (mouse.y - centerY) * 0.16 : 0;

        if (i < total * 0.4) {
            const p_t = (i / (total * 0.4)) * Math.PI;
            idealX = centerX - 250 + p_t * (500 / Math.PI) + randX * 0.3;
            idealY = centerY - Math.sin(p_t) * 135 + randY * 0.3;
            idealZ = Math.sin(p_t) * 60;
        } else if (i < total * 0.8) {
            const p_t = ((i - total * 0.4) / (total * 0.4)) * Math.PI;
            idealX = centerX - 250 + p_t * (500 / Math.PI) + randX * 0.3;
            idealY = centerY + Math.sin(p_t) * 135 + randY * 0.3;
            idealZ = Math.sin(p_t) * 60;
        } else {
            const p_t = ((i - total * 0.8) / (total * 0.2)) * Math.PI * 2 + time * 0.02;
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

    // Direct in-place mutation of the particle reference object
    p.idealX = idealX;
    p.idealY = idealY;
    p.idealZ = idealZ;
}
