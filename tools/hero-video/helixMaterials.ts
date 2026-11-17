/**
 * Material and studio lighting environment for the Hero helix video (helixLoopScene.ts).
 *
 * The look is a polished, icy-white physical material with a clear coat, lit mostly by a small
 * procedural "studio": a dark room with a few bright soft boxes (a broad key, a long ceiling strip
 * for the signature highlight streak, a cyan rim and a faint teal floor bounce) rendered once into
 * a prefiltered environment map. That gives real, controlled reflections in the site palette with
 * no image download and no post-processing.
 */
import {
  BackSide,
  BoxGeometry,
  Color,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PMREMGenerator,
  PlaneGeometry,
  Scene,
  type Texture,
  type WebGLRenderer,
} from 'three';

/* Site palette (tailwind.config.js, `cf`). */
const ACCENT = '#4FD6E8';
const TEAL_DEEP = '#1A7F8E';

interface Panel {
  width: number;
  height: number;
  position: [number, number, number];
  color: string;
  intensity: number;
}

/** Soft boxes around the origin; each faces the sculpture. */
const PANELS: Panel[] = [
  { width: 12, height: 7, position: [-7, 7, 7], color: '#eef6fa', intensity: 3.2 }, // key, upper left front
  { width: 26, height: 1.6, position: [0, 10, 1], color: '#f4fbff', intensity: 4.5 }, // ceiling strip
  { width: 3, height: 14, position: [10, 2, -7], color: ACCENT, intensity: 3.4 }, // cyan rim, back right
  { width: 9, height: 9, position: [9, -1, 8], color: '#9cc6d8', intensity: 0.55 }, // fill, right
  { width: 6, height: 12, position: [-10, 0, -6], color: TEAL_DEEP, intensity: 0.9 }, // teal kick, back left
];

/** Renders the studio once into a PMREM environment map. The caller owns (and disposes) it. */
export function createStudioEnvironment(renderer: WebGLRenderer): Texture {
  const studio = new Scene();
  const disposables: { dispose(): void }[] = [];

  const room = new Mesh(
    new BoxGeometry(40, 40, 40),
    new MeshBasicMaterial({ color: new Color('#070d14'), side: BackSide })
  );
  disposables.push(room.geometry, room.material);
  studio.add(room);

  const floor = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshBasicMaterial({ color: new Color(TEAL_DEEP).multiplyScalar(0.35), side: DoubleSide })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -11;
  disposables.push(floor.geometry, floor.material);
  studio.add(floor);

  for (const p of PANELS) {
    const mesh = new Mesh(
      new PlaneGeometry(p.width, p.height),
      new MeshBasicMaterial({ color: new Color(p.color).multiplyScalar(p.intensity), side: DoubleSide })
    );
    mesh.position.set(...p.position);
    mesh.lookAt(0, 0, 0);
    disposables.push(mesh.geometry, mesh.material);
    studio.add(mesh);
  }

  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(studio, 0.04).texture;
  pmrem.dispose();
  for (const d of disposables) d.dispose();
  return env;
}

export function createHelixMaterial(envMap: Texture): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color('#e2edf2'),
    roughness: 0.26,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
    ior: 1.5,
    specularIntensity: 1,
    envMap,
    envMapIntensity: 1.15,
  });
}
