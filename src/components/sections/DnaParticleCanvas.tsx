import React, { useEffect, useRef } from 'react';

interface DnaParticleCanvasProps {
  className?: string;
}

interface MigratingStemCell {
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetY: number;
  radius: number;
  speed: number;
  phaseOffset: number;
}

interface ActivatedFibroblast {
  x: number;
  y: number;
  z: number;
  radius: number;
  fiberTargets: { x: number; y: number }[];
}

interface KeratinocyteNode {
  x: number;
  y: number;
  layer: number;
  pulseSpeed: number;
}

interface MolecularParticle {
  x: number;
  y: number;
  z: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
  alpha: number;
}

export const DnaParticleCanvas: React.FC<DnaParticleCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const isMobile = width < 768;

    // 1. Migrating Stem Cells (Chemotaxis toward matrix)
    const stemCells: MigratingStemCell[] = [];
    const stemCount = isMobile ? 8 : 18;
    for (let i = 0; i < stemCount; i++) {
      const startX = (Math.random() - 0.5) * width * 1.1;
      const startY = (Math.random() - 0.5) * height * 1.1;
      stemCells.push({
        x: startX,
        y: startY,
        z: Math.random() * 400 - 200,
        targetX: (Math.random() - 0.5) * width * 0.4,
        targetY: (Math.random() - 0.5) * height * 0.4,
        radius: Math.random() * 8 + 10,
        speed: Math.random() * 0.3 + 0.2,
        phaseOffset: Math.random() * Math.PI * 2,
      });
    }

    // 2. Activated Fibroblasts & Collagen Synthesizing Network
    const fibroblasts: ActivatedFibroblast[] = [];
    const fibroCount = isMobile ? 6 : 14;
    for (let i = 0; i < fibroCount; i++) {
      const fx = (Math.random() - 0.5) * width * 0.7;
      const fy = (Math.random() - 0.5) * height * 0.6;
      const targets = [];
      const targetCount = 3 + Math.floor(Math.random() * 3);
      for (let t = 0; t < targetCount; t++) {
        targets.push({
          x: fx + (Math.random() - 0.5) * 280,
          y: fy + (Math.random() - 0.5) * 240,
        });
      }
      fibroblasts.push({
        x: fx,
        y: fy,
        z: Math.random() * 300 - 150,
        radius: Math.random() * 6 + 7,
        fiberTargets: targets,
      });
    }

    // 3. Keratinocyte Proliferation Layer (Epidermal / Dermal Regeneration)
    const keratinocytes: KeratinocyteNode[] = [];
    const kCount = isMobile ? 12 : 28;
    for (let i = 0; i < kCount; i++) {
      keratinocytes.push({
        x: (Math.random() - 0.5) * width * 0.85,
        y: (Math.random() - 0.5) * height * 0.75,
        layer: Math.floor(Math.random() * 3) + 1,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    // 4. Molecular Floating Bio-Particles
    const particles: MolecularParticle[] = [];
    const pCount = isMobile ? 30 : 75;
    const colors = ['#DCEEFF', '#60A5FA', '#38BDF8', '#93C5FD', '#0EA5E9', '#7DD3FC'];
    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 600 - 300,
        radius: Math.random() * 2.5 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.1,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }

    const LOOP_DURATION = 16; // 16-second seamless loop
    let startTime = performance.now();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const cycleTime = elapsed % LOOP_DURATION;
      const loopProgress = cycleTime / LOOP_DURATION; // 0.0 to 1.0

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 600;

      // Smooth camera macro movement
      const cameraZoom = 1 + Math.sin(loopProgress * Math.PI * 2) * 0.04;

      // --------------------------------------------------------
      // 1. STEM CELL MIGRATION & CHEMOTAXIS STAGE
      // --------------------------------------------------------
      for (let i = 0; i < stemCells.length; i++) {
        const cell = stemCells[i];

        // Smooth migration towards central extracellular matrix
        const migrationT = (Math.sin(loopProgress * Math.PI * 2 + cell.phaseOffset) + 1) / 2;
        const currentX = cell.x + (cell.targetX - cell.x) * migrationT * 0.6;
        const currentY = cell.y + (cell.targetY - cell.y) * migrationT * 0.6;

        const scale = fov / (fov + cell.z);
        const projX = centerX + currentX * scale * cameraZoom;
        const projY = centerY + currentY * scale * cameraZoom;

        const currentRadius = cell.radius * scale * (1 + Math.sin(cycleTime * 2 + i) * 0.15);

        // Soft bioluminescent cell membrane glow
        const membraneGrad = ctx.createRadialGradient(
          projX,
          projY,
          0,
          projX,
          projY,
          currentRadius * 2.4
        );
        membraneGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
        membraneGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.16)');
        membraneGrad.addColorStop(1, 'rgba(11, 31, 58, 0)');

        ctx.beginPath();
        ctx.arc(projX, projY, currentRadius * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = membraneGrad;
        ctx.fill();

        // Stem Cell Nucleus
        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(2, currentRadius * 0.38), 0, Math.PI * 2);
        ctx.fillStyle = '#DCEEFF';
        ctx.shadowBlur = 10 * scale;
        ctx.shadowColor = '#38BDF8';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // --------------------------------------------------------
      // 2. ACTIVATED FIBROBLASTS & COLLAGEN FIBER EXPANSION
      // --------------------------------------------------------
      const collagenGrowthProgress = Math.sin(loopProgress * Math.PI); // 0 -> 1 -> 0

      for (let i = 0; i < fibroblasts.length; i++) {
        const fibro = fibroblasts[i];
        const scale = fov / (fov + fibro.z);
        const projX = centerX + fibro.x * scale * cameraZoom;
        const projY = centerY + fibro.y * scale * cameraZoom;

        // Draw Fibroblast nucleus
        ctx.beginPath();
        ctx.arc(projX, projY, fibro.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#38BDF8';
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = '#60A5FA';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Extend collagen fibers naturally into extracellular matrix (ECM)
        for (let t = 0; t < fibro.fiberTargets.length; t++) {
          const target = fibro.fiberTargets[t];
          const targetProjX = centerX + target.x * scale * cameraZoom;
          const targetProjY = centerY + target.y * scale * cameraZoom;

          const dx = targetProjX - projX;
          const dy = targetProjY - projY;

          const currentEndX = projX + dx * collagenGrowthProgress;
          const currentEndY = projY + dy * collagenGrowthProgress;

          ctx.beginPath();
          ctx.moveTo(projX, projY);
          ctx.quadraticCurveTo(
            (projX + currentEndX) / 2 + Math.sin(cycleTime + i) * 15,
            (projY + currentEndY) / 2 + Math.cos(cycleTime + t) * 15,
            currentEndX,
            currentEndY
          );
          ctx.strokeStyle = `rgba(125, 211, 252, ${0.4 * collagenGrowthProgress})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
      }

      // --------------------------------------------------------
      // 3. KERATINOCYTE PROLIFERATION & CLEAN ANGIOGENESIS NODES
      // --------------------------------------------------------
      for (let i = 0; i < keratinocytes.length; i++) {
        const k = keratinocytes[i];
        const scale = fov / (fov + k.layer * 60);
        const projX = centerX + k.x * scale * cameraZoom;
        const projY = centerY + k.y * scale * cameraZoom;

        const kAlpha = (Math.sin(cycleTime * 1.5 + i) + 1) / 2 * 0.5 + 0.2;

        ctx.beginPath();
        ctx.arc(projX, projY, (4 + k.layer * 2) * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${kAlpha})`;
        ctx.fill();

        // Connect keratinocytes to form structured dermal/epidermal sheet
        for (let j = i + 1; j < keratinocytes.length; j++) {
          const k2 = keratinocytes[j];
          if (k.layer === k2.layer) {
            const proj2X = centerX + k2.x * scale * cameraZoom;
            const proj2Y = centerY + k2.y * scale * cameraZoom;

            const dist = Math.hypot(projX - proj2X, projY - proj2Y);
            if (dist < 140) {
              ctx.beginPath();
              ctx.moveTo(projX, projY);
              ctx.lineTo(proj2X, proj2Y);
              ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 140) * 0.25})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      // --------------------------------------------------------
      // 4. FLOATING MOLECULAR BIOLUMINESCENT PARTICLES
      // --------------------------------------------------------
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;

        const boundW = width * 0.7;
        const boundH = height * 0.7;
        if (pt.x < -boundW) pt.x = boundW;
        if (pt.x > boundW) pt.x = -boundW;
        if (pt.y < -boundH) pt.y = boundH;
        if (pt.y > boundH) pt.y = -boundH;

        const scale = fov / (fov + pt.z);
        const projX = centerX + pt.x * scale * cameraZoom;
        const projY = centerY + pt.y * scale * cameraZoom;

        const pAlpha = pt.alpha * (0.6 + Math.sin(cycleTime * 2.5 + i) * 0.4);

        ctx.beginPath();
        ctx.arc(projX, projY, Math.max(0.8, pt.radius * scale), 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pAlpha;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowColor = pt.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 ${className}`}
    />
  );
};
