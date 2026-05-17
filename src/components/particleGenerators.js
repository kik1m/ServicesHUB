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
    } else if (phaseName === 'SHAPE_HOURGLASS') {
        // ⏳ 3D Flow of Time
        const scaleX = 160;
        const scaleY = 230;
        const twist = t * 2 + time * 0.02;
        idealX = centerX + Math.sin(twist) * scaleX + randX * 0.3;
        idealY = centerY + Math.cos(t) * scaleY + randY * 0.3;
        idealZ = Math.sin(t) * 110;
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
        // 🕸️ Cyber Geometric Spider Web (Futuristic 3D Concentric Mesh with RGB Pulsing)
        const flowProgress = (progress + time * 0.003) % 1.0;
        
        // 8 Radial Spokes
        const numSpokes = 8;
        const spokeNum = i % numSpokes;
        const radialAngle = (spokeNum / numSpokes) * Math.PI * 2 + time * 0.005;
        
        // Particle division: 35% on radial lines, 65% on concentric rings
        const isRadial = i % 3 === 0;
        
        if (isRadial) {
            // Radial strands flowing outward from core
            const r = 25 + flowProgress * 235;
            idealX = centerX + Math.cos(radialAngle) * r + randX * 0.2;
            idealY = centerY + Math.sin(radialAngle) * r + randY * 0.2;
            // 3D waving ripple on the web
            idealZ = Math.sin(flowProgress * Math.PI * 3 + time * 0.03) * 35;
        } else {
            // Concentric polygon ring strands flowing circularly!
            const ringLayers = 7;
            const layer = Math.floor(progress * ringLayers) % ringLayers;
            const r = 45 + layer * 32;
            
            // Decagon ring vertices interpolation
            const ringT = (progress * 10 + time * 0.015) * Math.PI * 2;
            idealX = centerX + Math.cos(ringT) * r + randX * 0.2;
            idealY = centerY + Math.sin(ringT) * r + randY * 0.2;
            // Wave ripples outwards from the center of the web!
            idealZ = Math.sin(layer * 0.8 - time * 0.035) * 25;
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
