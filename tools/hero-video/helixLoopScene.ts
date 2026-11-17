/**
 * Offline render scene for the Hero helix video: the sculpture in its editorial pose (axis from
 * the far top-right to the near bottom-left), lit by the studio environment, driven by a phase
 * in [0, 1) instead of a clock. Every motion term is periodic in that phase (an exact full turn
 * about the helix axis plus sine sways with whole-number frequencies), so frame N equals frame 0
 * and the encoded clip loops without a seam.
 */
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import { buildHelixMesh, HELIX_VIDEO } from './helixGeometry';
import { createHelixMaterial, createStudioEnvironment } from './helixMaterials';

export interface LoopSceneOptions {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  /** Fraction of the frame's width and height the sculpture may fill at rest (its safe area). */
  safeWidth: number;
  safeHeight: number;
}

export interface LoopScene {
  /** Draws the frame at `phase` ∈ [0, 1) of the loop. */
  renderPhase(phase: number): void;
  dispose(): void;
}

/** Resting pose: the axis runs from the far top-right to the near bottom-left. */
const BASE_ROLL = -0.6;
const BASE_TILT = -0.32;
const CAMERA_FOV = 42;
/** Perspective sway over one loop (radians) and vertical float (fraction of the view height). */
const SWAY_YAW = 0.1;
const SWAY_PITCH = 0.05;
const FLOAT = 0.01;
const TAU = Math.PI * 2;

export function createLoopScene({ canvas, width, height, safeWidth, safeHeight }: LoopSceneOptions): LoopScene {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new Scene();
  const camera = new PerspectiveCamera(CAMERA_FOV, width / height, 0.5, 60);

  const mesh = buildHelixMesh(HELIX_VIDEO);
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(mesh.positions, 3));
  geometry.setAttribute('normal', new BufferAttribute(mesh.normals, 3));
  geometry.setIndex(new BufferAttribute(mesh.indices, 1));
  const envMap = createStudioEnvironment(renderer);
  const material = createHelixMaterial(envMap);
  const helix = new Mesh(geometry, material);
  helix.frustumCulled = false;

  const spinner = new Group();
  spinner.add(helix);
  const base = new Group();
  base.quaternion
    .setFromAxisAngle(new Vector3(0, 0, 1), BASE_ROLL)
    .multiply(new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), BASE_TILT));
  base.add(spinner);
  const rig = new Group();
  rig.add(base);
  scene.add(rig);

  const key = new DirectionalLight(0xf2f9fc, 2.0);
  key.position.set(-4, 6, 5);
  const rim = new DirectionalLight(0x4fd6e8, 2.2);
  rim.position.set(5, 2, -5);
  const ambient = new HemisphereLight(0xdcecf4, 0x0a2a33, 0.35);
  scene.add(key, rim, ambient);

  // Fit the rest pose into the safe area: the smallest camera distance at which every sampled
  // vertex projects inside it.
  const tanHalf = Math.tan((CAMERA_FOV * Math.PI) / 360);
  let distance = 0;
  const p = new Vector3();
  for (let i = 0; i < mesh.positions.length; i += 12 * 3) {
    p.set(mesh.positions[i], mesh.positions[i + 1], mesh.positions[i + 2]).applyQuaternion(base.quaternion);
    const need = Math.max(
      Math.abs(p.x) / (camera.aspect * tanHalf * safeWidth),
      Math.abs(p.y) / (tanHalf * safeHeight)
    );
    distance = Math.max(distance, p.z + need);
  }
  camera.position.set(0, 0, distance);
  const viewHalfHeight = distance * tanHalf;

  return {
    renderPhase(phase) {
      const a = TAU * phase;
      rig.rotation.set(SWAY_PITCH * Math.sin(2 * a + 1.0), SWAY_YAW * Math.sin(a), 0);
      rig.position.set(0, FLOAT * viewHalfHeight * Math.sin(a + 2.0), 0);
      spinner.rotation.y = a;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      envMap.dispose();
      renderer.dispose();
    },
  };
}
