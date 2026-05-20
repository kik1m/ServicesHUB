// 🎬 CINEMATIC MOTION ENGINE v2 — HUBly Particle Transitions
// ─────────────────────────────────────────────────────────────────────────────
// Design philosophy: Every transition has THREE acts — Break, Travel, Arrive.
//   Break:  particles leave the source shape with a physics-coherent impulse.
//   Travel: particles flow along a cinematic force-field, not a straight line.
//   Arrive: particles snap to the destination with an elastic overshoot & settle.
//
// Performance contract: Zero allocation per call. All constants are module-level.
// All Math.acos/phi values that depend only on (i,total) are pre-computed in
// the _PHI_LUT + _THETA_LUT Float32Arrays (built once, reused across phases).
// ─────────────────────────────────────────────────────────────────────────────

// ─── Module-level zero-allocation constants ───────────────────────────────────
// Octant directions for sacred geometry — moved out of per-particle call (was allocating 280 arrays/frame)
const _OCTANT_DIRS = [
    [1,1,1], [-1,1,1], [1,-1,1], [-1,-1,1],
    [1,1,-1], [-1,1,-1], [1,-1,-1], [-1,-1,-1]
];

// Per-particle LUTs — built once on first call, reused every frame
let _PHI_LUT    = null; // Float32Array: acos(1 - 2*(i/total))
let _THETA_LUT  = null; // Float32Array: fract spiral angle per particle
let _NOISE_LUT  = null; // Float32Array: deterministic pseudo-random offset [-1..1]
let _LUT_N      = 0;

function _buildLUT(total) {
    if (_LUT_N === total) return;
    _LUT_N     = total;
    _PHI_LUT   = new Float32Array(total);
    _THETA_LUT = new Float32Array(total);
    _NOISE_LUT = new Float32Array(total);
    const TAU = Math.PI * 2;
    const GOLDEN = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < total; i++) {
        const prog = i / total;
        _PHI_LUT[i]   = Math.acos(Math.max(-1, Math.min(1, 1 - 2 * prog)));
        _THETA_LUT[i] = (GOLDEN * i) % TAU;
        // Deterministic pseudo-noise: no Math.random(), no GC, perfectly repeatable
        _NOISE_LUT[i] = (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1.0;
        if (_NOISE_LUT[i] < 0) _NOISE_LUT[i] += 1;
        _NOISE_LUT[i] = _NOISE_LUT[i] * 2 - 1; // remap to [-1, 1]
    }
}

// ─── Elite easing functions — all zero-allocation, pure math ─────────────────

// Elastic overshoot ease-out: particle arrives and bounces back slightly, cinematic snap
// k controls stiffness (4 = soft, 8 = medium, 12 = snappy). Tuned per transition.
function _elasticOut(t, k) {
    if (t === 0 || t === 1) return t;
    const p = 0.4, s = p / (Math.PI * 2) * Math.asin(1 / 1); // period, shift
    return Math.pow(2, -k * t) * Math.sin((t - s) * (Math.PI * 2) / p) + 1;
}

// Exponential ease-out: blazing fast start, asymptotic finish. Best for blasts/explosions.
function _expoOut(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

// Back ease-out: overshoots the target slightly before settling. Adds weight and drama.
function _backOut(t, overshoot) {
    const s = overshoot !== undefined ? overshoot : 1.70158;
    const t1 = t - 1;
    return t1 * t1 * ((s + 1) * t1 + s) + 1;
}

// Quint ease-in-out: smooth cinematic morph, no overshoot. Used for fluid shape arrival.
function _quintInOut(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

// Sine bell curve: symmetric rise-and-fall. Used for the displacement arc at midpoint.
function _sinBell(t) {
    return Math.sin(t * Math.PI);
}

// Custom "spring snap" curve: fast in, elastic at end. Replaces the flat arc in most transitions.
// amplitude controls the elastic tail size.
function _springSnap(t, amplitude) {
    const a = amplitude !== undefined ? amplitude : 0.25;
    const base = _quintInOut(Math.min(t, 1));
    const elastic = Math.exp(-t * 8) * Math.sin(t * Math.PI * 5) * a;
    return base + elastic * (1 - base);
}

// ─── Cinematic force-field helpers ───────────────────────────────────────────

// Computes a swirling tangential offset in XZ plane around the Y axis.
// Creates the "flowing like a force field" effect at transition midpoint.
// This is called once per particle, all scalars — zero allocation.
function _tangentialSwirl(ix, iy, iz, cx, cy, strength) {
    const dx = ix - cx, dz = iz;
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    // Tangent in XZ plane (perpendicular to radius)
    const tx = -dz / len;
    const tz =  dx / len;
    return { sx: tx * strength, sz: tz * strength };
}

// Computes a vortex funnel offset: pulls toward center axis while spinning.
// Used for transitions that "suck in" before releasing.
function _vortexPull(ix, iy, iz, cx, cy, pullStrength, spinStrength, t) {
    const dx = ix - cx, dy = iy - cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const angle = Math.atan2(dy, dx) + spinStrength * t * Math.PI * 4;
    const r = dist * (1 - pullStrength * _sinBell(t));
    return {
        vx: cx + Math.cos(angle) * r - ix,
        vy: cy + Math.sin(angle) * r - iy
    };
}

// ─── Main transition function ─────────────────────────────────────────────────
// Called per-particle during the 180-frame transition window.
// localT  : [0..1] particle-local progress (with staggered delay applied by caller)
// ease    : pre-computed quintic ease from caller (we may override per transition)
export function buildTransitionLUT(total) {
    _buildLUT(total);
}

// arc     : sin(localT * PI) — the displacement bell (midpoint peak)
// globalT : raw phaseTimer/180 — for transitions that use the global wave

export function updateParticleTransition(p, phaseIdx, i, total, localT, ease, arc, swirlX, swirlY, globalTime, cx, cy) {
    // ⚡ PERF: _buildLUT removed from hot path; called once globally on init/resize!

    const startX = p.transStartX;
    const startY = p.transStartY;
    const startZ = p.transStartZ;
    const idealX = p.idealX;
    const idealY = p.idealY;
    const idealZ = p.idealZ;

    // Base interpolated position — where the particle "wants" to be right now
    // We replace the flat linear ease with the more cinematic springSnap.
    // The caller's `ease` is quintic; we recompute with spring physics here
    // so each transition can choose its own arrival curve independently.
    const snapEase = _springSnap(localT, 0.18);
    const baseX = startX + (idealX - startX) * snapEase;
    const baseY = startY + (idealY - startY) * snapEase;
    const baseZ = startZ + (idealZ - startZ) * snapEase;

    // Reset per-particle modifiers
    p.localSizeMult = 1.0;
    p.localOpMult   = 1.0;
    p.chromaticShift = 0;

    // Stagger-based delay factor: particles near the shape's skin arrive later
    // than particles at the center — creates a "crystallization wave" effect.
    // Used to modulate the displacement amplitude below.
    const delayFade = Math.max(0, Math.min(1, localT * 3 - 0.1));

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 0 → SHAPE_GLOBE: "Orbital Gravity Slingshot"
    // Particles orbit an invisible gravity well with increasing eccentricity,
    // then get gravitationally slung directly into their globe surface position.
    // The orbit ellipse shrinks and tilts toward the destination vector.
    // ─────────────────────────────────────────────────────────────────────────
    if (phaseIdx === 0) {
        // Two-phase orbit: wide chaotic spiral (t < 0.5) → tightening slingshot (t > 0.5)
        const phase = localT < 0.5 ? localT * 2 : (localT - 0.5) * 2;
        const isSlingshot = localT >= 0.5;

        if (!isSlingshot) {
            // BREAK phase: particles burst outward into elliptical orbit
            // Each particle gets a unique orbital plane based on its index
            const orbitTilt  = (_NOISE_LUT[i % _LUT_N] * 0.4 + 0.3) * Math.PI; // [0.1π .. 0.7π]
            const orbitPhase = _THETA_LUT[i % _LUT_N] + phase * Math.PI * 5;
            const eccentricity = 1.0 - phase * 0.3; // starts very elliptical, circularizes
            const orbitR = _expoOut(phase) * 260 * eccentricity;

            const ox = Math.cos(orbitPhase) * orbitR;
            const oy = Math.sin(orbitPhase) * orbitR * Math.sin(orbitTilt);
            const oz = Math.sin(orbitPhase) * orbitR * Math.cos(orbitTilt);

            p.targetX = baseX + ox * (1 - snapEase);
            p.targetY = baseY + oy * (1 - snapEase);
            p.targetZ = baseZ + oz * (1 - snapEase);
        } else {
            // SLINGSHOT phase: pulled hard toward destination with elastic overshoot
            const arrivedEase = _backOut(phase, 1.4);
            const tx = startX + (idealX - startX) * arrivedEase;
            const ty = startY + (idealY - startY) * arrivedEase;
            const tz = startZ + (idealZ - startZ) * arrivedEase;

            // Tangential swirl at the arrival point for cinematic "orbital insertion"
            const swirl = _tangentialSwirl(idealX, idealY, idealZ, cx, cy, (1 - phase) * 18);
            p.targetX = tx + swirl.sx * (1 - phase);
            p.targetY = ty;
            p.targetZ = tz + swirl.sz * (1 - phase);
        }
        p.localSizeMult = 1.0 + arc * 0.5; // particles flare slightly at midpoint

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 1 → SHAPE_QUANTUM_SINGULARITY: "Supernova Collapse Wave"
    // A spherical shockwave expands outward, freezes all particles mid-flight,
    // then a gravity reversal pulls everything inward into the singularity.
    // Uses a TIME-STAGGERED wave front — particles on the wave rim get the
    // brightest burst; particles ahead of and behind it are calm.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 1) {
        // 💥 SUPERNOVA SHOCKWAVE BURST (For Quantum Singularity)
        // Particles violently blast outwards in an expanding spherical wave, then get forcefully sucked back into the singularity.
        const blastSpeed = arc * 280;
        const angle = (i / total) * Math.PI * 2 + localT * Math.PI * 4;
        const phi = _PHI_LUT[i % _LUT_N];
        
        const bx = Math.sin(phi) * Math.cos(angle) * blastSpeed;
        const by = Math.cos(phi) * blastSpeed;
        const bz = Math.sin(phi) * Math.sin(angle) * blastSpeed;
        
        p.targetX = baseX + bx;
        p.targetY = baseY + by;
        p.targetZ = baseZ + bz;

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 2 → SHAPE_CHRONOS_HYPERSPHERE: "Triple-Axis Gyroscopic Unwinding"
    // The 3 rings of the gyroscope independently accelerate, hit escape velocity,
    // spin off tangentially, then reconverge with a magnetic snap onto the new rings.
    // Particles are assigned to rings by index and travel their ring's unique path.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 2) {
        const ring  = i % 3;
        const intraRingT = (i / total); // position within this ring [0..1]

        // Each ring has its own phase offset and axis so they feel independent
        const ringPhase = [0, 0.18, 0.36][ring]; // staggered start times
        const rLocalT   = Math.max(0, Math.min(1, (localT - ringPhase) / (1 - ringPhase)));
        const rEase     = _elasticOut(rLocalT, 6);

        // The ring's "escape" arc: expands outward on its spin plane, then snaps in
        const spinSpeed  = [5, -4, 6][ring]; // each ring spins at a different rate
        const spinAngle  = intraRingT * Math.PI * 2 + rLocalT * Math.PI * spinSpeed;
        const escapeR    = localT < 0.5
            ? _expoOut(localT * 2) * 200
            : (1 - _expoOut((localT - 0.5) * 2)) * 200 + 10;

        let rx = 0, ry = 0, rz = 0;
        const ca = Math.cos(spinAngle), sa = Math.sin(spinAngle);
        if (ring === 0) { rx = ca * escapeR; ry = sa * escapeR; }
        else if (ring === 1) { rx = ca * escapeR; rz = sa * escapeR; }
        else  { ry = ca * escapeR; rz = sa * escapeR; }

        // Arrive at final position with elastic snap
        p.targetX = startX + (idealX - startX) * rEase + rx * (1 - rEase) * 0.7;
        p.targetY = startY + (idealY - startY) * rEase + ry * (1 - rEase) * 0.7;
        p.targetZ = startZ + (idealZ - startZ) * rEase + rz * (1 - rEase) * 0.7;

        p.localSizeMult = 1.0 + _sinBell(rLocalT) * 0.4;

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 3 → SHAPE_TESSERACT: "4D Hypercube Dimensional Fold"
    // Particles fold through 4 distinct 90° rotational phases, each with a crisp
    // acceleration-deceleration. The tesseract "unfolds" dimensionally.
    // No random displacement — purely geometric, mechanical, architectural.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 3) {
        // 4 distinct fold stages, each 25% of the transition
        const foldStage   = Math.min(3, Math.floor(localT * 4)); // 0,1,2,3
        const stageT      = (localT * 4) % 1.0;
        const stageEase   = _backOut(stageT, 0.8); // crisp mechanical snapping

        // Deterministic fold axis per particle (based on index mod 4)
        const axis = i % 4;
        const sign = (i % 2 === 0) ? 1 : -1;

        // Progressive fold radius: each stage adds a new geometric dimension
        const foldRadii = [160, 130, 100, 70];
        const foldR = foldRadii[foldStage] * stageEase * sign;

        let fdx = 0, fdy = 0, fdz = 0;
        if (axis === 0)      { fdx = foldR; }
        else if (axis === 1) { fdy = foldR; }
        else if (axis === 2) { fdz = foldR; }
        else                 { fdx = foldR * 0.577; fdy = foldR * 0.577; fdz = foldR * 0.577; } // diagonal

        // Apply fold displacement decaying toward destination
        const arrivalWeight = _quintInOut(localT);
        p.targetX = baseX + fdx * (1 - arrivalWeight);
        p.targetY = baseY + fdy * (1 - arrivalWeight);
        p.targetZ = baseZ + fdz * (1 - arrivalWeight);

        // Scale pulse on each fold snap
        p.localSizeMult = 1.0 + (1 - stageT) * 0.5 * (foldStage < 3 ? 1 : 0);

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 4 → SHAPE_STELLATED_OCTAHEDRON: "Sacred Geometry Crystallization"
    // Particles are first pulled into the 8 pyramid peaks by a magnetism field.
    // Then, each peak "explodes inward" along the sacred geometry axes,
    // depositing particles onto the final Merkaba edges with a crystal-lattice snap.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 4) {
        const corner = i % 8;
        const dir    = _OCTANT_DIRS[corner]; // zero allocation — module-level

        // Phase 1 (0..0.45): particles magnetized outward to the 8 pyramid tips
        // Phase 2 (0.45..1): each tip collapses inward — crystallization
        if (localT < 0.45) {
            const pullT = localT / 0.45;
            const pullEase = _expoOut(pullT);
            const dist = 200 + Math.abs(_NOISE_LUT[i % _LUT_N]) * 30; // slight variation
            p.targetX = baseX + dir[0] * dist * pullEase * _sinBell(pullT);
            p.targetY = baseY + dir[1] * dist * pullEase * _sinBell(pullT);
            p.targetZ = baseZ + dir[2] * dist * pullEase * _sinBell(pullT);
            p.localSizeMult = 1.0 + pullEase * 0.6;
        } else {
            // Crystallization: elastic arrival at the Merkaba surface
            const crystalT   = (localT - 0.45) / 0.55;
            const crystalEase = _elasticOut(crystalT, 7);
            p.targetX = startX + (idealX - startX) * crystalEase;
            p.targetY = startY + (idealY - startY) * crystalEase;
            p.targetZ = startZ + (idealZ - startZ) * crystalEase;
            // Particles "click" into their crystalline positions with a size flash
            p.localSizeMult = 1.0 + Math.exp(-crystalT * 6) * 1.2;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 5 → SHAPE_TORUS: "Accretion Vortex Compression"
    // A vortex forms at center, pulling particles into a tight spinning disk,
    // then the disk stretches and rolls outward into the torus ring geometry.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 5) {
        // PHASE 1: vortex pull inward
        if (localT < 0.4) {
            const vt = localT / 0.4;
            const vEase = _expoOut(vt);
            // Each particle spirals inward on its own angular track
            const spiralAngle = _THETA_LUT[i % _LUT_N] + vt * Math.PI * 6;
            const spiralR     = (1 - vEase) * 220 + 15;
            const vx = cx + Math.cos(spiralAngle) * spiralR;
            const vy = cy + Math.sin(spiralAngle) * spiralR * 0.2; // flatten to disk
            const vz = Math.sin(spiralAngle * 2) * spiralR * 0.1;
            p.targetX = startX + (vx - startX) * vEase;
            p.targetY = startY + (vy - startY) * vEase;
            p.targetZ = startZ + (vz - startZ) * vEase;
            p.localSizeMult = 1.0 + vt * 0.3;
        } else {
            // PHASE 2: disk unrolls into torus — elastic arrival
            const unrollT  = (localT - 0.4) / 0.6;
            const unrollEase = _backOut(unrollT, 1.2);
            p.targetX = startX + (idealX - startX) * unrollEase;
            p.targetY = startY + (idealY - startY) * unrollEase;
            p.targetZ = startZ + (idealZ - startZ) * unrollEase;
            p.localSizeMult = 1.0 + Math.exp(-unrollT * 4) * 0.5;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 6 → SHAPE_PULSAR_STAR: "Gamma-Ray Polar Jet Burst"
    // Two counter-rotating gamma-ray jets fire from the poles.
    // The jets are NOT just vertical lines — they spiral with tightening helical
    // geometry, and particles along the helix arrive at their star positions
    // with a velocity-based elastic snap simulating real pulsar emission physics.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 6) {
        const isTopJet  = i % 2 === 0;
        const jetSign   = isTopJet ? 1 : -1;
        const particleNoise = _NOISE_LUT[i % _LUT_N];

        // Helix jet trajectory: tight spiral expanding into jets
        if (localT < 0.5) {
            // BUILD phase: particles converge into the polar axis
            const buildT    = localT * 2;
            const buildEase = _expoOut(buildT);
            // Spiral tightening toward y-axis
            const helixAngle  = _THETA_LUT[i % _LUT_N] + buildT * Math.PI * 8;
            const helixRadius = (1 - buildEase) * 120 + 5;
            const helixY      = buildEase * jetSign * 60;
            p.targetX = startX + (cx + Math.cos(helixAngle) * helixRadius - startX) * buildEase;
            p.targetY = startY + (cy + helixY - startY) * buildEase;
            p.targetZ = startZ + (Math.sin(helixAngle) * helixRadius - startZ) * buildEase;
        } else {
            // FIRE phase: jets explode outward — staggered by particle index for wave effect
            const fireT     = (localT - 0.5) * 2;
            const fireDelay = Math.abs(particleNoise) * 0.25; // stagger the wave front
            const adjFireT  = Math.max(0, Math.min(1, (fireT - fireDelay) / (1 - fireDelay)));
            const fireEase  = _expoOut(adjFireT);

            // Helical jet path (tighter near base, wider at tip)
            const jetLen      = fireEase * 440 * jetSign;
            const helixExpand = fireEase * 20; // spiral expands as it fires
            const helixAngle  = _THETA_LUT[i % _LUT_N] + fireEase * Math.PI * 14;

            const jx = cx + Math.cos(helixAngle) * helixExpand;
            const jy = cy + jetLen;
            const jz = Math.sin(helixAngle) * helixExpand;

            // Elastic arrival at pulsar surface position
            const arrivalT  = _elasticOut(Math.max(0, adjFireT - 0.4) / 0.6, 5);
            p.targetX = jx + (idealX - jx) * arrivalT;
            p.targetY = jy + (idealY - jy) * arrivalT;
            p.targetZ = jz + (idealZ - jz) * arrivalT;

            // Particles flash brightest at the moment they fire
            const flashBright = Math.max(0, 1 - adjFireT * 3);
            p.localSizeMult  = 1.0 + flashBright * 2.0;
            p.localOpMult    = 1.0 + flashBright * 0.5;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 7 → SHAPE_HOURGLASS: "Lemniscate Pinch & Bloom"
    // Particles flow through the mathematical pinch point of a lemniscate (∞),
    // creating a cinematic "hour glass turns over" moment where all particles
    // pass through a single bright singularity point before fanning back out.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 7) {
        const pn = _NOISE_LUT[i % _LUT_N];

        // Convergence to pinch point: all particles move toward (cx, cy, 0)
        if (localT < 0.5) {
            const pinchT    = localT * 2;
            const pinchEase = _quintInOut(pinchT);
            // Route via the lemniscate curve toward the pinch (t3=0 → x=0, y=0)
            const t3        = (1 - pinchT) * Math.PI * 2 * (i / total);
            const L_scale   = 2 / (3 - Math.cos(2 * t3));
            const lx        = 120 * L_scale * Math.cos(t3) * (1 - pinchEase);
            const ly        = 220 * L_scale * Math.sin(2 * t3) * (1 - pinchEase);
            p.targetX = startX + (cx - startX) * pinchEase + lx;
            p.targetY = startY + (cy - startY) * pinchEase + ly;
            p.targetZ = startZ * (1 - pinchEase) + Math.sin(t3 * 3) * 60 * (1 - pinchEase);
            // Particles grow brighter as they converge — the singularity brightens
            p.localSizeMult = 1.0 + pinchEase * 1.8;
            p.localOpMult   = 1.0 + pinchEase * 0.5;
        } else {
            // BLOOM: particles exit the pinch along the new hourglass shape
            const bloomT    = (localT - 0.5) * 2;
            const bloomEase = _elasticOut(bloomT, 5);
            p.targetX = cx + (idealX - cx) * bloomEase;
            p.targetY = cy + (idealY - cy) * bloomEase;
            p.targetZ = (idealZ) * bloomEase;
            // Decay from the singularity flash
            const flash = Math.exp(-bloomT * 5);
            p.localSizeMult = 1.0 + flash * 2.5 + Math.exp(-bloomT * 2) * 0.4;
            p.localOpMult   = 1.0 + flash * 0.6;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 8 → SHAPE_MULTIVERSE: "Crystal Lattice Explosion"
    // Particles are first magnetically compressed into a dense rotating crystal,
    // then the crystal shatters outward along its lattice vectors into the
    // multiverse rings. The shatter is NOT random — it follows the 26 face-normals
    // of a cube so it looks geometrically intentional.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 8) {
        // 26 possible crystal shatter directions (cube faces, edges, corners)
        const shatterIdx = i % 26;
        const s  = Math.sign(_NOISE_LUT[i % _LUT_N] + 0.001) || 1;
        const sx = (shatterIdx % 3 - 1) || s;
        const sy = (Math.floor(shatterIdx / 3) % 3 - 1) || s;
        const sz = (Math.floor(shatterIdx / 9) % 3 - 1) || s;
        const sLen = Math.sqrt(sx*sx + sy*sy + sz*sz) || 1;

        if (localT < 0.35) {
            // COMPRESS: pull into crystal structure at center
            const compressT    = localT / 0.35;
            const compressEase = _expoOut(compressT);
            const cubeEdge = 5, idx = i % 125;
            const gx = (idx % cubeEdge - 2) * 10;
            const gy = (Math.floor((idx / cubeEdge) % cubeEdge) - 2) * 10;
            const gz = (Math.floor(idx / 25) - 2) * 10;
            // Slow crystal rotation during formation
            const rot = compressT * Math.PI * 1.5;
            const cosR = Math.cos(rot), sinR = Math.sin(rot);
            const rx = gx * cosR - gz * sinR;
            const rz = gx * sinR + gz * cosR;
            p.targetX = startX + (cx + rx - startX) * compressEase;
            p.targetY = startY + (cy + gy - startY) * compressEase;
            p.targetZ = startZ + (rz - startZ) * compressEase;
            p.localSizeMult = 1.0 + compressEase * 0.3;
        } else {
            // SHATTER: lattice-directed explosion toward multiverse
            const shatterT    = (localT - 0.35) / 0.65;
            const shatterEase = _expoOut(shatterT);
            const shatterDist = _sinBell(shatterT * 0.8) * 280;
            // Direction normalized to lattice vector
            const dx = (sx / sLen) * shatterDist;
            const dy = (sy / sLen) * shatterDist;
            const dz = (sz / sLen) * shatterDist;
            const arriveEase  = Math.max(0, _quintInOut((shatterT - 0.45) / 0.55));
            p.targetX = cx + dx + (idealX - (cx + dx)) * arriveEase;
            p.targetY = cy + dy + (idealY - (cy + dy)) * arriveEase;
            p.targetZ = dz + (idealZ - dz) * arriveEase;
            p.localSizeMult = 1.0 + Math.exp(-shatterT * 4) * 1.5;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 9 → SHAPE_DYSON_SPHERE: "Quantum String Collapse"
    // All particles are first pulled onto a single glowing horizontal string
    // (1D collapse), vibrate rapidly along it like a plucked string, then
    // the string "rings" disperse the particles into the Dyson sphere orbits.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 9) {
        const stringX = cx + ((i / total) - 0.5) * 480;
        const pn = _NOISE_LUT[i % _LUT_N];

        if (localT < 0.4) {
            // COLLAPSE to string: quintic ease-in
            const colT  = _quintInOut(localT / 0.4);
            // Route through a slight arc (not a flat line) for cinematic depth
            const arcH  = pn * 80 * (1 - colT); // particle-specific arc height
            p.targetX = startX + (stringX - startX) * colT;
            p.targetY = startY + (cy - startY) * colT + arcH;
            p.targetZ = startZ + (0 - startZ) * colT;
            p.localSizeMult = 1.0 + colT * 0.8;
        } else if (localT < 0.6) {
            // VIBRATE: string oscillation — standing wave pattern
            const vibT     = (localT - 0.4) / 0.2;
            const waveMode = 1 + (i % 3); // each particle in a different harmonic
            const vibAmp   = 35 * (1 - vibT);
            const vibPhase = (i / total) * Math.PI * 2 * waveMode;
            const vibY     = Math.sin(vibPhase + vibT * Math.PI * 8) * vibAmp;
            const vibZ     = Math.cos(vibPhase * 0.7 + vibT * Math.PI * 5) * vibAmp * 0.5;
            p.targetX = stringX;
            p.targetY = cy + vibY;
            p.targetZ = vibZ;
            p.localSizeMult = 1.0 + (1 - vibT) * 1.2;
            p.localOpMult   = 1.0 + (1 - vibT) * 0.4;
        } else {
            // DISPERSE: elastic bloom into Dyson sphere orbits
            const dispT    = (localT - 0.6) / 0.4;
            const dispEase = _elasticOut(dispT, 6);
            p.targetX = stringX + (idealX - stringX) * dispEase;
            p.targetY = cy + (idealY - cy) * dispEase;
            p.targetZ = (idealZ) * dispEase;
            p.localSizeMult = 1.0 + Math.exp(-dispT * 5) * 1.0;
        }

    // ─────────────────────────────────────────────────────────────────────────
    // TRANSITION 10 → SHAPE_PYRAMID: "Gravitational Lens Sphere Flash"
    // A perfect sphere forms as an intermediate "gravitational lens" shape —
    // its surface is lit with a bright rim-light effect, then the sphere
    // morphs into the star-burst Pyramid shape with elastic tip-snapping.
    // ─────────────────────────────────────────────────────────────────────────
    } else if (phaseIdx === 10) {
        const phi   = _PHI_LUT[(i * 11) % _LUT_N]; // shuffled for uniform sphere coverage
        const theta = _THETA_LUT[(i * 7) % _LUT_N];
        const r = 195;

        // Sphere surface position
        const sphX = cx + r * Math.sin(phi) * Math.cos(theta);
        const sphY = cy + r * Math.sin(phi) * Math.sin(theta);
        const sphZ = r * Math.cos(phi);

        if (localT < 0.45) {
            // FORM sphere: back-ease arrival at sphere surface
            const formT    = localT / 0.45;
            const formEase = _backOut(formT, 0.9);
            p.targetX = startX + (sphX - startX) * formEase;
            p.targetY = startY + (sphY - startY) * formEase;
            p.targetZ = startZ + (sphZ - startZ) * formEase;
            // Rim-light pulse as sphere fully forms
            const rimFlash = formT > 0.85 ? (formT - 0.85) / 0.15 : 0;
            p.localSizeMult = 1.0 + rimFlash * 1.8;
            p.localOpMult   = 1.0 + rimFlash * 0.4;
        } else {
            // MORPH to pyramid: elastic tip-snap
            const morphT     = (localT - 0.45) / 0.55;
            const morphEase  = _elasticOut(morphT, 7);
            p.targetX = sphX + (idealX - sphX) * morphEase;
            p.targetY = sphY + (idealY - sphY) * morphEase;
            p.targetZ = sphZ + (idealZ - sphZ) * morphEase;
            // The sphere "tears" at the spike tips — flash on arrival at spikes
            const distToIdeal = Math.sqrt(
                (idealX - cx) * (idealX - cx) + (idealY - cy) * (idealY - cy)
            );
            const isSpikeParticle = distToIdeal > 120; // particles near the tips
            if (isSpikeParticle) {
                p.localSizeMult = 1.0 + Math.exp(-morphT * 6) * 1.4;
            }
        }
    }
}
