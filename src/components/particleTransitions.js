// 🧬 High-Performance, Zero-Allocation 3D Cinematic Transition Calculus for HUBly
// Completely re-engineered with 11 profoundly diverse, geometrically deep transformation models.
// Whitening/excessive chromatic shift removed to preserve natural, elegant particle colors.

export function updateParticleTransition(p, phaseIdx, i, total, localT, ease, arc, swirlX, swirlY, globalTime, cx, cy) {
    // 💥 The baseline interpolation between the old shape and the new shape
    const startX = p.transStartX;
    const startY = p.transStartY;
    const startZ = p.transStartZ;
    
    const idealX = p.idealX;
    const idealY = p.idealY;
    const idealZ = p.idealZ;

    // Reset modifiers
    p.localSizeMult = 1.0;
    p.localOpMult = 1.0;
    p.chromaticShift = 0; // No whitening, pure colors

    if (phaseIdx === 0) {
        // 🌀 TRANSITION 0: The Orbital Slingshot
        // Particles orbit a massive invisible gravity well before being slung into the new shape.
        const orbitAngle = (i / total) * Math.PI * 2 + localT * Math.PI * 6;
        const orbitRadius = arc * 250;
        
        const ox = Math.cos(orbitAngle) * orbitRadius;
        const oy = Math.sin(orbitAngle) * orbitRadius;
        const oz = Math.sin(orbitAngle * 2) * orbitRadius * 0.5;

        p.targetX = startX + (idealX - startX) * ease + ox;
        p.targetY = startY + (idealY - startY) * ease + oy;
        p.targetZ = startZ + (idealZ - startZ) * ease + oz;

    } else if (phaseIdx === 1) {
        // 🌧️ TRANSITION 1: The Matrix Gravity Drop
        // Particles fall sharply downwards off-screen, then rain down from the top into the new shape.
        let dropY = 0;
        if (localT < 0.5) {
            // First half: drop down aggressively
            const t2 = localT * 2;
            dropY = (t2 * t2 * t2) * 800; // Cubic acceleration
        } else {
            // Second half: fall from above
            const t2 = (localT - 0.5) * 2;
            dropY = -800 + (t2 * t2 * t2) * 800; // Cubic deceleration into place
        }

        p.targetX = startX + (idealX - startX) * ease;
        p.targetY = startY + (idealY - startY) * ease + dropY;
        p.targetZ = startZ + (idealZ - startZ) * ease;

    } else if (phaseIdx === 2) {
        // 🌌 GATHER 1: The Core Singularity Collapse
        // Particles gather and violently fuse into a single microscopic point in the dead center.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        // Intense exponential suction force towards the center
        const suction = Math.pow(arc, 2.5);
        
        p.targetX = currentX + (cx - currentX) * suction;
        p.targetY = currentY + (cy - currentY) * suction;
        p.targetZ = currentZ + (0 - currentZ) * suction;

    } else if (phaseIdx === 3) {
        // 🧊 TRANSITION 3: The 4D Hypercube Fold
        // Geometrical, mathematical folding mimicking a 4D tesseract rotating in 3D space.
        const foldX = (i % 2 === 0 ? 1 : -1) * arc * 180;
        const foldY = (i % 3 === 0 ? 1 : -1) * arc * 180;
        const foldZ = (i % 4 === 0 ? 1 : -1) * arc * 180;
        
        // Crisp 90-degree rotations
        const rotPhase = Math.floor(localT * 4);
        
        p.targetX = startX + (idealX - startX) * ease + (rotPhase % 2 === 0 ? foldX : foldY * 0.5);
        p.targetY = startY + (idealY - startY) * ease + (rotPhase % 2 !== 0 ? foldY : foldZ * 0.5);
        p.targetZ = startZ + (idealZ - startZ) * ease + foldZ;

    } else if (phaseIdx === 4) {
        // 🧬 TRANSITION 4: The Double Helix Weave
        // Particles split into two intertwined DNA strands, twisting around each other.
        const strand = i % 2 === 0 ? 1 : -1;
        const helixY = ((i / total) - 0.5) * 400;
        const helixAngle = localT * Math.PI * 10 + (i / total) * Math.PI * 4;
        
        const hx = Math.cos(helixAngle) * 90 * strand * arc;
        const hz = Math.sin(helixAngle) * 90 * strand * arc;
        const hy = helixY * arc;

        p.targetX = startX + (idealX - startX) * ease + hx;
        p.targetY = startY + (idealY - startY) * ease + hy;
        p.targetZ = startZ + (idealZ - startZ) * ease + hz;

    } else if (phaseIdx === 5) {
        // 💿 GATHER 2: The Dense Rotating Disc Compression
        // Particles crush vertically into a perfectly flat, highly condensed spinning disc.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const discR = Math.sqrt((i % 200) / 200) * 80; // Tightly packed 80px radius
        const discAngle = (i / total) * Math.PI * 12 + localT * Math.PI * 8;
        
        const discX = cx + Math.cos(discAngle) * discR;
        const discY = cy + Math.sin(discAngle) * discR * 0.15; // Flattened perspective
        const discZ = Math.sin(discAngle * 2) * 10;
        
        p.targetX = currentX + (discX - currentX) * arc;
        p.targetY = currentY + (discY - currentY) * arc;
        p.targetZ = currentZ + (discZ - currentZ) * arc;

    } else if (phaseIdx === 6) {
        // 🌊 TRANSITION 6: The Sine-Wave River
        // Particles form a horizontal flowing river, riding complex sine waves smoothly.
        const riverX = ((i / total) - 0.5) * 600;
        // Wavy motion based on their horizontal position and time
        const waveY = Math.sin(riverX * 0.015 + localT * 15) * 140 * arc;
        const waveZ = Math.cos(riverX * 0.015 + localT * 15) * 80 * arc;

        p.targetX = startX + (idealX - startX) * ease + (riverX * arc);
        p.targetY = startY + (idealY - startY) * ease + waveY;
        p.targetZ = startZ + (idealZ - startZ) * ease + waveZ;

    } else if (phaseIdx === 7) {
        // ⬛ TRANSITION 7: The Holographic Grid Snap
        // Particles snap to rigid 3D grid coordinates, creating a digital/holographic restructuring.
        const gridSize = 60;
        
        // Midpoint calculation
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        // Snap to grid tightly at the peak of the arc
        const snapForce = Math.pow(arc, 2);
        const gridX = Math.round(currentX / gridSize) * gridSize;
        const gridY = Math.round(currentY / gridSize) * gridSize;
        const gridZ = Math.round(currentZ / gridSize) * gridSize;

        p.targetX = currentX + (gridX - currentX) * snapForce;
        p.targetY = currentY + (gridY - currentY) * snapForce;
        p.targetZ = currentZ + (gridZ - currentZ) * snapForce;

    } else if (phaseIdx === 8) {
        // 🧊 GATHER 3: The Solid Crystal Fusion
        // Particles lock together to form a highly dense, miniature solid 3D crystal at the center.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        // Pack into a tight 5x5x5 grid cube
        const cubeEdge = 5;
        const idx = i % 125;
        const gridX = (idx % cubeEdge) - (cubeEdge / 2);
        const gridY = Math.floor((idx / cubeEdge) % cubeEdge) - (cubeEdge / 2);
        const gridZ = Math.floor(idx / (cubeEdge * cubeEdge)) - (cubeEdge / 2);
        
        const spacing = 12; // Very dense
        const crystalX = cx + gridX * spacing;
        const crystalY = cy + gridY * spacing;
        const crystalZ = gridZ * spacing;
        
        // Add a slow 3D rotation to the entire crystal during formation
        const rot = localT * Math.PI * 2;
        const cX = Math.cos(rot), sX = Math.sin(rot);
        const dx = crystalX - cx, dy = crystalY - cy, dz = crystalZ;
        
        const finalX = cx + dx * cX - dz * sX;
        const finalY = cy + dy;
        const finalZ = dx * sX + dz * cX;

        // Gather forcefully into the crystal
        const gatherForce = Math.pow(arc, 1.5);
        p.targetX = currentX + (finalX - currentX) * gatherForce;
        p.targetY = currentY + (finalY - currentY) * gatherForce;
        p.targetZ = currentZ + (finalZ - currentZ) * gatherForce;

    } else if (phaseIdx === 9) {
        // 📏 TRANSITION 9: The Quantum Collapse (1D Implosion)
        // Implode perfectly onto a 1D horizontal line, then explode into the new shape.
        const lineX = cx + ((i / total) - 0.5) * 500;
        const lineY = cy;
        const lineZ = 0;

        // Pull toward the line based on arc
        p.targetX = startX + (idealX - startX) * ease + (lineX - (startX + (idealX - startX) * ease)) * arc;
        p.targetY = startY + (idealY - startY) * ease + (lineY - (startY + (idealY - startY) * ease)) * arc;
        p.targetZ = startZ + (idealZ - startZ) * ease + (lineZ - (startZ + (idealZ - startZ) * ease)) * arc;

    } else if (phaseIdx === 10) {
        // 🌍 TRANSITION 10: The Morphing Sphere Shell
        // All particles align into a perfect 3D spherical shell midway through the transition.
        const theta = (i / total) * Math.PI * 2;
        const phi = Math.acos(2 * ((i * 11) % total) / total - 1);
        const r = 200;
        
        const sphereX = r * Math.sin(phi) * Math.cos(theta);
        const sphereY = r * Math.sin(phi) * Math.sin(theta);
        const sphereZ = r * Math.cos(phi);

        // Arc blends them to the perfect sphere at t=0.5
        p.targetX = startX + (idealX - startX) * ease + (cx + sphereX - (startX + (idealX - startX) * ease)) * arc;
        p.targetY = startY + (idealY - startY) * ease + (cy + sphereY - (startY + (idealY - startY) * ease)) * arc;
        p.targetZ = startZ + (idealZ - startZ) * ease + (sphereZ - (startZ + (idealZ - startZ) * ease)) * arc;
    }
}
