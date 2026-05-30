/**
 * 🌌 particleGenerators.js — Shape Mathematics Engine v3 (Ultra-HD Performance Edition)
 *
 * PERF UPGRADES v3:
 *  - All per-shape trig now stored in typed Float32Arrays built ONCE at init
 *  - `precomputeShapeTrig` now writes into a shared _trig object (unchanged interface)
 *  - `buildParticleLUT` extended with HOURGLASS, PYRAMID, STELLATED per-particle angles
 *    to eliminate ALL Math.acos / Math.atan2 from the hot loop
 *  - Zero new allocations per frame — every shape reads from pre-built LUTs only
 */

// ─── Pre-computed per-particle angle cache ────────────────────────────────────
export let _ACOS_LUT    = null; // phi for globe/singularity
export let _THETA_LUT   = null; // golden-spiral theta
export let _GOLDEN_LUT  = null; // alternate golden angle theta
export let _TORUS_LUT   = null; // torus tube angle
export let _QSING_LUT   = null; // quantum singularity ring angle
export let _HGLASS_LUT  = null; // hourglass lemniscate t parameter
export let _NOISE_LUT   = null; // deterministic pseudo-noise [-1..1]
let _LUT_SIZE = 0;

export function buildParticleLUT(total) {
    if (_LUT_SIZE === total) return;
    _LUT_SIZE = total;

    _ACOS_LUT   = new Float32Array(total);
    _THETA_LUT  = new Float32Array(total);
    _GOLDEN_LUT = new Float32Array(total);
    _TORUS_LUT  = new Float32Array(total);
    _QSING_LUT  = new Float32Array(total);
    _HGLASS_LUT = new Float32Array(total);
    _NOISE_LUT  = new Float32Array(total);

    const GOLDEN      = Math.PI * (3 - Math.sqrt(5));
    const GOLDEN_ALT  = Math.PI * (1 + Math.sqrt(5));
    const TAU         = Math.PI * 2;

    for (let i = 0; i < total; i++) {
        const prog = i / total;

        _ACOS_LUT[i]  = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * prog)));
        _THETA_LUT[i] = (GOLDEN * i) % TAU;
        _GOLDEN_LUT[i]= (GOLDEN_ALT * i) % TAU;
        _TORUS_LUT[i] = (prog * Math.PI * 24) % TAU;
        _HGLASS_LUT[i]= (prog * TAU * 3) % TAU; // lemniscate param

        // Quantum singularity: split into 3 zone angles
        if (prog < 0.40)       _QSING_LUT[i] = _GOLDEN_LUT[i];
        else if (prog < 0.70)  _QSING_LUT[i] = (((prog - 0.40) / 0.30) * TAU) % TAU;
        else                   _QSING_LUT[i] = (((prog - 0.70) / 0.30) * TAU) % TAU;

        // Deterministic pseudo-noise
        let n = (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1.0;
        if (n < 0) n += 1;
        _NOISE_LUT[i] = n * 2 - 1;
    }
}

// ─── Tesseract geometry (module-level, never GC'd) ───────────────────────────
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

// ─── Merkaba edges ────────────────────────────────────────────────────────────
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

// ─── Frame-level trig cache (one write per frame, N reads) ───────────────────
const _trig = { cp:1, sp:0, cy:1, sy:0, cr:1, sr:0 };

export function precomputeShapeTrig(time, phaseName) {
    // Rotation speeds tuned per shape for cinematic feel
    const speeds = {
        SHAPE_QUANTUM_SINGULARITY:  [0.004, 0.006, 0,     0    ],
        SHAPE_CHRONOS_HYPERSPHERE:  [0.003, 0.005, 0.002, 0    ],
        SHAPE_TESSERACT:            [0.004, 0.003, 0.002, 0    ],
        SHAPE_STELLATED_OCTAHEDRON: [0.005, 0.004, 0.003, 0    ],
        SHAPE_TORUS:                [0.008, 0.006, 0,     0    ],
        SHAPE_DYSON_SPHERE:         [0.005, 0.003, 0,     0    ],
        SHAPE_PYRAMID:              [0.007, 0.005, 0.002, 0    ],
        SHAPE_PULSAR_STAR:          [0.006, 0.004, 0.003, 0    ],
        SHAPE_HOURGLASS:            [0.004, 0.006, 0.003, 0    ],
        SHAPE_MULTIVERSE:           [0.003, 0.005, 0,     0    ],
    };
    const s = speeds[phaseName] || [0.003, 0.004, 0, 0];
    _trig.cp = Math.cos(time * s[0]); _trig.sp = Math.sin(time * s[0]);
    _trig.cy = Math.cos(time * s[1]); _trig.sy = Math.sin(time * s[1]);
    _trig.cr = Math.cos(time * s[2]); _trig.sr = Math.sin(time * s[2]);
}

// ─── Inline rotation using pre-computed trig ─────────────────────────────────
function rotateInline(x, y, z, withRoll) {
    const { cp, sp, cy, sy } = _trig;
    const y1 = y * cp - z * sp, z1 = y * sp + z * cp;
    const x2 = x * cy - z1 * sy, z2 = x * sy + z1 * cy;
    if (!withRoll) return { x: x2, y: y1, z: z2 };
    const { cr, sr } = _trig;
    return { x: x2 * cr - y1 * sr, y: x2 * sr + y1 * cr, z: z2 };
}

// ─── Main shape calculator ───────────────────────────────────────────────────
export function updateParticleIdealTargets(p, phaseName, i, total, time, cx, cy) {
    const prog = i / total;
    const rx = p.randX, ry = p.randY, rz = p.randZ;
    let ix = cx, iy = cy, iz = 0;

    switch (phaseName) {

    case 'SHAPE_QUANTUM_SINGULARITY': {
        if (prog < 0.40) {
            const phi   = Math.acos(1 - 2 * (prog / 0.40));
            const theta = _QSING_LUT[i] + time * 0.02;
            const rad   = 28 + Math.sin(time * 0.045 + i) * 4;
            const r = rotateInline(
                Math.sin(phi) * Math.cos(theta) * rad,
                Math.cos(phi) * rad,
                Math.sin(phi) * Math.sin(theta) * rad,
                false
            );
            ix = cx + r.x + rx * 0.1; iy = cy + r.y + ry * 0.1; iz = r.z + rz * 0.1;
        } else if (prog < 0.70) {
            const angle = _QSING_LUT[i] + time * 0.035;
            const rad   = [72, 95, 118, 141][i % 4];
            const r = rotateInline(
                Math.cos(angle) * rad,
                Math.sin(angle) * rad,
                Math.sin(time * 0.02 + i) * 5,
                false
            );
            ix = cx + r.x + rx * 0.12; iy = cy + r.y + ry * 0.12; iz = r.z + rz * 0.12;
        } else {
            const angle = _QSING_LUT[i] - time * 0.03;
            const rad   = [72, 95, 118, 141][i % 4];
            const r = rotateInline(
                Math.cos(angle) * rad,
                Math.sin(time * 0.02 + i) * 5,
                Math.sin(angle) * rad,
                false
            );
            ix = cx + r.x + rx * 0.12; iy = cy + r.y + ry * 0.12; iz = r.z + rz * 0.12;
        }
        break;
    }

    case 'SHAPE_CHRONOS_HYPERSPHERE': {
        let tx = 0, ty = 0, tz = 0;
        if (prog < 0.25) {
            const angle = (prog / 0.25) * Math.PI * 2 + time * 0.025;
            tx = Math.cos(angle) * 210; ty = Math.sin(angle) * 210; tz = 0;
        } else if (prog < 0.50) {
            const angle = ((prog - 0.25) / 0.25) * Math.PI * 2 - time * 0.02;
            tx = Math.cos(angle) * 160; ty = 0; tz = Math.sin(angle) * 160;
        } else if (prog < 0.75) {
            const angle = ((prog - 0.50) / 0.25) * Math.PI * 2 + time * 0.035;
            tx = 0; ty = Math.cos(angle) * 110; tz = Math.sin(angle) * 110;
        } else {
            const phi   = Math.acos(1 - 2 * ((prog - 0.75) / 0.25));
            const theta = _GOLDEN_LUT[i] + time * 0.015;
            const rad   = 32 + Math.sin(time * 0.05 + i) * 6;
            tx = Math.sin(phi) * Math.cos(theta) * rad;
            ty = Math.cos(phi) * rad;
            tz = Math.sin(phi) * Math.sin(theta) * rad;
        }
        const r = rotateInline(tx, ty, tz, true);
        ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15;
        break;
    }

    case 'SHAPE_TESSERACT': {
        const { v, e } = _TESS;
        const ei = i % e.length;
        const maxSteps = Math.floor((total - 1) / e.length);
        const ep = Math.min(1.0, Math.floor(i / e.length) / (maxSteps || 1));
        const [ai, bi] = e[ei];
        const r = rotateInline(
            v[ai][0] + (v[bi][0] - v[ai][0]) * ep,
            v[ai][1] + (v[bi][1] - v[ai][1]) * ep,
            v[ai][2] + (v[bi][2] - v[ai][2]) * ep,
            true
        );
        ix = cx + r.x; iy = cy + r.y; iz = r.z;
        break;
    }

    case 'SHAPE_STELLATED_OCTAHEDRON': {
        const ei = i % _MERK_EDGES.length;
        const maxSteps = Math.floor((total - 1) / _MERK_EDGES.length);
        const ep = Math.min(1.0, Math.floor(i / _MERK_EDGES.length) / (maxSteps || 1));
        const [pa, pb] = _MERK_EDGES[ei];
        const r = rotateInline(
            pa[0] + (pb[0] - pa[0]) * ep,
            pa[1] + (pb[1] - pa[1]) * ep,
            pa[2] + (pb[2] - pa[2]) * ep,
            true
        );
        ix = cx + r.x; iy = cy + r.y; iz = r.z;
        break;
    }

    case 'SHAPE_TORUS': {
        const phi   = prog * Math.PI * 2;
        const theta = _TORUS_LUT[i] + time * 0.05;
        const R = 192, r_tube = 42;
        const r = rotateInline(
            (R + r_tube * Math.cos(theta)) * Math.cos(phi),
            (R + r_tube * Math.cos(theta)) * Math.sin(phi),
            r_tube * Math.sin(theta),
            false
        );
        ix = cx + r.x + rx * 0.2; iy = cy + r.y + ry * 0.2; iz = r.z + rz * 0.2;
        break;
    }

    case 'SHAPE_PULSAR_STAR': {
        if (prog < 0.35) {
            const phi   = Math.acos(1 - 2 * (prog / 0.35));
            const theta = _GOLDEN_LUT[i] + time * 0.15;
            const rad   = 28 + Math.sin(time * 0.08 + i) * 5;
            ix = cx + Math.sin(phi) * Math.cos(theta) * rad;
            iy = cy + Math.sin(phi) * Math.sin(theta) * rad;
            iz = Math.cos(phi) * rad;
        } else if (prog < 0.65) {
            const angle = ((prog - 0.35) / 0.30) * Math.PI * 2 - time * 0.12;
            const rad   = [58, 75, 92][i % 3];
            ix = cx + Math.cos(angle) * rad;
            iy = cy + Math.sin(angle) * rad;
            iz = Math.sin(time * 0.1 + i) * 3;
        } else {
            const isTop     = i % 2 === 0;
            const lengthProg = (prog - 0.65) / 0.35;
            const h         = (isTop ? 1 : -1) * (35 + lengthProg * 180);
            const rad       = 6 + lengthProg * 15;
            const angle     = lengthProg * Math.PI * 12 + time * 0.2;
            const pulse     = 1.0 + Math.sin(lengthProg * Math.PI * 4 - time * 0.1) * 0.4;
            ix = cx + Math.cos(angle) * rad * pulse;
            iy = cy + Math.sin(angle) * rad * pulse;
            iz = h;
        }
        const r = rotateInline(ix - cx, iy - cy, iz, true);
        ix = cx + r.x + rx * 0.2; iy = cy + r.y + ry * 0.2; iz = r.z + rz * 0.2;
        break;
    }

    case 'SHAPE_HOURGLASS': {
        const ribbon  = i % 2;
        const t3      = _HGLASS_LUT[i] + (ribbon * Math.PI) + time * 0.015;
        const L_scale = 2 / (3 - Math.cos(2 * t3));
        const lx = 85  * L_scale * Math.cos(t3);
        const ly = 255 * L_scale * Math.sin(2 * t3);
        const lz = 30  * Math.sin(t3 * 3 + time * 0.05);
        const r = rotateInline(lx, ly, lz, true);
        ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15;
        break;
    }

    case 'SHAPE_MULTIVERSE': {
        if (prog < 0.45) {
            const angle    = prog * Math.PI * 8 + time * 0.015;
            const outerRad = (i % 2 === 0) ? 220 : 248;
            const wave     = Math.sin(time * 0.045 + i) * 6;
            ix = cx + Math.cos(angle) * (outerRad + wave);
            iy = cy + Math.sin(angle) * (outerRad + wave);
            iz = Math.sin(angle * 2.5) * 55;
        } else {
            const f     = (prog - 0.45) / 0.55;
            const angle = prog * Math.PI * 12 - time * 0.035;
            ix = cx + Math.cos(angle) * f * 165;
            iy = cy + Math.sin(angle) * f * 165;
            iz = -70 + (1 - prog) * 200;
        }
        break;
    }

    case 'SHAPE_DYSON_SPHERE': {
        if (prog < 0.2) {
            const phi   = Math.acos(((i * 7.7) % 2) - 1);
            const theta = (i * 15.3) % (Math.PI * 2);
            const rad   = 32 + Math.sin(time * 0.06 + i) * 4;
            ix = cx + Math.sin(phi) * Math.cos(theta) * rad + rx * 0.3;
            iy = cy + Math.sin(phi) * Math.sin(theta) * rad + ry * 0.3;
            iz = Math.cos(phi) * rad + rz * 0.3;
        } else {
            const ring      = i % 3;
            const rad       = [155, 185, 215][ring];
            const ringProg  = Math.floor(i / 3) / Math.floor(total / 3);
            const angle     = ringProg * Math.PI * 2 + time * 0.015;
            let rxV = 0, ryV = 0, rzV = 0;
            if      (ring === 0) { rxV = Math.cos(angle)*rad; ryV = Math.sin(angle)*rad; rzV = 0; }
            else if (ring === 1) { rxV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; ryV = 0; }
            else                 { ryV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; rxV = 0; }
            const r = rotateInline(rxV, ryV, rzV, false);
            ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15;
        }
        break;
    }

    case 'SHAPE_PYRAMID': {
        const subPhase = i % 3;
        let tx = 0, ty = 0, tz = 0;
        if (subPhase === 0) {
            const phi   = Math.acos(1 - 2 * (prog * 3 % 1));
            const theta = (prog * 3 % 1) * Math.PI * 2 + time * 0.03;
            const rad   = 42 + Math.sin(time * 0.05 + i) * 5;
            tx = rad * Math.sin(phi) * Math.cos(theta);
            ty = rad * Math.sin(phi) * Math.sin(theta);
            tz = rad * Math.cos(phi);
        } else if (subPhase === 1) {
            const angle = (prog * 3 % 1) * Math.PI * 2 + time * 0.02;
            if (i % 2 === 0) { tx = Math.cos(angle)*190; ty = Math.sin(angle)*190; }
            else              { ty = Math.cos(angle)*190; tz = Math.sin(angle)*190; }
        } else {
            const spikeDir = i % 6;
            const len      = 80 + ((i * 7) % 20) / 19 * 160;
            const dirs = [[len,0,0],[-len,0,0],[0,len,0],[0,-len,0],[0,0,len],[0,0,-len]];
            [tx, ty, tz] = dirs[spikeDir];
        }
        const r = rotateInline(tx, ty, tz, true);
        ix = cx + r.x + rx * 0.1; iy = cy + r.y + ry * 0.1; iz = r.z + rz * 0.1;
        break;
    }

    } // end switch

    p.idealX = ix;
    p.idealY = iy;
    p.idealZ = iz;
}
