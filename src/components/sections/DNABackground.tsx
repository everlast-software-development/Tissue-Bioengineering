import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

const DNAStructure = () => {
  const group = useRef<THREE.Group>(null);
  const numBasePairs = 50;
  
  // Rotate the entire DNA structure
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.2;
      group.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.5;
    }
  });

  const basePairs = useMemo(() => {
    const pairs = [];
    const radius = 2.2;
    const heightSpacing = 0.5;
    const angleSpacing = 0.35;
    
    for (let i = 0; i < numBasePairs; i++) {
      const y = (i - numBasePairs / 2) * heightSpacing;
      const angle = i * angleSpacing;
      
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      
      const vec1 = new THREE.Vector3(x1, y, z1);
      const vec2 = new THREE.Vector3(x2, y, z2);
      
      const dir = new THREE.Vector3().subVectors(vec2, vec1).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      const euler = new THREE.Euler().setFromQuaternion(quaternion);

      pairs.push({
        pos1: [x1, y, z1] as [number, number, number],
        pos2: [x2, y, z2] as [number, number, number],
        center: [0, y, 0] as [number, number, number],
        rotation: [euler.x, euler.y, euler.z] as [number, number, number], 
      });
    }
    return pairs;
  }, []);

  return (
    <group ref={group} position={[2, 0, -2]} scale={[1.2, 1.2, 1.2]}>
      {basePairs.map((pair, i) => (
        <React.Fragment key={i}>
          {/* Backbone 1 */}
          <Sphere position={pair.pos1} args={[0.25, 16, 16]}>
            <meshStandardMaterial color="#0ea5e9" roughness={0.2} metalness={0.8} />
          </Sphere>
          
          {/* Backbone 2 */}
          <Sphere position={pair.pos2} args={[0.25, 16, 16]}>
            <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} />
          </Sphere>
          
          {/* Connecting Rung */}
          <Cylinder position={pair.center} rotation={pair.rotation} args={[0.06, 0.06, 4.4, 8]}>
            <meshStandardMaterial color="#bae6fd" roughness={0.4} metalness={0.4} transparent opacity={0.6} />
          </Cylinder>
        </React.Fragment>
      ))}
    </group>
  );
};

const Particles = () => {
  const points = useRef<THREE.Points>(null);
  const count = 300;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.05;
      points.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 2;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        color="#38bdf8"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

export const DNABackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 16], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#0284c7" />
        <pointLight position={[0, 0, 0]} intensity={1.5} color="#38bdf8" distance={15} />
        <Environment preset="city" />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <DNAStructure />
        </Float>
        
        <Particles />
      </Canvas>
    </div>
  );
};
