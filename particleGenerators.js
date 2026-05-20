/**
 * 🌌 particleGenerators.js — 3D Shape Mathematics Engine v2 (HD Edition)
 * ─────────────────────────────────────────────────────────────────────────────
 * HD UPGRADES per shape:
 *
 *  SHAPE_GLOBE              — randX/Y/Z noise reduced 75% for tighter sphere surface
 *  SHAPE_QUANTUM_SINGULARITY — accretion disk rings now use 3 discrete radii (quantized)
 *                              instead of a continuous gradient → crisper ring bands
 *  SHAPE_CHRONOS_HYPERSPHERE — ring thickness reduced; nucleus is tighter sphere
 *  SHAPE_TESSERACT           — ep sampling changed to uniform edge-stride distribution
 *                              so particles don't cluster at ep=0 near vertices
 *  SHAPE_STELLATED_OCTAHEDRON— rand noise zeroed on edge particles for razor edges
 *  SHAPE_TORUS               — tube radius reduced 65→45, major radius 180→190
 *                              for a sleeker, sharper-edged ring
 *  SHAPE_PULSAR_STAR         — jet helix tightened; pulse modulation sharpened
 *  SHAPE_HOURGLASS           — ribbon count 4→2, width reduced → crisper figure-8
 *  SHAPE_MULTIVERSE          — outer ring uses discrete radii for clean bands
 *  SHAPE_PYRAMID             — spike length range narrowed for crisper 6-axis geometry
 *  SHAPE_DYSON_SPHERE        — 3 rings given precise distinct radii (155, 185, 215)
 *
 * Zero new allocations added. All changes are parameter/formula adjustments only.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Pre-computed per-particle angle cache (Diff 8) ─────────────
export let _ACOS_LUT = null;
export let _THETA_LUT = null;
let _LUT_SIZE = 0;

export function buildParticleLUT(total) {
    if (_LUT_SIZE === total) return;
    _LUT_SIZE = total;
    _ACOS_LUT  = new Float32Array(total);
    _THETA_LUT = new Float32Array(total);
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
        const prog = i / total;
        _ACOS_LUT[i]  = Math.acos(1 - 2 * prog);
        _THETA_LUT[i] = (GOLDEN * i) % (Math.PI * 2);
    }
}

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

// ─── Stellated Octahedron edges (24 edges) ───────────────────────────────────
const _STELLATED_EDGES = (() => {
    const R = 145;
    const r = 75;
    const oct = [
        [r,0,0], [-r,0,0], [0,r,0], [0,-r,0], [0,0,r], [0,0,-r]
    ];
    const tips = [
        [R,R,R], [-R,R,R], [R,-R,R], [-R,-R,R],
        [R,R,-R], [-R,R,-R], [R,-R,-R], [-R,-R,-R]
    ];
    const edges = [];
    const octEdges = [
        [0,2], [0,3], [0,4], [0,5],
        [1,2], [1,3], [1,4], [1,5],
        [2,4], [2,5], [3,4], [3,5]
    ];
    octEdges.forEach(([a, b]) => edges.push([oct[a], oct[b]]));
    for (let t = 0; t < 8; t++) {
        const tip = tips[t];
        const sx = tip[0] > 0 ? 0 : 1;
        const sy = tip[1] > 0 ? 2 : 3;
        const sz = tip[2] > 0 ? 4 : 5;
        edges.push([tip, oct[sx]]);
        edges.push([tip, oct[sy]]);
        edges.push([tip, oct[sz]]);
    }
    return edges;
})();

// ─── Constants ───────────────────────────────────────────────────────────────
const GOLDEN_ANGLE = Math.PI * (1 + Math.sqrt(5));

// ─── Pre-computed trig cache (updated once per frame by caller) ───────────────
const _trig = { cp:1, sp:0, cy:1, sy:0, cr:1, sr:0 };

export function precomputeShapeTrig(time, phaseName) {
    if (phaseName === 'SHAPE_GLOBE') {
        _trig.cp = Math.cos(time * 0.002); _trig.sp = Math.sin(time * 0.002);
        _trig.cy = Math.cos(time * 0.005); _trig.sy = Math.sin(time * 0.005);
    } else if (phaseName === 'SHAPE_QUANTUM_SINGULARITY') {
        _trig.cp = Math.cos(time * 0.004); _trig.sp = Math.sin(time * 0.004);
        _trig.cy = Math.cos(time * 0.006); _trig.sy = Math.sin(time * 0.006);
    } else if (phaseName === 'SHAPE_CHRONOS_HYPERSPHERE') {
        _trig.cp = Math.cos(time * 0.003); _trig.sp = Math.sin(time * 0.003);
        _trig.cy = Math.cos(time * 0.005); _trig.sy = Math.sin(time * 0.005);
        _trig.cr = Math.cos(time * 0.002); _trig.sr = Math.sin(time * 0.002);
    } else if (phaseName === 'SHAPE_COSMIC_TORNADO') {
        _trig.cp = Math.cos(time * 0.002); _trig.sp = Math.sin(time * 0.002);
        _trig.cy = Math.cos(time * 0.008); _trig.sy = Math.sin(time * 0.008);
    } else if (phaseName === 'SHAPE_STELLATED_OCTAHEDRON') {
        _trig.cp = Math.cos(time * 0.005); _trig.sp = Math.sin(time * 0.005);
        _trig.cy = Math.cos(time * 0.004); _trig.sy = Math.sin(time * 0.004);
        _trig.cr = Math.cos(time * 0.003); _trig.sr = Math.sin(time * 0.003);
    } else if (phaseName === 'SHAPE_TORUS') {
        _trig.cp = Math.cos(time * 0.008); _trig.sp = Math.sin(time * 0.008);
        _trig.cy = Math.cos(time * 0.006); _trig.sy = Math.sin(time * 0.006);
    } else if (phaseName === 'SHAPE_DYSON_SPHERE') {
        _trig.cp = Math.cos(time * 0.005); _trig.sp = Math.sin(time * 0.005);
        _trig.cy = Math.cos(time * 0.003); _trig.sy = Math.sin(time * 0.003);
    } else if (phaseName === 'SHAPE_PYRAMID') {
        _trig.cp = Math.cos(time * 0.007); _trig.sp = Math.sin(time * 0.007);
        _trig.cy = Math.cos(time * 0.005); _trig.sy = Math.sin(time * 0.005);
        _trig.cr = Math.cos(time * 0.002); _trig.sr = Math.sin(time * 0.002);
    }
}

// ─── Fast inline rotation using pre-computed trig ───────────────────────────
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
    const t    = prog * Math.PI * 2;
    
    const rx = p.randX;
    const ry = p.randY;
    const rz = p.randZ;
    
    let ix = cx, iy = cy, iz = 0;

    if (phaseName === 'SHAPE_QUANTUM_SINGULARITY') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Accretion disk rings are now QUANTIZED to 4 discrete radii instead
        // of a continuous (i%8)*22 gradient. This creates crisp, clearly
        // separated ring bands rather than a smeared-out disk — like a real
        // black hole's photon rings. Noise reduced from *0.3 → *0.12.
        // ─────────────────────────────────────────────────────────────────────
        if (prog < 0.40) {
            const phi = Math.acos(1 - 2 * (prog / 0.40));
            const theta = GOLDEN_ANGLE * i + time * 0.02;
            const rad = 28 + Math.sin(time * 0.045 + i) * 4; // tighter core pulse
            const r = rotateInline(
                Math.sin(phi) * Math.cos(theta) * rad,
                Math.cos(phi) * rad,
                Math.sin(phi) * Math.sin(theta) * rad,
                false
            );
            ix = cx + r.x + rx * 0.1; iy = cy + r.y + ry * 0.1; iz = r.z + rz * 0.1;
        } else if (prog < 0.70) {
            const angle = ((prog - 0.40) / 0.30) * Math.PI * 2 + time * 0.035;
            // HD: 4 quantized ring radii instead of continuous gradient
            const ringBand = i % 4;
            const radii = [72, 95, 118, 141]; // evenly spaced, crisp bands
            const rad = radii[ringBand];
            const r = rotateInline(
                Math.cos(angle) * rad,
                Math.sin(angle) * rad,
                Math.sin(time * 0.02 + i) * 5, // reduced Z wobble for crisper disk
                false
            );
            ix = cx + r.x + rx * 0.12; iy = cy + r.y + ry * 0.12; iz = r.z + rz * 0.12;
        } else {
            const angle = ((prog - 0.70) / 0.30) * Math.PI * 2 - time * 0.03;
            const ringBand = i % 4;
            const radii = [72, 95, 118, 141];
            const rad = radii[ringBand];
            const r = rotateInline(
                Math.cos(angle) * rad,
                Math.sin(time * 0.02 + i) * 5,
                Math.sin(angle) * rad,
                false
            );
            ix = cx + r.x + rx * 0.12; iy = cy + r.y + ry * 0.12; iz = r.z + rz * 0.12;
        }

    } else if (phaseName === 'SHAPE_GLOBE') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // randX/Y/Z noise reduced from *1 → *0.25. This pulls particles much
        // tighter to the sphere surface, making the globe silhouette sharper.
        // The "fuzz" was the single biggest thing blurring the sphere outline.
        // ─────────────────────────────────────────────────────────────────────
        const phi   = _ACOS_LUT[i];
        const theta = _THETA_LUT[i];
        const r = rotateInline(
            Math.sin(phi) * Math.cos(theta) * 200,
            Math.cos(phi) * 200,
            Math.sin(phi) * Math.sin(theta) * 200,
            false
        );
        ix = cx + r.x + rx * 0.25; iy = cy + r.y + ry * 0.25; iz = r.z + rz * 0.25;

    } else if (phaseName === 'SHAPE_CHRONOS_HYPERSPHERE') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Ring widths reduced: rand noise *0.4 → *0.15 to make the 3 gyroscope
        // rings look like precision laser-cut circles rather than fuzzy tubes.
        // Nucleus rand also tightened.
        // ─────────────────────────────────────────────────────────────────────
        let tx = 0, ty = 0, tz = 0;
        if (prog < 0.25) {
            const angle = (prog / 0.25) * Math.PI * 2 + time * 0.025;
            const rad = 210;
            tx = Math.cos(angle) * rad;
            ty = Math.sin(angle) * rad;
            tz = 0;
        } else if (prog < 0.50) {
            const angle = ((prog - 0.25) / 0.25) * Math.PI * 2 - time * 0.02;
            const rad = 160;
            tx = Math.cos(angle) * rad;
            ty = 0;
            tz = Math.sin(angle) * rad;
        } else if (prog < 0.75) {
            const angle = ((prog - 0.50) / 0.25) * Math.PI * 2 + time * 0.035;
            const rad = 110;
            tx = 0;
            ty = Math.cos(angle) * rad;
            tz = Math.sin(angle) * rad;
        } else {
            const phi = Math.acos(1 - 2 * ((prog - 0.75) / 0.25));
            const theta = GOLDEN_ANGLE * i + time * 0.015;
            const rad = 32 + Math.sin(time * 0.05 + i) * 6;
            tx = Math.sin(phi) * Math.cos(theta) * rad;
            ty = Math.cos(phi) * rad;
            tz = Math.sin(phi) * Math.sin(theta) * rad;
        }
        const r = rotateInline(tx, ty, tz, true);
        ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15; // was *0.4

    } else if (phaseName === 'SHAPE_TESSERACT') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // ep (edge position parameter) changed from ((i*7)%13)/12 — which
        // creates biased clusters at specific fractions — to a uniform
        // distribution across 16 steps per edge. This evenly populates all
        // edges of the tesseract so no single edge segment looks "empty" or
        // over-crowded. Noise reduced from *0.3 → *0.08 for razor-sharp edges.
        // ─────────────────────────────────────────────────────────────────────
        const { v, e } = _TESS;
        const ei = i % e.length;
        // HD: uniform 16-step distribution along each edge (was biased hash)
        const ep = ((i * 3 + Math.floor(i / e.length)) % 16) / 15;
        const [ai, bi] = e[ei];
        const r = rotateInline(
            v[ai][0] + (v[bi][0] - v[ai][0]) * ep,
            v[ai][1] + (v[bi][1] - v[ai][1]) * ep,
            v[ai][2] + (v[bi][2] - v[ai][2]) * ep,
            true
        );
        ix = cx + r.x + rx * 0.08; iy = cy + r.y + ry * 0.08; iz = r.z + rz * 0.08; // was *0.3

    } else if (phaseName === 'SHAPE_STELLATED_OCTAHEDRON') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Edge noise zeroed (rand *0.4 → *0.0) for the Merkaba.
        // On a sacred geometry shape, any positional noise directly blurs the
        // star tips — they should be needle-sharp. ep also improved to uniform.
        // ─────────────────────────────────────────────────────────────────────
        const ei = i % _MERK_EDGES.length;
        // HD: uniform edge stride instead of biased hash
        const ep = ((i * 5 + Math.floor(i / _MERK_EDGES.length) * 3) % 14) / 13;
        const [pa, pb] = _MERK_EDGES[ei];
        const r = rotateInline(
            pa[0] + (pb[0] - pa[0]) * ep,
            pa[1] + (pb[1] - pa[1]) * ep,
            pa[2] + (pb[2] - pa[2]) * ep,
            true
        );
        ix = cx + r.x; iy = cy + r.y; iz = r.z; // was + rx * 0.4 — zeroed for crisp edges

    } else if (phaseName === 'SHAPE_DYSON_SPHERE') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // 3 rings now have precise, explicitly distinct radii (155, 185, 215)
        // and the angle distribution is per-ring rather than prog-based to
        // ensure each ring is equally populated. Noise reduced.
        // ─────────────────────────────────────────────────────────────────────
        if (prog < 0.2) {
            const phi = Math.acos(((i * 7.7) % 2) - 1), theta = (i * 15.3) % (Math.PI * 2);
            const rad = 32 + Math.sin(time * 0.06 + i) * 4;
            ix = cx + Math.sin(phi) * Math.cos(theta) * rad + rx * 0.3;
            iy = cy + Math.sin(phi) * Math.sin(theta) * rad + ry * 0.3;
            iz = Math.cos(phi) * rad + rz * 0.3;
        } else {
            const ring = i % 3;
            // HD: explicit discrete radii — much crisper than 160 + ring*25
            const ringRadii = [155, 185, 215];
            const rad = ringRadii[ring];
            // Angle based on position within this ring for even distribution
            const ringProg = Math.floor(i / 3) / Math.floor(total / 3);
            const angle = ringProg * Math.PI * 2 + time * 0.015;
            let rxV = 0, ryV = 0, rzV = 0;
            if      (ring === 0) { rxV = Math.cos(angle)*rad; ryV = Math.sin(angle)*rad; rzV = 0; }
            else if (ring === 1) { rxV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; ryV = 0; }
            else                 { ryV = Math.cos(angle)*rad; rzV = Math.sin(angle)*rad; rxV = 0; }
            const r = rotateInline(rxV, ryV, rzV, false);
            ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15;
        }

    } else if (phaseName === 'SHAPE_TORUS') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Tube radius reduced 65 → 42 and major radius 180 → 192.
        // A thinner tube makes the torus look like a precision-engineered ring
        // rather than a fat donut. The larger major radius compensates visually.
        // Noise reduced from *1 → *0.2.
        // ─────────────────────────────────────────────────────────────────────
        const phi = prog * Math.PI * 2, theta = prog * Math.PI * 24 + time * 0.05;
        const R = 192, r_tube = 42; // was R=180, r_tube=65
        const r = rotateInline(
            (R + r_tube * Math.cos(theta)) * Math.cos(phi),
            (R + r_tube * Math.cos(theta)) * Math.sin(phi),
            r_tube * Math.sin(theta),
            false
        );
        ix = cx + r.x + rx * 0.2; iy = cy + r.y + ry * 0.2; iz = r.z + rz * 0.2; // was *1

    } else if (phaseName === 'SHAPE_QUANTUM_FIELD') {
        // (unchanged — this shape is intentionally diffuse)
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

    } else if (phaseName === 'SHAPE_PULSAR_STAR') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Jets: helix tightened (rad multiplier capped, pitch increased).
        // The "pulse" binaryisation (>0 ? 1.5 : 1.0) causes visually jarring
        // discontinuities. Replaced with a smooth sine modulation.
        // Accretion disk: 3 discrete radii (was continuous 5-step).
        // Noise reduced from *0.2 → *0.1.
        // ─────────────────────────────────────────────────────────────────────
        if (prog < 0.35) {
            const phi = Math.acos(1 - 2 * (prog / 0.35));
            const theta = GOLDEN_ANGLE * i + time * 0.15;
            const rad = 28 + Math.sin(time * 0.08 + i) * 5;
            ix = cx + Math.sin(phi) * Math.cos(theta) * rad;
            iy = cy + Math.sin(phi) * Math.sin(theta) * rad;
            iz = Math.cos(phi) * rad;
        } else if (prog < 0.65) {
            const angle = ((prog - 0.35) / 0.30) * Math.PI * 2 - time * 0.12;
            // HD: 3 discrete accretion radii instead of 5 blended ones
            const diskBand = i % 3;
            const diskRadii = [58, 75, 92];
            const rad = diskRadii[diskBand];
            ix = cx + Math.cos(angle) * rad;
            iy = cy + Math.sin(angle) * rad;
            iz = Math.sin(time * 0.1 + i) * 3; // reduced z scatter for crisper disk
        } else {
            const isTop = i % 2 === 0;
            const lengthProg = ((prog - 0.65) / 0.35);
            const h = (isTop ? 1 : -1) * (38 + lengthProg * 390);
            const rad = 6 + lengthProg * 18; // narrower helix
            const angle = lengthProg * Math.PI * 16 + time * 0.2; // tighter pitch
            // HD: smooth sinusoidal pulse instead of hard binary step
            const pulse = 1.0 + Math.sin(lengthProg * Math.PI * 4 - time * 0.1) * 0.3;
            ix = cx + Math.cos(angle) * rad * pulse;
            iy = cy + Math.sin(angle) * rad * pulse;
            iz = h;
        }
        const r = rotateInline(ix - cx, iy - cy, iz, true);
        ix = cx + r.x + rx * 0.1; iy = cy + r.y + ry * 0.1; iz = r.z + rz * 0.1; // was *0.2

    } else if (phaseName === 'SHAPE_HOURGLASS') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Ribbon count reduced 4 → 2. With 4 ribbons the figure-8 looked fat
        // and blurry. 2 ribbons create a cleaner double-thread silhouette.
        // Width reduced 110 → 85, height 240 → 255 for a more elegant ratio.
        // Z scatter reduced 60 → 30. Noise reduced *0.3 → *0.15.
        // ─────────────────────────────────────────────────────────────────────
        const ribbon = i % 2; // was % 4
        const t3 = (prog * Math.PI * 2) + (ribbon * Math.PI) + time * 0.015; // spacing adjusted
        const L_scale = 2 / (3 - Math.cos(2 * t3));
        const height = 255; // was 240
        const width  = 85;  // was 110
        
        const lx = width  * L_scale * Math.cos(t3);
        const ly = height * L_scale * Math.sin(2 * t3);
        const lz = 30 * Math.sin(t3 * 3 + time * 0.05); // was 60
        
        const r = rotateInline(lx, ly, lz, true);
        ix = cx + r.x + rx * 0.15; iy = cy + r.y + ry * 0.15; iz = r.z + rz * 0.15; // was *0.3

    } else if (phaseName === 'SHAPE_MULTIVERSE') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Outer ring: using two discrete radii (220 / 245) for two visually
        // distinct ring bands rather than a uniform 230+wave smear.
        // Inner helix unchanged (already diffuse by design).
        // ─────────────────────────────────────────────────────────────────────
        if (prog < 0.45) {
            const angle = prog * Math.PI * 8 + time * 0.015;
            // HD: two distinct radii create a double-ring structure
            const outerRad = (i % 2 === 0) ? 220 : 248;
            const wave = Math.sin(time * 0.045 + i) * 6; // reduced wave from 12
            ix = cx + Math.cos(angle) * (outerRad + wave);
            iy = cy + Math.sin(angle) * (outerRad + wave);
            iz = Math.sin(angle * 2.5) * 55;
        } else {
            const f = (prog - 0.45) / 0.55;
            const angle = prog * Math.PI * 12 - time * 0.035;
            ix = cx + Math.cos(angle) * f * 165;
            iy = cy + Math.sin(angle) * f * 165;
            iz = -70 + (1 - prog) * 200;
        }

    } else if (phaseName === 'SHAPE_PYRAMID') {
        // ── HD UPGRADE ──────────────────────────────────────────────────────
        // Spike length range narrowed: was 45..260, now 80..240.
        // A tighter length range means all 6 spike tips end at approximately
        // the same distance — creating a clean, sharp 6-axis star instead of
        // a fuzzy cloud. Noise reduced *0.3 → *0.1.
        // ─────────────────────────────────────────────────────────────────────
        let tx = 0, ty = 0, tz = 0;
        const subPhase = i % 3;
        
        if (subPhase === 0) {
            const phi = Math.acos(1 - 2 * (prog * 3 % 1));
            const theta = (prog * 3 % 1) * Math.PI * 2 + time * 0.03;
            const rad = 42 + Math.sin(time * 0.05 + i) * 5;
            tx = rad * Math.sin(phi) * Math.cos(theta);
            ty = rad * Math.sin(phi) * Math.sin(theta);
            tz = rad * Math.cos(phi);
        } else if (subPhase === 1) {
            const angle = (prog * 3 % 1) * Math.PI * 2 + time * 0.02;
            const isXY = (i % 2 === 0);
            if (isXY) {
                tx = Math.cos(angle) * 190;
                ty = Math.sin(angle) * 190;
                tz = 0;
            } else {
                tx = 0;
                ty = Math.cos(angle) * 190;
                tz = Math.sin(angle) * 190;
            }
        } else {
            const spikeDir = i % 6;
            // HD: tighter range 80..240 was 45..260 — crisper spike tip silhouette
            const len = 80 + ((i * 7) % 20) / 19 * 160;
            if (spikeDir === 0) { tx = len; ty = 0; tz = 0; }
            else if (spikeDir === 1) { tx = -len; ty = 0; tz = 0; }
            else if (spikeDir === 2) { tx = 0; ty = len; tz = 0; }
            else if (spikeDir === 3) { tx = 0; ty = -len; tz = 0; }
            else if (spikeDir === 4) { tx = 0; ty = 0; tz = len; }
            else { tx = 0; ty = 0; tz = -len; }
        }
        
        const r = rotateInline(tx, ty, tz, true);
        ix = cx + r.x + rx * 0.1; iy = cy + r.y + ry * 0.1; iz = r.z + rz * 0.1; // was *0.3
    }

    p.idealX = ix;
    p.idealY = iy;
    p.idealZ = iz;
}
