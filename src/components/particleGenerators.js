/**
 * 🌌 particleGenerators.js — 3D Shape Mathematics Engine
 * Zero-allocation: mutates particle idealX/Y/Z in-place.
 * Pre-computes expensive data at module level for hot-path speed.
 */

// ─── Pre-compute Tesseract edges once (module level, never GC'd) ─────────────
const _TESS = (() => {
    const v = [];
    for (const sc of [165, 75])
        for (let x = -1; x <= 1; x += 2)
            for (let y = -1; y <= 1; y += 2)
                for (let z = -1; z <= 1; z += 2)
                    v.push([x * sc, y * sc, z * sc]);
    const e = [];
    for (let g = 0; g < 2; g++) {
        const o = g * 8;
        for (let a = o; a < o + 8; a++)
            for (let b = a + 1; b < o + 8; b++) {
                const d = (v[a][0] !== v[b][0]) + (v[a][1] !== v[b][1]) + (v[a][2] !== v[b][2]);
                if (d === 1) e.push([a, b]);
            }
    }
    for (let a = 0; a < 8; a++) e.push([a, a + 8]);
    return { v, e };
})();

// ─── Merkaba edges (12 edges of 2 interlocked tetrahedra) ────────────────────
const _MERK_EDGES = (() => {
    const R = 130;
    const t1 = [[R,R,R],[R,-R,-R],[-R,R,-R],[-R,-R,R]];
    const t2 = [[-R,-R,-R],[-R,R,R],[R,-R,R],[R,R,-R]];
    const edges = [];
    [[t1,t1],[t2,t2]].forEach(([ta]) => {
        for (let a = 0; a < 4; a++)
            for (let b = a + 1; b < 4; b++)
                edges.push([ta[a], ta[b]]);
    });
    return edges;
})();

// ─── Rotation helper ─────────────────────────────────────────────────────────
export function rotateYPR(x, y, z, pitch, yaw, roll = 0) {
    const cp = Math.cos(pitch), sp = Math.sin(pitch);
    const cy = Math.cos(yaw),   sy = Math.sin(yaw);
    const y1 = y * cp - z * sp, z1 = y * sp + z * cp;
    const x2 = x * cy - z1 * sy, z2 = x * sy + z1 * cy;
    if (!roll) return { x: x2, y: y1, z: z2 };
    const cr = Math.cos(roll), sr = Math.sin(roll);
    return { x: x2 * cr - y1 * sr, y: x2 * sr + y1 * cr, z: z2 };
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));

// ─── Main shape calculator ───────────────────────────────────────────────────
export function updateParticleIdealTargets(p, phaseName, i, total, time, cx, cy) {
    const prog = i / total;
    const t    = prog * Math.PI * 2;
    
    // Pre-calculated organic offsets on the particle itself (Zero-Cost)
    const rx = p.randX || 0;
    const ry = p.randY || 0;
    const rz = p.randZ || 0;
    
    let ix = cx, iy = cy, iz = 0;

    if (phaseName === 'SHAPE_DNA') {
        const strand = i % 2 === 0;
        // Tighter coils and more definition for the DNA
        const angle  = prog * Math.PI * 7.5 + time * 0.02 + (strand ? 0 : Math.PI);
        ix = cx + (-400 + prog * 800) + rx;
        iy = cy + Math.sin(angle) * 110 + ry;
        iz = Math.cos(angle) * 110 + rz;

    } else if (phaseName === 'SHAPE_GLOBE') {
        const phi   = Math.acos(1 - 2 * prog);
        const theta = GOLDEN_ANGLE * i;
        const r = rotateYPR(
            Math.sin(phi) * Math.cos(theta) * 200,
            Math.cos(phi) * 200,
            Math.sin(phi) * Math.sin(theta) * 200,
            time * 0.002, time * 0.005
        );
        ix = cx + r.x + rx; iy = cy + r.y + ry; iz = r.z + rz;
    } else if (phaseName === 'SHAPE_AI_TEXT') {
        const sp = prog;
        let x1, y1, x2, y2, lt;
        if      (sp < 0.3) { x1=-140; y1=140;  x2=-70;  y2=-140; lt=sp/0.3; } // A left
        else if (sp < 0.6) { x1=-70;  y1=-140; x2=0;    y2=140;  lt=(sp-0.3)/0.3; } // A right
        else if (sp < 0.7) { x1=-110; y1=20;   x2=-30;  y2=20;   lt=(sp-0.6)/0.1; } // A crossbar
        else if (sp < 0.8) { x1=60;   y1=-140; x2=140;  y2=-140; lt=(sp-0.7)/0.1; } // I top
        else if (sp < 0.9) { x1=100;  y1=-140; x2=100;  y2=140;  lt=(sp-0.8)/0.1; } // I mid
        else               { x1=60;   y1=140;  x2=140;  y2=140;  lt=(sp-0.9)/0.1; } // I bot
        ix = cx + x1 + (x2 - x1) * lt + rx;
        iy = cy + y1 + (y2 - y1) * lt + ry;
        iz = rz * 2.5;

    } else if (phaseName === 'SHAPE_HOURGLASS') {
        // ⏳ Original 3D Figure-8 standing infinity hourglass (Connected, twisted and extremely beautiful)
        const twist = t * 2 + time * 0.02;
        ix = cx + Math.sin(twist) * 160 + rx * 0.3;
        iy = cy + Math.cos(t) * 230 + ry * 0.3;
        iz = Math.sin(t) * 110 + rz * 0.3;

    } else if (phaseName === 'SHAPE_MERKABA') {
        const ei = i % 12, ep = ((i * 7) % 20) / 19;
        const [pa, pb] = _MERK_EDGES[ei];
        const r = rotateYPR(
            pa[0] + (pb[0] - pa[0]) * ep,
            pa[1] + (pb[1] - pa[1]) * ep,
            pa[2] + (pb[2] - pa[2]) * ep,
            time * 0.008, time * 0.005, time * 0.003
        );
        ix = cx + r.x + rx; iy = cy + r.y + ry; iz = r.z + rz;

    } else if (phaseName === 'SHAPE_TESSERACT') {
        const { v, e } = _TESS;
        const ei = i % e.length, ep = ((i * 7) % 11) / 10;
        const [ai, bi] = e[ei];
        const r = rotateYPR(
            v[ai][0] + (v[bi][0] - v[ai][0]) * ep,
            v[ai][1] + (v[bi][1] - v[ai][1]) * ep,
            v[ai][2] + (v[bi][2] - v[ai][2]) * ep,
            time * 0.012, time * 0.008, time * 0.005
        );
        ix = cx + r.x + rx; iy = cy + r.y + ry; iz = r.z + rz;

    } else if (phaseName === 'SHAPE_DYSON_SPHERE') {
        if (prog < 0.2) {
            const phi = Math.acos(((i * 7.7) % 2) - 1), theta = (i * 15.3) % (Math.PI * 2);
            const rad = 35 + Math.sin(time * 0.06 + i) * 6;
            ix = cx + Math.sin(phi) * Math.cos(theta) * rad + rx;
            iy = cy + Math.sin(phi) * Math.sin(theta) * rad + ry;
            iz = Math.cos(phi) * rad + rz;
        } else {
            const ring = i % 3, angle = prog * Math.PI * 6 + time * 0.015, rad = 160 + ring * 25;
            let rxV = 0, ryV = 0, rzV = 0;
            if      (ring === 0) { rxV = Math.cos(angle)*rad; ryV = Math.sin(angle)*rad; rzV = Math.sin(time*0.02+i)*8; }
            else if (ring === 1) { rxV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; ryV = Math.cos(time*0.025+i)*8; }
            else                 { ryV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; rxV = Math.cos(time*0.03+i)*8; }
            const r = rotateYPR(rxV, ryV, rzV, time * 0.005, time * 0.003);
            ix = cx + r.x + rx; iy = cy + r.y + ry; iz = r.z + rz;
        }

    } else if (phaseName === 'SHAPE_TORUS') {
        const phi = prog * Math.PI * 2, theta = prog * Math.PI * 24 + time * 0.05;
        // Thicker, more substantial 3D Torus
        const r = rotateYPR(
            (180 + 65 * Math.cos(theta)) * Math.cos(phi),
            (180 + 65 * Math.cos(theta)) * Math.sin(phi),
            65 * Math.sin(theta),
            time * 0.008, time * 0.006
        );
        ix = cx + r.x + rx; iy = cy + r.y + ry; iz = r.z + rz;

    } else if (phaseName === 'SHAPE_QUANTUM_FIELD') {
        const spokeAngle = (i % 8) / 8 * Math.PI * 2 + time * 0.005;
        if (i % 3 === 0) {
            const rad = 25 + prog * 235;
            ix = cx + Math.cos(spokeAngle) * rad;
            iy = cy + Math.sin(spokeAngle) * rad;
            iz = Math.sin(prog * Math.PI * 3 + time * 0.03) * 35;
        } else {
            const layer = Math.floor(prog * 7) % 7, rad = 45 + layer * 32;
            const a = (prog * 10 + time * 0.015) * Math.PI * 2;
            ix = cx + Math.cos(a) * rad;
            iy = cy + Math.sin(a) * rad;
            iz = Math.sin(layer * 0.8 - time * 0.035) * 25;
        }

    } else if (phaseName === 'SHAPE_WARP_DRIVE') {
        if (prog < 0.2) {
            const angle = prog * Math.PI * 10 + time * 0.045;
            ix = cx + Math.cos(angle) * 140;
            iy = cy + Math.sin(angle) * 140;
            iz = -120;
        } else {
            const f = (prog - 0.2) / 0.8;
            const angle = prog * Math.PI * 20 + time * 0.05;
            ix = cx + Math.cos(angle) * (140 - f * 115);
            iy = cy + Math.sin(angle) * (140 - f * 115);
            iz = -120 + f * 380;
        }

    } else if (phaseName === 'SHAPE_MULTIVERSE') {
        if (prog < 0.45) {
            const angle = prog * Math.PI * 8 + time * 0.015;
            const wave  = Math.sin(time * 0.045 + i) * 12;
            ix = cx + Math.cos(angle) * 230 + wave;
            iy = cy + Math.sin(angle) * 230 + wave;
            iz = Math.sin(angle * 2.5) * 60;
        } else {
            const f = (prog - 0.45) / 0.55;
            const angle = prog * Math.PI * 12 - time * 0.035;
            ix = cx + Math.cos(angle) * f * 165;
            iy = cy + Math.sin(angle) * f * 165;
            iz = -70 + (1 - prog) * 200;
        }

    } else if (phaseName === 'SHAPE_PYRAMID') {
        // 🔮 THE QUANTUM NEXUS CORE (Hyper-Advanced Final Scene)
        // Pulsating central sphere, orthogonal data rings, and 6 sharp 3D spokes
        let tx = 0, ty = 0, tz = 0;
        const subPhase = i % 3;
        
        if (subPhase === 0) {
            // 1. Central Pulsating Core (30% of particles)
            const phi = Math.acos(1 - 2 * (prog * 3 % 1));
            const theta = (prog * 3 % 1) * Math.PI * 2 + time * 0.03;
            const rad = 45 + Math.sin(time * 0.05 + i) * 8;
            tx = rad * Math.sin(phi) * Math.cos(theta);
            ty = rad * Math.sin(phi) * Math.sin(theta);
            tz = rad * Math.cos(phi);
        } else if (subPhase === 1) {
            // 2. Dual Orthogonal Orbit Rings (40% of particles)
            const angle = (prog * 3 % 1) * Math.PI * 2 + time * 0.02;
            const isXY = (i % 2 === 0);
            if (isXY) {
                tx = Math.cos(angle) * 190;
                ty = Math.sin(angle) * 190;
                tz = Math.sin(time * 0.03 + i) * 5;
            } else {
                tx = Math.sin(time * 0.03 + i) * 5;
                ty = Math.cos(angle) * 190;
                tz = Math.sin(angle) * 190;
            }
        } else {
            // 3. 6 Sharp 3D Coordinate Spikes (30% of particles)
            const spikeDir = i % 6;
            const len = 45 + ((i * 7) % 20) / 19 * 215; // Extends out to 260px
            if (spikeDir === 0) { tx = len; ty = 0; tz = 0; }
            else if (spikeDir === 1) { tx = -len; ty = 0; tz = 0; }
            else if (spikeDir === 2) { tx = 0; ty = len; tz = 0; }
            else if (spikeDir === 3) { tx = 0; ty = -len; tz = 0; }
            else if (spikeDir === 4) { tx = 0; ty = 0; tz = len; }
            else { tx = 0; ty = 0; tz = -len; }
        }
        
        // Multi-axial physics rotation
        const r = rotateYPR(tx, ty, tz, time * 0.007, time * 0.005, time * 0.002);
        ix = cx + r.x + rx * 0.3; iy = cy + r.y + ry * 0.3; iz = r.z + rz * 0.3;
    }

    p.idealX = ix;
    p.idealY = iy;
    p.idealZ = iz;
}
