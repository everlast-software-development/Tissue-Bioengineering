/**
 * Gyroid lattice maths shared by the shader set-up: the lattice basis (how the lattice is turned
 * relative to the camera) and the pore centres of one period.
 */
import { CONFIG } from './config';
import { copyWeight, focusNdc, frontDistance, viewTan } from './layout';

const GY = CONFIG.gyroid;
export const TAU = Math.PI * 2;
/** Phase per world unit. */
export const LATTICE_K = TAU / GY.period;

/** g = sin x cos y + sin y cos z + sin z cos x, in lattice phase coordinates; g ∈ [-1.5, 1.5]. */
export const gyroid = (x: number, y: number, z: number) =>
  Math.sin(x) * Math.cos(y) + Math.sin(y) * Math.cos(z) + Math.sin(z) * Math.cos(x);

/**
 * Orthonormal lattice-space vectors for the object axes: object +z looks along GY.viewAxis,
 * rolled by GY.roll. Lattice phase q = K·(x·X + y·Y + z·Z).
 */
export function latticeBasis() {
  const [a, b, c] = GY.viewAxis;
  const zl = Math.hypot(a, b, c);
  const Z = [a / zl, b / zl, c / zl];
  const h = Math.abs(Z[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  let X = [h[1] * Z[2] - h[2] * Z[1], h[2] * Z[0] - h[0] * Z[2], h[0] * Z[1] - h[1] * Z[0]];
  const xl = Math.hypot(X[0], X[1], X[2]);
  X = X.map((v) => v / xl);
  let Y = [Z[1] * X[2] - Z[2] * X[1], Z[2] * X[0] - Z[0] * X[2], Z[0] * X[1] - Z[1] * X[0]];
  const cr = Math.cos(GY.roll), sr = Math.sin(GY.roll);
  const X2 = X.map((v, i) => v * cr + Y[i] * sr);
  Y = X.map((v, i) => -v * sr + Y[i] * cr);
  X = X2;
  return { X, Y, Z };
}

/**
 * Pore centres in one period [0, 2π)³: the extrema of g (|g| → 1.5), i.e. the centres of the two
 * interwoven labyrinths. Found numerically (grid search + gradient ascent): 16 per period.
 * Each entry is [qx, qy, qz, sign of g].
 */
export function poreSites(): number[][] {
  const N = 16;
  const val = (a: number, b: number, c: number) => gyroid((a / N) * TAU, (b / N) * TAU, (c / N) * TAU);
  const wrap = (t: number) => ((t % TAU) + TAU) % TAU;
  const sites: number[][] = [];
  for (let a = 0; a < N; a++)
    for (let b = 0; b < N; b++)
      for (let c = 0; c < N; c++) {
        const v = val(a, b, c);
        if (Math.abs(v) < 1.2) continue;
        let isMax = true;
        for (let da = -1; da <= 1 && isMax; da++)
          for (let db = -1; db <= 1 && isMax; db++)
            for (let dc = -1; dc <= 1 && isMax; dc++) {
              if (!da && !db && !dc) continue;
              if (Math.sign(v) * val((a + da + N) % N, (b + db + N) % N, (c + dc + N) % N) > Math.abs(v)) isMax = false;
            }
        if (!isMax) continue;
        let x = (a / N) * TAU, y = (b / N) * TAU, z = (c / N) * TAU;
        const sg = Math.sign(v);
        for (let it = 0; it < 40; it++) {
          const dx = Math.cos(x) * Math.cos(y) - Math.sin(z) * Math.sin(x);
          const dy = Math.cos(y) * Math.cos(z) - Math.sin(x) * Math.sin(y);
          const dz = Math.cos(z) * Math.cos(x) - Math.sin(y) * Math.sin(z);
          x += 0.1 * sg * dx;
          y += 0.1 * sg * dy;
          z += 0.1 * sg * dz;
        }
        const s = [wrap(x), wrap(y), wrap(z), sg];
        if (!sites.some((p) => Math.hypot(p[0] - s[0], p[1] - s[1], p[2] - s[2]) < 0.4)) sites.push(s);
      }
  return sites;
}

/** sRGB hex → linear RGB triple. */
export function hexToLinear(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return [f(((n >> 16) & 255) / 255), f(((n >> 8) & 255) / 255), f((n & 255) / 255)];
}

/** The shader's low-frequency warp (object space → warped object space). */
export const warpOffset = (x: number, y: number, z: number) => {
  const W = GY.warp * GY.period;
  return [
    W * Math.sin(y * 1.3 + z * 0.7 + 0.5),
    W * Math.sin(z * 1.1 + x * 0.6 + 2.1),
    W * Math.sin(x * 1.2 + y * 0.5 + 4.2),
  ];
};

export interface Cell {
  c: number[]; // centre, object space (resting pose)
  r: number;
  axis: number[];
  elongation: number;
  palette: number;
  phase: number;
}

/**
 * A limited, seeded set of cells at pore centres: visible at rest, behind the lattice front, clear of
 * the copy, preferring the focal region, spaced apart. Centres are warp-corrected so they sit in the
 * warped pores the shader draws.
 */
export function selectCells(o: { aspect: number; stacked: boolean; count: number }): Cell[] {
  let seed = 0x5eed7155;
  const rand = () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const CE = CONFIG.cells, V = CONFIG.volume, CAM = CONFIG.camera.distance;
  const { X, Y, Z } = latticeBasis();
  const K = LATTICE_K;
  const sites = poreSites();
  const [tanX, tanY] = viewTan(o.aspect);
  const fo = focusNdc(o.stacked);
  // Lattice-space range covering the visible depth range at rest.
  const ext = [CE.maxDistance * tanX + 1, CE.maxDistance * tanY + 1];
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const x of [-ext[0], ext[0]])
    for (const y of [-ext[1], ext[1]])
      for (const z of [CAM - CE.maxDistance, CAM - V.frontNear])
        for (let a = 0; a < 3; a++) {
          const q = K * (x * X[a] + y * Y[a] + z * Z[a]);
          lo[a] = Math.min(lo[a], q);
          hi[a] = Math.max(hi[a], q);
        }
  const cand: { c: number[]; score: number }[] = [];
  for (let A = Math.floor(lo[0] / TAU); A <= Math.ceil(hi[0] / TAU); A++)
    for (let B = Math.floor(lo[1] / TAU); B <= Math.ceil(hi[1] / TAU); B++)
      for (let C = Math.floor(lo[2] / TAU); C <= Math.ceil(hi[2] / TAU); C++)
        for (const s of sites) {
          const q = [(s[0] + A * TAU) / K, (s[1] + B * TAU) / K, (s[2] + C * TAU) / K];
          let x = X[0] * q[0] + X[1] * q[1] + X[2] * q[2];
          let y = Y[0] * q[0] + Y[1] * q[1] + Y[2] * q[2];
          let z = Z[0] * q[0] + Z[1] * q[1] + Z[2] * q[2];
          const w = warpOffset(x, y, z); // first-order inverse of the warp
          x -= w[0];
          y -= w[1];
          z -= w[2];
          const d = CAM - z;
          if (d > CE.maxDistance) continue;
          const nx = x / (d * tanX), ny = y / (d * tanY);
          if (Math.abs(nx) > 0.92 || Math.abs(ny) > 0.82) continue;
          if (copyWeight(nx, ny, o.stacked) > 0.45) continue; // keep the copy side clear
          if (d < frontDistance(nx, ny, o.stacked) + V.frontFade * 0.6 + CE.minDepthBehindFront) continue;
          cand.push({ c: [x, y, z], score: Math.hypot(nx - fo.x, (ny - fo.y) * 1.3) + 0.3 * Math.abs(d - 4) + 0.7 * rand() });
        }
  cand.sort((a, b) => a.score - b.score);
  const out: Cell[] = [];
  for (const { c } of cand) {
    if (out.length >= o.count) break;
    if (out.some((e) => Math.hypot(e.c[0] - c[0], e.c[1] - c[1], e.c[2] - c[2]) < CE.minSpacing)) continue;
    const a = [rand() - 0.5, rand() - 0.5, rand() - 0.5];
    const al = Math.hypot(a[0], a[1], a[2]);
    out.push({
      c,
      r: CE.radius[0] + (CE.radius[1] - CE.radius[0]) * rand(),
      axis: a.map((v) => v / al),
      elongation: rand() < CE.elongatedFraction ? CE.elongation : 1,
      palette: Math.floor(rand() * CE.membraneColors.length),
      phase: rand() * TAU,
    });
  }
  return out;
}
