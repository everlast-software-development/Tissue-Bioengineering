import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles, Dna, Layers, Activity, Eye } from 'lucide-react';

interface CinematicTissueAnimation3DProps {
  className?: string;
  onSceneChange?: (sceneIndex: number) => void;
}

export const SCENES_INFO = [
  {
    id: 1,
    name: 'DNA Double Helix',
    desc: 'Panoramic 3D bioluminescent genetic code rotating horizontally across full width',
    icon: Dna,
    range: [0.0, 0.16],
  },
  {
    id: 2,
    name: 'Particle Disassembly',
    desc: 'Camera moves through DNA disassembling into glowing bio-particles',
    icon: Sparkles,
    range: [0.16, 0.33],
  },
  {
    id: 3,
    name: 'Biomaterial ECM Scaffold',
    desc: '3D porous collagen nanofiber architecture & hydrogel texture matrix',
    icon: Layers,
    range: [0.33, 0.5],
  },
  {
    id: 4,
    name: 'Cell Seeding & Fibroblasts',
    desc: 'Stem cell attachment, migrating fibroblasts & collagen synthesis',
    icon: Activity,
    range: [0.5, 0.67],
  },
  {
    id: 5,
    name: 'Engineered Skin Tissue',
    desc: 'Stratified dermal layers, collagen ECM & micro-capillary vascularization',
    icon: Layers,
    range: [0.67, 0.83],
  },
  {
    id: 6,
    name: 'Return to DNA Loop',
    desc: 'Biological particles dissolve back to initial rotating DNA state',
    icon: RotateCcw,
    range: [0.83, 1.0],
  },
];

const CYCLE_DURATION = 14.0; // 14-second seamless cycle

export const CinematicTissueAnimation3D: React.FC<CinematicTissueAnimation3DProps> = ({
  className = '',
  onSceneChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [cycleProgress, setCycleProgress] = useState(0);
  const [fps, setFps] = useState(60);

  const isPlayingRef = useRef(true);
  const manualSeekRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Main Three.js Scene Setup & Loop Animation
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b1f3a, 0.01);

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const aspect = width / height;
    const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 1000);
    // Position camera to capture full-width panoramic edge-to-edge view
    camera.position.set(0, 0, aspect < 1 ? 36 : 28);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    // 2. Volumetric & Direct Lighting Environment
    const ambientLight = new THREE.AmbientLight(0x0b1f3a, 2.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(30, 40, 30);
    scene.add(dirLight1);

    const cyanPointLight = new THREE.PointLight(0x38bdf8, 5.0, 70);
    cyanPointLight.position.set(0, 4, 14);
    scene.add(cyanPointLight);

    const whitePointLight = new THREE.PointLight(0xf8fafc, 4.0, 55);
    whitePointLight.position.set(-22, 14, -14);
    scene.add(whitePointLight);

    // 3. High Precision Glow Particle Texture
    const createParticleTexture = (): THREE.CanvasTexture => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d')!;
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(56, 189, 248, 0.85)');
      grad.addColorStop(0.7, 'rgba(14, 165, 233, 0.3)');
      grad.addColorStop(1, 'rgba(11, 31, 58, 0)');
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 32, 0, Math.PI * 2);
      pCtx.fill();
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();

    // 4. Create Morphing Particle System (3,200 High-Density Particles for Panoramic View)
    const PARTICLE_COUNT = 3200;

    const dnaPositions = new Float32Array(PARTICLE_COUNT * 3);
    const scaffoldPositions = new Float32Array(PARTICLE_COUNT * 3);
    const skinPositions = new Float32Array(PARTICLE_COUNT * 3);
    const currentPositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);

    const colorCyan = new THREE.Color(0x38bdf8);
    const colorWhite = new THREE.Color(0xffffff);
    const colorSky = new THREE.Color(0x7dd3fc);

    // Generate Panoramic Edge-to-Edge DNA Double Helix Positions (Scene 1 & 6 Target)
    const helixWidth = 46; // Stretches wide horizontally across 100% viewport width
    const helixRadius = 5.2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const strand = i % 2 === 0 ? 0 : Math.PI;
      const pct = i / PARTICLE_COUNT;

      // X position spans panoramic width from -23 to +23
      const x = (pct - 0.5) * helixWidth;
      const angle = pct * Math.PI * 14 + strand;

      // Gentle vertical wave along the panoramic helix
      const waveY = Math.sin(pct * Math.PI * 3) * 2.2;

      const isBasePair = i % 8 === 0;
      let y: number, z: number;

      if (isBasePair) {
        const lerpFactor = ((i % 16) / 16) * 2 - 1;
        y = waveY + Math.sin(angle) * helixRadius * lerpFactor;
        z = Math.cos(angle) * helixRadius * lerpFactor;
      } else {
        const rNoise = (Math.random() - 0.5) * 0.6;
        y = waveY + Math.sin(angle) * (helixRadius + rNoise);
        z = Math.cos(angle) * (helixRadius + rNoise);
      }

      dnaPositions[i * 3] = x;
      dnaPositions[i * 3 + 1] = y;
      dnaPositions[i * 3 + 2] = z;

      const mixCol = Math.random() > 0.4 ? colorCyan : Math.random() > 0.5 ? colorWhite : colorSky;
      particleColors[i * 3] = mixCol.r;
      particleColors[i * 3 + 1] = mixCol.g;
      particleColors[i * 3 + 2] = mixCol.b;
    }

    // Generate Panoramic Porous ECM Scaffold Positions (Scene 3 Target)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const gx = Math.floor((Math.random() - 0.5) * 8); // Extended X width
      const gy = Math.floor((Math.random() - 0.5) * 4);
      const gz = Math.floor((Math.random() - 0.5) * 4);

      const poreRadius = 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const px = gx * 4.2 + Math.sin(phi) * Math.cos(theta) * poreRadius;
      const py = gy * 3.2 + Math.sin(phi) * Math.sin(theta) * poreRadius;
      const pz = gz * 3.2 + Math.cos(phi) * poreRadius;

      scaffoldPositions[i * 3] = px;
      scaffoldPositions[i * 3 + 1] = py;
      scaffoldPositions[i * 3 + 2] = pz;
    }

    // Generate Panoramic Multi-layered Skin Tissue Positions (Scene 5 Target)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const u = (Math.random() - 0.5) * 42; // Panoramic 42-unit X width
      const v = (Math.random() - 0.5) * 16;
      const layer = i % 3;
      const layerY = layer * 2.2 - 2.0;

      const waveZ = Math.sin(u * 0.3) * Math.cos(v * 0.3) * 1.2;

      skinPositions[i * 3] = u;
      skinPositions[i * 3 + 1] = layerY + Math.sin(u * 0.6) * 0.6;
      skinPositions[i * 3 + 2] = v + waveZ;
    }

    // Particle Geometry Setup
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.52,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
      opacity: 0.92,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 5. Stem Cells & Fibroblasts Group (Scene 4)
    const cellsGroup = new THREE.Group();
    scene.add(cellsGroup);

    const cellMeshList: THREE.Mesh[] = [];
    const cellCount = 42;
    const cellGeo = new THREE.SphereGeometry(0.75, 32, 32);

    const stemCellMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.65,
      thickness: 1.2,
      clearcoat: 1.0,
      transparent: true,
      opacity: 0.85,
    });

    for (let c = 0; c < cellCount; c++) {
      const mesh = new THREE.Mesh(cellGeo, stemCellMat.clone());
      const angle = (c / cellCount) * Math.PI * 2;
      const radiusX = 14 + Math.random() * 8; // Extended panoramic radius
      mesh.position.set(
        Math.cos(angle) * radiusX,
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * 6
      );
      mesh.scale.setScalar(0.6 + Math.random() * 0.75);
      cellsGroup.add(mesh);
      cellMeshList.push(mesh);
    }

    // 6. Panoramic Solid ECM Collagen Lattice Mesh (Scene 3 & 4)
    const ecmGroup = new THREE.Group();
    scene.add(ecmGroup);

    const ecmGeo = new THREE.IcosahedronGeometry(10.5, 3);
    const ecmMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
    });
    const ecmMesh = new THREE.Mesh(ecmGeo, ecmMat);
    ecmGroup.add(ecmMesh);

    // 7. Micro-Capillary Vascular Network (Scene 5)
    const capillaryGroup = new THREE.Group();
    scene.add(capillaryGroup);

    for (let b = 0; b < 14; b++) {
      const pathPoints: THREE.Vector3[] = [];
      let currentPt = new THREE.Vector3((Math.random() - 0.5) * 36, -4, (Math.random() - 0.5) * 10);
      pathPoints.push(currentPt.clone());
      for (let pt = 0; pt < 6; pt++) {
        currentPt = currentPt
          .clone()
          .add(
            new THREE.Vector3(
              (Math.random() - 0.5) * 5,
              Math.random() * 1.8 + 0.4,
              (Math.random() - 0.5) * 3
            )
          );
        pathPoints.push(currentPt);
      }

      const curve = new THREE.CatmullRomCurve3(pathPoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.12, 8, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.0,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      capillaryGroup.add(tubeMesh);
    }

    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // 8. Main Render Loop (60 FPS Seamless Cycle)
    let accumulatedTime = 0;
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const renderLoop = () => {
      const now = performance.now();
      const delta = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      frameCount++;
      if (now - fpsTimer >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
        frameCount = 0;
        fpsTimer = now;
      }

      if (isPlayingRef.current) {
        accumulatedTime += delta;
      }

      if (manualSeekRef.current !== null) {
        accumulatedTime = manualSeekRef.current * CYCLE_DURATION;
        manualSeekRef.current = null;
      }

      const cycleTime = accumulatedTime % CYCLE_DURATION;
      const progress = cycleTime / CYCLE_DURATION; // 0.0 to 1.0
      setCycleProgress(progress);

      let activeIdx = 0;
      for (let i = 0; i < SCENES_INFO.length; i++) {
        const [rMin, rMax] = SCENES_INFO[i].range;
        if (progress >= rMin && progress < rMax) {
          activeIdx = i;
          break;
        }
      }
      setCurrentSceneIndex(activeIdx);
      if (onSceneChange) onSceneChange(activeIdx);

      // Phase Interpolation Math
      let morphFactorDNA = 0;
      let morphFactorScaffold = 0;
      let morphFactorSkin = 0;
      let explodeFactor = 0;

      if (progress < 0.16) {
        // Scene 1: DNA Double Helix
        morphFactorDNA = 1.0;
      } else if (progress >= 0.16 && progress < 0.33) {
        // Scene 2: DNA Disassembly into Scaffold
        const t = smoothstep(0.16, 0.33, progress);
        morphFactorDNA = 1.0 - t;
        morphFactorScaffold = t;
        explodeFactor = Math.sin(t * Math.PI) * 4.5;
      } else if (progress >= 0.33 && progress < 0.5) {
        // Scene 3: ECM Scaffold Formation
        morphFactorScaffold = 1.0;
      } else if (progress >= 0.5 && progress < 0.67) {
        // Scene 4: Cell Seeding & Fibroblasts morphing into Skin
        const t = smoothstep(0.5, 0.67, progress);
        morphFactorScaffold = 1.0 - t;
        morphFactorSkin = t;
      } else if (progress >= 0.67 && progress < 0.83) {
        // Scene 5: Engineered Living Skin Tissue
        morphFactorSkin = 1.0;
      } else {
        // Scene 6: Dissolution of Skin returning to DNA Helix (Infinite Loop)
        const t = smoothstep(0.83, 1.0, progress);
        morphFactorSkin = 1.0 - t;
        morphFactorDNA = t;
        explodeFactor = Math.sin(t * Math.PI) * 4.8;
      }

      // Smooth Panoramic 360 Rotation Angle (Targeting 100% matching at 0.0 and 1.0)
      const rotationAngle = progress * Math.PI * 4;
      particleSystem.rotation.y = rotationAngle * 0.6;
      particleSystem.rotation.x = Math.sin(progress * Math.PI * 2) * 0.1;
      particleSystem.rotation.z = Math.cos(progress * Math.PI * 2) * 0.08;

      ecmGroup.rotation.y = rotationAngle * 0.5;
      cellsGroup.rotation.y = rotationAngle * 0.8;
      capillaryGroup.rotation.y = rotationAngle * 0.4;

      // Update Buffer Position
      const posAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;

        const dnaX = dnaPositions[i3];
        const dnaY = dnaPositions[i3 + 1];
        const dnaZ = dnaPositions[i3 + 2];

        const scaX = scaffoldPositions[i3];
        const scaY = scaffoldPositions[i3 + 1];
        const scaZ = scaffoldPositions[i3 + 2];

        const skiX = skinPositions[i3];
        const skiY = skinPositions[i3 + 1];
        const skiZ = skinPositions[i3 + 2];

        let targetX = dnaX * morphFactorDNA + scaX * morphFactorScaffold + skiX * morphFactorSkin;
        let targetY = dnaY * morphFactorDNA + scaY * morphFactorScaffold + skiY * morphFactorSkin;
        let targetZ = dnaZ * morphFactorDNA + scaZ * morphFactorScaffold + skiZ * morphFactorSkin;

        if (explodeFactor > 0.01) {
          targetX += (Math.sin(i * 99 + cycleTime) - 0.5) * explodeFactor;
          targetY += (Math.cos(i * 33 + cycleTime) - 0.5) * explodeFactor;
          targetZ += (Math.sin(i * 12 + cycleTime) - 0.5) * explodeFactor;
        }

        posArr[i3] = targetX;
        posArr[i3 + 1] = targetY;
        posArr[i3 + 2] = targetZ;
      }
      posAttr.needsUpdate = true;

      // Visibility Control
      const ecmOpacity = smoothstep(0.25, 0.35, progress) * (1.0 - smoothstep(0.62, 0.72, progress));
      ecmMat.opacity = ecmOpacity * 0.45;

      const cellOpacity = smoothstep(0.45, 0.52, progress) * (1.0 - smoothstep(0.66, 0.74, progress));
      cellMeshList.forEach((cell, idx) => {
        const mat = cell.material as THREE.MeshPhysicalMaterial;
        mat.opacity = cellOpacity * 0.85;
      });

      const skinCapillaryOpacity =
        smoothstep(0.64, 0.7, progress) * (1.0 - smoothstep(0.82, 0.88, progress));
      capillaryGroup.children.forEach((child) => {
        const m = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = skinCapillaryOpacity * 0.8;
      });

      // Camera Orbiting & Dolly Motion
      const cameraDolly = Math.sin(progress * Math.PI * 2) * 2.0;
      const currentAspect = container.clientWidth / container.clientHeight;
      camera.position.z = (currentAspect < 1 ? 36 : 28) + cameraDolly;
      camera.position.y = Math.sin(progress * Math.PI * 4) * 1.2;
      camera.lookAt(0, 0, 0);

      cyanPointLight.intensity = 4.5 + Math.sin(cycleTime * 3) * 1.5;
      whitePointLight.intensity = 3.5 + Math.cos(cycleTime * 2) * 1.0;

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      width = container.clientWidth;
      height = container.clientHeight;
      const newAspect = width / height;
      camera.aspect = newAspect;
      camera.position.z = newAspect < 1 ? 36 : 28;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      ecmGeo.dispose();
      ecmMat.dispose();
      cellGeo.dispose();
      stemCellMat.dispose();
    };
  }, [onSceneChange]);

  const handleSeekScene = (sceneIndex: number) => {
    const targetRange = SCENES_INFO[sceneIndex].range;
    manualSeekRef.current = targetRange[0] + 0.01;
    setCurrentSceneIndex(sceneIndex);
  };

  return (
    <div className={`relative w-full h-full min-h-screen overflow-hidden select-none ${className}`}>
      {/* 3D WebGL Canvas - 100% Full-Width Edge-to-Edge Panoramic Cover */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full block pointer-events-auto object-cover object-center"
        />
      </div>

      {/* Dark Navy Radial Vignette Overlay preserving Central Negative Space */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, rgba(11, 31, 58, 0.40) 0%, rgba(11, 31, 58, 0.76) 65%, rgba(11, 31, 58, 0.94) 100%)',
        }}
      />

      {/* Scientific Grid Overlay */}
      <div className="absolute inset-0 z-10 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* 6-Scene Interactive Scientific HUD Timeline */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-5xl px-4 sm:px-6">
        <div className="bg-[#0B1F3A]/85 backdrop-blur-xl border border-sky-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl">
          {/* Header Controls Bar */}
          <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500" />
              </span>
              <span className="font-semibold text-white tracking-wide uppercase text-[11px] sm:text-xs">
                3D CGI Medical Visualization • 4K UHD
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-sky-200 text-xs font-mono">
                <Eye className="w-3.5 h-3.5 text-sky-400" /> {fps} FPS
              </span>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-100 font-medium transition-all text-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Loop' : 'Resume Loop'}</span>
              </button>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="relative w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-cyan-400 to-blue-400 transition-all duration-100"
              style={{ width: `${cycleProgress * 100}%` }}
            />
          </div>

          {/* 6 Stage Navigation Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2">
            {SCENES_INFO.map((scene, idx) => {
              const Icon = scene.icon;
              const isActive = currentSceneIndex === idx;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSeekScene(idx)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-500/25 border-sky-400 text-white shadow-lg shadow-sky-500/20 scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-300' : 'text-slate-400'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      S{scene.id}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold line-clamp-1 leading-tight">
                    {scene.name.split(' ')[0]} {scene.name.split(' ')[1] || ''}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Scene Description Subtext */}
          <div className="mt-2 text-center text-[11px] text-sky-200/80 font-normal truncate">
            <span className="font-bold text-sky-400">
              Stage {currentSceneIndex + 1}: {SCENES_INFO[currentSceneIndex].name}
            </span>{' '}
            — {SCENES_INFO[currentSceneIndex].desc}
          </div>
        </div>
      </div>
    </div>
  );
};
