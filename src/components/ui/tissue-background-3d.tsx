import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

export const TissueBackground3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // --- Observer for performance ---
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(currentMount);

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    
    // Use the deep biomedical navy background
    scene.background = new THREE.Color('#0b1f3a');
    scene.fog = new THREE.FogExp2('#0b1f3a', 0.03);

    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // optimize pixel ratio
    currentMount.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- Layer 1: Tissue Scaffold ---
    // A wireframe icosahedron to represent porous hydrogel scaffold
    const scaffoldGeo = new THREE.IcosahedronGeometry(7, 2);
    const scaffoldMat = new THREE.MeshBasicMaterial({
      color: 0x075A9C,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const scaffold = new THREE.Mesh(scaffoldGeo, scaffoldMat);
    mainGroup.add(scaffold);

    // --- Layer 2: Cells ---
    const cellCount = 40;
    const cellGeo = new THREE.SphereGeometry(0.3, 16, 16);
    const cellMat = new THREE.MeshPhongMaterial({
      color: 0x1677C8,
      emissive: 0x075A9C,
      emissiveIntensity: 0.2,
      shininess: 90,
      transparent: true,
      opacity: 0.8,
    });
    
    const cellsGroup = new THREE.Group();
    for (let i = 0; i < cellCount; i++) {
      const cell = new THREE.Mesh(cellGeo, cellMat);
      cell.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15
      );
      // Give cells random phase for oscillation
      cell.userData = {
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 0.5,
        baseY: cell.position.y
      };
      cellsGroup.add(cell);
    }
    mainGroup.add(cellsGroup);

    // --- Layer 3: ECM Fibers ---
    const fiberCount = 60;
    const fiberMat = new THREE.LineBasicMaterial({
      color: 0x4DA8C8,
      transparent: true,
      opacity: 0.3,
    });
    
    const fibersGroup = new THREE.Group();
    for (let i = 0; i < fiberCount; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10),
        new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10),
        new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10),
      ]);
      const points = curve.getPoints(20);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geom, fiberMat);
      fibersGroup.add(line);
    }
    mainGroup.add(fibersGroup);

    // --- Layer 4: Biofabrication particles ---
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 25;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Create a circular particle texture programmatically
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(8, 8, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#4DA8C8';
      ctx.fill();
    }
    const texture = new THREE.CanvasTexture(canvas);

    const particlesMat = new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      transparent: true,
      opacity: 0.6,
      alphaTest: 0.1,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particles);

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // --- Animation Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      // Respect visibility (IntersectionObserver)
      if (isVisible) {
        if (!prefersReducedMotion) {
          const elapsedTime = clock.getElapsedTime();

          // Slow 3D rotation of entire scaffold (20-45s equivalent)
          mainGroup.rotation.y = elapsedTime * 0.05;
          mainGroup.rotation.x = elapsedTime * 0.02;

          // Cell movement
          cellsGroup.children.forEach((cell) => {
            const data = cell.userData;
            cell.position.y = data.baseY + Math.sin(elapsedTime * data.speed + data.phase) * 1.5;
            cell.rotation.x = elapsedTime * 0.2;
            cell.rotation.y = elapsedTime * 0.3;
          });
          
          // ECM Fibers gentle undulation
          fibersGroup.rotation.z = Math.sin(elapsedTime * 0.05) * 0.2;

          // Particles drift
          particles.rotation.y = elapsedTime * -0.03;
        }
        
        renderer.render(scene, camera);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // --- Handle Resize ---
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      scaffoldGeo.dispose();
      scaffoldMat.dispose();
      cellGeo.dispose();
      cellMat.dispose();
      fiberMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
    };
  }, [prefersReducedMotion, isVisible]);

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />;
};
