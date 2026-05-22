/**
 * 🎬 particleTransitions.js — Cinematic Motion Engine v3
 *
 * PERF v3:
 *  - All LUTs imported from particleGenerators (no duplicate builds)
 *  - _OCTANT_DIRS moved to module-level constant (was allocating per call)
 *  - All easing functions are pure scalars — zero objects, zero arrays
 *  - buildTransitionLUT is now a no-op alias (LUTs built once in generators)
 */

import { _ACOS_LUT, _THETA_LUT, _NOISE_LUT } from './particleGenerators';

const _OCTANT_DIRS = [
    [1,1,1], [-1,1,1], [1,-1,1], [-1,-1,1],
    [1,1,-1], [-1,1,-1], [1,-1,-1], [-1,-1,-1]
];

// ─── Zero-allocation easing functions ────────────────────────────────────────
function _expoOut(t)          { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function _backOut(t, s = 1.70158) { const t1 = t - 1; return t1*t1*((s+1)*t1+s)+1; }
function _quintInOut(t)       { return t < 0.5 ? 16*t*t*t*t*t : 1 - Math.pow(-2*t+2,5)/2; }
function _sinBell(t)          { return Math.sin(t * Math.PI); }
function _elasticOut(t, k = 6) {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -k * t) * Math.sin((t - 0.075) * Math.PI * 2 / 0.4) + 1;
}
function _springSnap(t, a = 0.18) {
    const base    = _quintInOut(Math.min(t, 1));
    const elastic = Math.exp(-t * 8) * Math.sin(t * Math.PI * 5) * a;
    return base + elastic * (1 - base);
}

// ─── No-op (LUTs built by generators) ────────────────────────────────────────
export function buildTransitionLUT(_total) { /* intentional no-op */ }

// ─── Main transition dispatcher ───────────────────────────────────────────────
export function updateParticleTransition(
    p, phaseIdx, i, total, localT, ease, arc,
    _swirlX, _swirlY, _globalTime, cx, cy
) {
    const LUT_N = _THETA_LUT ? _THETA_LUT.length : total;
    const startX = p.transStartX, startY = p.transStartY, startZ = p.transStartZ;
    const idealX = p.idealX,     idealY = p.idealY,     idealZ = p.idealZ;

    const snapEase = _springSnap(localT, 0.18);
    const baseX = startX + (idealX - startX) * snapEase;
    const baseY = startY + (idealY - startY) * snapEase;
    const baseZ = startZ + (idealZ - startZ) * snapEase;

    p.localSizeMult  = 1.0;
    p.localOpMult    = 1.0;
    p.chromaticShift = 0;

    switch (phaseIdx) {

    case 0: { // GLOBE — Orbital Slingshot
        if (localT < 0.5) {
            const phase       = localT * 2;
            const orbitTilt   = (_NOISE_LUT[i % LUT_N] * 0.4 + 0.3) * Math.PI;
            const orbitPhase  = _THETA_LUT[i % LUT_N] + phase * Math.PI * 5;
            const orbitR      = _expoOut(phase) * 260 * (1 - phase * 0.3);
            const ox = Math.cos(orbitPhase) * orbitR;
            const oy = Math.sin(orbitPhase) * orbitR * Math.sin(orbitTilt);
            const oz = Math.sin(orbitPhase) * orbitR * Math.cos(orbitTilt);
            p.targetX = baseX + ox * (1 - snapEase);
            p.targetY = baseY + oy * (1 - snapEase);
            p.targetZ = baseZ + oz * (1 - snapEase);
        } else {
            const phase       = (localT - 0.5) * 2;
            const arrivedEase = _backOut(phase, 1.4);
            const dx = idealX - cx, dz = idealZ;
            const len = Math.sqrt(dx*dx + dz*dz) || 1;
            const swirlStr = (1 - phase) * 18;
            p.targetX = startX + (idealX - startX) * arrivedEase + (-dz/len) * swirlStr * (1 - phase);
            p.targetY = startY + (idealY - startY) * arrivedEase;
            p.targetZ = startZ + (idealZ - startZ) * arrivedEase + ( dx/len) * swirlStr * (1 - phase);
        }
        p.localSizeMult = 1.0 + arc * 0.5;
        break;
    }

    case 1: { // QUANTUM_SINGULARITY — Supernova Shockwave
        const blastSpeed = arc * 280;
        const angle = (i / total) * Math.PI * 2 + localT * Math.PI * 4;
        const phi   = _ACOS_LUT ? _ACOS_LUT[i % LUT_N] : Math.acos(1 - 2 * (i/total));
        p.targetX = baseX + Math.sin(phi) * Math.cos(angle) * blastSpeed;
        p.targetY = baseY + Math.cos(phi) * blastSpeed;
        p.targetZ = baseZ + Math.sin(phi) * Math.sin(angle) * blastSpeed;
        break;
    }

    case 2: { // CHRONOS — Gyroscopic Unwinding
        const ring      = i % 3;
        const ringPhase = [0, 0.18, 0.36][ring];
        const rLocalT   = Math.max(0, Math.min(1, (localT - ringPhase) / (1 - ringPhase)));
        const rEase     = _elasticOut(rLocalT, 6);
        const spinAngle = (i / total) * Math.PI * 2 + rLocalT * Math.PI * [5,-4,6][ring];
        const escapeR   = localT < 0.5
            ? _expoOut(localT * 2) * 200
            : (1 - _expoOut((localT - 0.5) * 2)) * 200 + 10;
        let rx = 0, ry = 0, rz = 0;
        const ca = Math.cos(spinAngle), sa = Math.sin(spinAngle);
        if      (ring === 0) { rx = ca * escapeR; ry = sa * escapeR; }
        else if (ring === 1) { rx = ca * escapeR; rz = sa * escapeR; }
        else                 { ry = ca * escapeR; rz = sa * escapeR; }
        p.targetX = startX + (idealX - startX) * rEase + rx * (1 - rEase) * 0.7;
        p.targetY = startY + (idealY - startY) * rEase + ry * (1 - rEase) * 0.7;
        p.targetZ = startZ + (idealZ - startZ) * rEase + rz * (1 - rEase) * 0.7;
        p.localSizeMult = 1.0 + _sinBell(rLocalT) * 0.4;
        break;
    }

    case 3: { // TESSERACT — 4D Dimensional Fold
        const foldStage = Math.min(3, Math.floor(localT * 4));
        const stageT    = (localT * 4) % 1.0;
        const stageEase = _backOut(stageT, 0.8);
        const axis      = i % 4;
        const sign      = (i % 2 === 0) ? 1 : -1;
        const foldR     = [160, 130, 100, 70][foldStage] * stageEase * sign;
        let fdx = 0, fdy = 0, fdz = 0;
        if      (axis === 0) fdx = foldR;
        else if (axis === 1) fdy = foldR;
        else if (axis === 2) fdz = foldR;
        else { fdx = foldR*0.577; fdy = foldR*0.577; fdz = foldR*0.577; }
        const arr = _quintInOut(localT);
        p.targetX = baseX + fdx * (1 - arr);
        p.targetY = baseY + fdy * (1 - arr);
        p.targetZ = baseZ + fdz * (1 - arr);
        p.localSizeMult = 1.0 + (1 - stageT) * 0.5 * (foldStage < 3 ? 1 : 0);
        break;
    }

    case 4: { // STELLATED_OCT — Sacred Crystallization
        const dir = _OCTANT_DIRS[i % 8];
        if (localT < 0.45) {
            const pullT   = localT / 0.45;
            const pullE   = _expoOut(pullT);
            const dist    = 200 + Math.abs(_NOISE_LUT ? _NOISE_LUT[i % LUT_N] : 0) * 30;
            p.targetX = baseX + dir[0] * dist * pullE * _sinBell(pullT);
            p.targetY = baseY + dir[1] * dist * pullE * _sinBell(pullT);
            p.targetZ = baseZ + dir[2] * dist * pullE * _sinBell(pullT);
            p.localSizeMult = 1.0 + pullE * 0.6;
        } else {
            const ct = (localT - 0.45) / 0.55;
            const ce = _elasticOut(ct, 7);
            p.targetX = startX + (idealX - startX) * ce;
            p.targetY = startY + (idealY - startY) * ce;
            p.targetZ = startZ + (idealZ - startZ) * ce;
            p.localSizeMult = 1.0 + Math.exp(-ct * 6) * 1.2;
        }
        break;
    }

    case 5: { // TORUS — Accretion Vortex
        if (localT < 0.4) {
            const vt     = localT / 0.4;
            const vE     = _expoOut(vt);
            const theta  = (_THETA_LUT ? _THETA_LUT[i % LUT_N] : 0) + vt * Math.PI * 6;
            const spiralR = (1 - vE) * 220 + 15;
            const vx = cx + Math.cos(theta) * spiralR;
            const vy = cy + Math.sin(theta) * spiralR * 0.2;
            const vz = Math.sin(theta * 2) * spiralR * 0.1;
            p.targetX = startX + (vx - startX) * vE;
            p.targetY = startY + (vy - startY) * vE;
            p.targetZ = startZ + (vz - startZ) * vE;
            p.localSizeMult = 1.0 + vt * 0.3;
        } else {
            const ut = (localT - 0.4) / 0.6;
            const ue = _backOut(ut, 1.2);
            p.targetX = startX + (idealX - startX) * ue;
            p.targetY = startY + (idealY - startY) * ue;
            p.targetZ = startZ + (idealZ - startZ) * ue;
            p.localSizeMult = 1.0 + Math.exp(-ut * 4) * 0.5;
        }
        break;
    }

    case 6: { // PULSAR — Gamma-Ray Jets
        const isTop  = i % 2 === 0;
        const jetSign = isTop ? 1 : -1;
        const pn     = _NOISE_LUT ? _NOISE_LUT[i % LUT_N] : 0;
        if (localT < 0.5) {
            const bT    = localT * 2;
            const bE    = _expoOut(bT);
            const theta = (_THETA_LUT ? _THETA_LUT[i % LUT_N] : 0) + bT * Math.PI * 8;
            const hR    = (1 - bE) * 120 + 5;
            p.targetX = startX + (cx + Math.cos(theta)*hR - startX) * bE;
            p.targetY = startY + (cy + bE*jetSign*60 - startY) * bE;
            p.targetZ = startZ + (Math.sin(theta)*hR - startZ) * bE;
        } else {
            const fT       = (localT - 0.5) * 2;
            const fDelay   = Math.abs(pn) * 0.25;
            const adjFT    = Math.max(0, Math.min(1, (fT - fDelay) / (1 - fDelay)));
            const fE       = _expoOut(adjFT);
            const jetLen   = fE * 440 * jetSign;
            const theta    = (_THETA_LUT ? _THETA_LUT[i % LUT_N] : 0) + fE * Math.PI * 14;
            const hExp     = fE * 20;
            const jx = cx + Math.cos(theta) * hExp;
            const jy = cy + jetLen;
            const jz = Math.sin(theta) * hExp;
            const arrT = _elasticOut(Math.max(0, adjFT - 0.4) / 0.6, 5);
            p.targetX = jx + (idealX - jx) * arrT;
            p.targetY = jy + (idealY - jy) * arrT;
            p.targetZ = jz + (idealZ - jz) * arrT;
            const flash = Math.max(0, 1 - adjFT * 3);
            p.localSizeMult = 1.0 + flash * 2.0;
            p.localOpMult   = 1.0 + flash * 0.5;
        }
        break;
    }

    case 7: { // HOURGLASS — Lemniscate Pinch
        const pn = _NOISE_LUT ? _NOISE_LUT[i % LUT_N] : 0;
        if (localT < 0.5) {
            const pt  = localT * 2;
            const pe  = _quintInOut(pt);
            const t3  = (1 - pt) * Math.PI * 2 * (i / total);
            const Ls  = 2 / (3 - Math.cos(2 * t3));
            const lx2 = 120 * Ls * Math.cos(t3) * (1 - pe);
            const ly2 = 220 * Ls * Math.sin(2 * t3) * (1 - pe);
            p.targetX = startX + (cx - startX) * pe + lx2;
            p.targetY = startY + (cy - startY) * pe + ly2;
            p.targetZ = startZ * (1 - pe) + Math.sin(t3 * 3) * 60 * (1 - pe);
            p.localSizeMult = 1.0 + pe * 1.8;
            p.localOpMult   = 1.0 + pe * 0.5;
        } else {
            const bt    = (localT - 0.5) * 2;
            const be    = _elasticOut(bt, 5);
            p.targetX = cx + (idealX - cx) * be;
            p.targetY = cy + (idealY - cy) * be;
            p.targetZ = idealZ * be;
            const fl = Math.exp(-bt * 5);
            p.localSizeMult = 1.0 + fl * 2.5 + Math.exp(-bt * 2) * 0.4;
            p.localOpMult   = 1.0 + fl * 0.6;
        }
        break;
    }

    case 8: { // MULTIVERSE — Crystal Lattice Explosion
        const shatterIdx = i % 26;
        const s  = Math.sign((_NOISE_LUT ? _NOISE_LUT[i % LUT_N] : 0) + 0.001) || 1;
        const sx2 = (shatterIdx % 3 - 1) || s;
        const sy2 = (Math.floor(shatterIdx / 3) % 3 - 1) || s;
        const sz2 = (Math.floor(shatterIdx / 9) % 3 - 1) || s;
        const sLen = Math.sqrt(sx2*sx2 + sy2*sy2 + sz2*sz2) || 1;
        if (localT < 0.35) {
            const ct = localT / 0.35, ce = _expoOut(ct);
            const idx = i % 125;
            const gx  = (idx % 5 - 2) * 10;
            const gy  = (Math.floor((idx / 5) % 5) - 2) * 10;
            const gz  = (Math.floor(idx / 25) - 2) * 10;
            const rot = ct * Math.PI * 1.5;
            const cr2 = Math.cos(rot), sr2 = Math.sin(rot);
            p.targetX = startX + (cx + gx*cr2 - gz*sr2 - startX) * ce;
            p.targetY = startY + (cy + gy - startY) * ce;
            p.targetZ = startZ + (gx*sr2 + gz*cr2 - startZ) * ce;
            p.localSizeMult = 1.0 + ce * 0.3;
        } else {
            const st   = (localT - 0.35) / 0.65;
            const sd   = _sinBell(st * 0.8) * 280;
            const dx2  = (sx2/sLen)*sd, dy2 = (sy2/sLen)*sd, dz2 = (sz2/sLen)*sd;
            const ae   = Math.max(0, _quintInOut((st - 0.45) / 0.55));
            p.targetX = cx + dx2 + (idealX - (cx+dx2)) * ae;
            p.targetY = cy + dy2 + (idealY - (cy+dy2)) * ae;
            p.targetZ = dz2 + (idealZ - dz2) * ae;
            p.localSizeMult = 1.0 + Math.exp(-st * 4) * 1.5;
        }
        break;
    }

    case 9: { // DYSON_SPHERE — Quantum String Collapse
        const pn      = _NOISE_LUT ? _NOISE_LUT[i % LUT_N] : 0;
        const stringX = cx + ((i / total) - 0.5) * 480;
        if (localT < 0.4) {
            const ct  = _quintInOut(localT / 0.4);
            const arcH = pn * 80 * (1 - ct);
            p.targetX = startX + (stringX - startX) * ct;
            p.targetY = startY + (cy - startY) * ct + arcH;
            p.targetZ = startZ + (-startZ) * ct;
            p.localSizeMult = 1.0 + ct * 0.8;
        } else if (localT < 0.6) {
            const vt    = (localT - 0.4) / 0.2;
            const wMode = 1 + (i % 3);
            const vAmp  = 35 * (1 - vt);
            const vPh   = (i / total) * Math.PI * 2 * wMode;
            p.targetX = stringX;
            p.targetY = cy + Math.sin(vPh + vt * Math.PI * 8) * vAmp;
            p.targetZ = Math.cos(vPh * 0.7 + vt * Math.PI * 5) * vAmp * 0.5;
            p.localSizeMult = 1.0 + (1 - vt) * 1.2;
            p.localOpMult   = 1.0 + (1 - vt) * 0.4;
        } else {
            const dt    = (localT - 0.6) / 0.4;
            const de    = _elasticOut(dt, 6);
            p.targetX = stringX + (idealX - stringX) * de;
            p.targetY = cy + (idealY - cy) * de;
            p.targetZ = idealZ * de;
            p.localSizeMult = 1.0 + Math.exp(-dt * 5) * 1.0;
        }
        break;
    }

    case 10: { // PYRAMID — Gravitational Lens Flash
        const phi   = _ACOS_LUT ? _ACOS_LUT[(i * 11) % LUT_N] : Math.acos(1 - 2*(i/total));
        const theta = _THETA_LUT ? _THETA_LUT[(i * 7) % LUT_N] : 0;
        const rSph  = 195;
        const sphX  = cx + rSph * Math.sin(phi) * Math.cos(theta);
        const sphY  = cy + rSph * Math.sin(phi) * Math.sin(theta);
        const sphZ  = rSph * Math.cos(phi);
        if (localT < 0.45) {
            const ft  = localT / 0.45;
            const fe  = _backOut(ft, 0.9);
            p.targetX = startX + (sphX - startX) * fe;
            p.targetY = startY + (sphY - startY) * fe;
            p.targetZ = startZ + (sphZ - startZ) * fe;
            const rim = ft > 0.85 ? (ft - 0.85) / 0.15 : 0;
            p.localSizeMult = 1.0 + rim * 1.8;
            p.localOpMult   = 1.0 + rim * 0.4;
        } else {
            const mt  = (localT - 0.45) / 0.55;
            const me  = _elasticOut(mt, 7);
            p.targetX = sphX + (idealX - sphX) * me;
            p.targetY = sphY + (idealY - sphY) * me;
            p.targetZ = sphZ + (idealZ - sphZ) * me;
            const dToIdeal = Math.sqrt((idealX-cx)**2 + (idealY-cy)**2);
            if (dToIdeal > 120) p.localSizeMult = 1.0 + Math.exp(-mt * 6) * 1.4;
        }
        break;
    }

    default: { // Fallback — direct spring
        p.targetX = baseX;
        p.targetY = baseY;
        p.targetZ = baseZ;
    }

    } // end switch
}
