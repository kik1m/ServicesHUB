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
        // 💥 SUPERNOVA SHOCKWAVE BURST (For Quantum Singularity)
        // Particles violently blast outwards in an expanding spherical wave, then get forcefully sucked back into the singularity.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const blastSpeed = arc * 280;
        const angle = (i / total) * Math.PI * 2 + localT * Math.PI * 4;
        const phi = Math.acos(2 * (i / total) - 1);
        
        const bx = Math.sin(phi) * Math.cos(angle) * blastSpeed;
        const by = Math.cos(phi) * blastSpeed;
        const bz = Math.sin(phi) * Math.sin(angle) * blastSpeed;
        
        p.targetX = currentX + bx;
        p.targetY = currentY + by;
        p.targetZ = currentZ + bz;

    } else if (phaseIdx === 2) {
        // 🌀 TRIPLE-AXIS GYROSPIN (For Chronos Hypersphere)
        // Concentric rings rotating dynamically along horizontal, vertical, and inclined axes.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const ring = i % 3;
        const angle = localT * Math.PI * 6 + (i / total) * Math.PI * 2;
        const R = arc * 180;
        
        let rx = 0, ry = 0, rz = 0;
        if (ring === 0) {
            rx = Math.cos(angle) * R;
            ry = Math.sin(angle) * R;
        } else if (ring === 1) {
            rx = Math.cos(angle) * R;
            rz = Math.sin(angle) * R;
        } else {
            ry = Math.cos(angle) * R;
            rz = Math.sin(angle) * R;
        }
        
        p.targetX = currentX + rx;
        p.targetY = currentY + ry;
        p.targetZ = currentZ + rz;

    } else if (phaseIdx === 3) {
        // 🧊 TRANSITION 3: The 4D Hypercube Fold (For Tesseract)
        // Geometrical, mathematical folding mimicking a 4D tesseract rotating in 3D space.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const foldX = (i % 2 === 0 ? 1 : -1) * arc * 180;
        const foldY = (i % 3 === 0 ? 1 : -1) * arc * 180;
        const foldZ = (i % 4 === 0 ? 1 : -1) * arc * 180;
        
        // Crisp 90-degree rotations
        const rotPhase = Math.floor(localT * 4);
        
        p.targetX = currentX + (rotPhase % 2 === 0 ? foldX : foldY * 0.5);
        p.targetY = currentY + (rotPhase % 2 !== 0 ? foldY : foldZ * 0.5);
        p.targetZ = currentZ + foldZ;

    } else if (phaseIdx === 4) {
        // 💎 SACRED GEOMETRY FRACTAL FOLD (For Stellated Octahedron)
        // Particles expand outwards into 8 distinct pyramid corners before folding back into place.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const corner = i % 8;
        const dirs = [
            [1,1,1], [-1,1,1], [1,-1,1], [-1,-1,1],
            [1,1,-1], [-1,1,-1], [1,-1,-1], [-1,-1,-1]
        ];
        const dir = dirs[corner];
        const dist = arc * 220;
        
        p.targetX = currentX + dir[0] * dist;
        p.targetY = currentY + dir[1] * dist;
        p.targetZ = currentZ + dir[2] * dist;

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
        // 💥 TRANSITION 6: Gamma-Ray Burst (For Pulsar Star / النجم الطارق)
        // Two massive jets shoot upwards and downwards from a collapsing central core.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const isTopJet = i % 2 === 0;
        const jetY = (isTopJet ? 1 : -1) * arc * 500;
        const spiral = localT * Math.PI * 20 + i;
        const radius = arc * 15;
        
        p.targetX = currentX + Math.cos(spiral) * radius;
        p.targetY = currentY + jetY;
        p.targetZ = currentZ + Math.sin(spiral) * radius;

    } else if (phaseIdx === 7) {
        // ⏳ TRANSITION 7: Infinity Loop Splice (For Hourglass)
        // Particles loop rapidly through a central pinch point tracing the figure 8.
        const currentX = startX + (idealX - startX) * ease;
        const currentY = startY + (idealY - startY) * ease;
        const currentZ = startZ + (idealZ - startZ) * ease;
        
        const t3 = (localT * Math.PI * 6) + (i / total) * Math.PI * 2;
        const L_scale = 2 / (3 - Math.cos(2 * t3));
        
        const lx = 150 * L_scale * Math.cos(t3) * arc;
        const ly = 250 * L_scale * Math.sin(2 * t3) * arc;
        
        p.targetX = currentX + lx;
        p.targetY = currentY + ly;
        p.targetZ = currentZ + Math.sin(t3 * 3) * 80 * arc;

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
