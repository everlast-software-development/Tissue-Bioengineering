/**
 * Procedural generation of the hydrogel-composite scaffold. Pure and deterministic (seeded), no
 * three.js, so it can run in a Web Worker. Output is plain typed arrays, one merged buffer per
 * material.
 *
 *   1. Volume   — the camera frustum swept over every drift / tilt pose, plus a margin.
 *   2. Nodes    — Poisson-disk samples with noise-driven spacing (denser and closer on the focal side).
 *   3. Struts   — 3-nearest-neighbour graph, ~8 % dropped; bowed, tapered tubes with junction spheres.
 *   4. AO       — per-vertex occlusion from a hash grid of strut centre-lines, baked into colours.
 *   5. Fibres   — two counter-wound collagen helices per strut, plus loose fibres across the pores.
 *   6. Cells    — spindle cells on strut surfaces, rounded cells in open pores; membrane + nucleus.
 */
import { CONFIG } from './config';
import { TAN_HALF_FOV, copyWeight, focusNdc, frontDistance, lerp, smoothstep } from './layout';

export interface GenerateOptions {
  /** Viewport aspect (width / height). */
  aspect: number;
  /** Aspect the lateral coverage is generated for (≥ aspect). */
  coverageAspect: number;
  /** Stacked (mobile) layout: copy at the bottom, focus at the top. */
  stacked: boolean;
  /** Coarse pointer / small screen: fewer struts, fibres and cells, lighter tubes. */
  lowPower: boolean;
}

export interface MeshData {
  position: Float32Array;
  /** Point the vertex moves with (strut centre-line / junction centre), so the probe moves struts rigidly. */
  anchor: Float32Array;
  normal: Float32Array;
  color: Float32Array;
  index: Uint32Array;
}

export interface CellData {
  count: number;
  /** Column-major 4×4 per instance. */
  membrane: Float32Array;
  nucleus: Float32Array;
  /** Index into CONFIG.cells.membraneColors. */
  palette: Uint8Array;
  phase: Float32Array;
}

export interface ScaffoldData {
  struts: MeshData;
  fibres: MeshData;
  cells: CellData;
  /** Object-space point the entrance grows out of. */
  focus: [number, number, number];
  /** Largest distance from the focus to any node, for the reveal. */
  revealRadius: number;
  stats: Record<string, number>;
}

const S = CONFIG.struts;
const F = CONFIG.fibres;
const CE = CONFIG.cells;
const AO = CONFIG.ao;
const CAM = CONFIG.camera.distance;
/** Spacing of the AO occluder samples along each strut centre-line. */
const OCC_STEP = 0.06;
const AO_FOG_CUTOFF = 6.3;

/* ── Seeded randomness and smooth noise ─────────────────────────────────── */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lattice(ix: number, iy: number, iz: number, s: number) {
  let h = Math.imul(ix, 0x27d4eb2d) ^ Math.imul(iy, 0x165667b1) ^ Math.imul(iz, 0x9e3779b1) ^ s;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function noise3(x: number, y: number, z: number, s: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const u = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const v = fy * fy * fy * (fy * (fy * 6 - 15) + 10);
  const w = fz * fz * fz * (fz * (fz * 6 - 15) + 10);
  const c = (dx: number, dy: number, dz: number) => lattice(ix + dx, iy + dy, iz + dz, s);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u), x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u), x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}

/** Two-octave value noise, roughly 0.15…0.85. */
const fbm = (x: number, y: number, z: number, s: number) =>
  0.65 * noise3(x, y, z, s) + 0.35 * noise3(x * 2.1 + 5.2, y * 2.1 + 1.3, z * 2.1 + 7.7, s ^ 0x9e37);

/* ── Growable typed buffers ─────────────────────────────────────────────── */

class F32 {
  a = new Float32Array(4096);
  n = 0;
  push3(x: number, y: number, z: number) {
    if (this.n + 3 > this.a.length) this.grow();
    this.a[this.n++] = x;
    this.a[this.n++] = y;
    this.a[this.n++] = z;
  }
  push(x: number) {
    if (this.n + 1 > this.a.length) this.grow();
    this.a[this.n++] = x;
  }
  private grow() {
    const b = new Float32Array(this.a.length * 2);
    b.set(this.a);
    this.a = b;
  }
  done() {
    return this.a.slice(0, this.n);
  }
}

class U32 {
  a = new Uint32Array(8192);
  n = 0;
  push3(x: number, y: number, z: number) {
    if (this.n + 3 > this.a.length) {
      const b = new Uint32Array(this.a.length * 2);
      b.set(this.a);
      this.a = b;
    }
    this.a[this.n++] = x;
    this.a[this.n++] = y;
    this.a[this.n++] = z;
  }
  done() {
    return this.a.slice(0, this.n);
  }
}

class MeshBuilder {
  pos = new F32();
  anc = new F32();
  nor = new F32();
  col = new F32();
  idx = new U32();
  get vertices() {
    return this.pos.n / 3;
  }
  vertex(x: number, y: number, z: number, nx: number, ny: number, nz: number, ao: number, ax: number, ay: number, az: number) {
    this.pos.push3(x, y, z);
    this.anc.push3(ax, ay, az);
    this.nor.push3(nx, ny, nz);
    this.col.push3(ao, ao, ao);
  }
  /** Indices joining `rings` consecutive rings of `radial` vertices (no seam duplicate). */
  rings(base: number, rings: number, radial: number) {
    for (let i = 0; i < rings - 1; i++) {
      for (let j = 0; j < radial; j++) {
        const j1 = (j + 1) % radial;
        const a = base + i * radial + j, b = base + i * radial + j1;
        const c = a + radial, d = b + radial;
        this.idx.push3(a, b, c);
        this.idx.push3(b, d, c);
      }
    }
  }
  done(): MeshData {
    return { position: this.pos.done(), anchor: this.anc.done(), normal: this.nor.done(), color: this.col.done(), index: this.idx.done() };
  }
}

/* ── Uniform hash grid over a box (linked lists in typed arrays) ─────────── */

class Grid {
  readonly head: Int32Array;
  next = new Int32Array(4096);
  readonly nx: number;
  readonly ny: number;
  readonly nz: number;
  constructor(
    readonly min: number[],
    max: number[],
    readonly cell: number,
  ) {
    this.nx = Math.max(1, Math.ceil((max[0] - min[0]) / cell) + 1);
    this.ny = Math.max(1, Math.ceil((max[1] - min[1]) / cell) + 1);
    this.nz = Math.max(1, Math.ceil((max[2] - min[2]) / cell) + 1);
    this.head = new Int32Array(this.nx * this.ny * this.nz).fill(-1);
  }
  private c(v: number, axis: 0 | 1 | 2, n: number) {
    return Math.min(n - 1, Math.max(0, Math.floor((v - this.min[axis]) / this.cell)));
  }
  cellIndex(v: number, axis: 0 | 1 | 2) {
    return this.c(v, axis, axis === 0 ? this.nx : axis === 1 ? this.ny : this.nz);
  }
  insert(i: number, x: number, y: number, z: number) {
    if (i >= this.next.length) {
      const b = new Int32Array(Math.max(i + 1, this.next.length * 2));
      b.set(this.next);
      this.next = b;
    }
    const k = this.c(x, 0, this.nx) + this.nx * (this.c(y, 1, this.ny) + this.ny * this.c(z, 2, this.nz));
    this.next[i] = this.head[k];
    this.head[k] = i;
  }
  /** Calls fn(i) for every item in the cells overlapping the cube of half-size r around (x, y, z). */
  query(x: number, y: number, z: number, r: number, fn: (i: number) => void) {
    const x0 = this.c(x - r, 0, this.nx), x1 = this.c(x + r, 0, this.nx);
    const y0 = this.c(y - r, 1, this.ny), y1 = this.c(y + r, 1, this.ny);
    const z0 = this.c(z - r, 2, this.nz), z1 = this.c(z + r, 2, this.nz);
    for (let cz = z0; cz <= z1; cz++)
      for (let cy = y0; cy <= y1; cy++)
        for (let cx = x0; cx <= x1; cx++)
          for (let i = this.head[cx + this.nx * (cy + this.ny * cz)]; i !== -1; i = this.next[i]) fn(i);
  }
}

/* ── Unit icosphere, for the junction spheres ───────────────────────────── */

function icosphere(detail: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  let v: number[][] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
    [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  let f = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2],
    [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5],
    [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const norm = (p: number[]) => {
    const l = Math.hypot(p[0], p[1], p[2]);
    return [p[0] / l, p[1] / l, p[2] / l];
  };
  v = v.map(norm);
  for (let d = 0; d < detail; d++) {
    const mid = new Map<string, number>();
    const m = (a: number, b: number) => {
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      let i = mid.get(key);
      if (i === undefined) {
        i = v.length;
        v.push(norm([(v[a][0] + v[b][0]) / 2, (v[a][1] + v[b][1]) / 2, (v[a][2] + v[b][2]) / 2]));
        mid.set(key, i);
      }
      return i;
    };
    const nf: number[][] = [];
    for (const [a, b, c] of f) {
      const ab = m(a, b), bc = m(b, c), ca = m(c, a);
      nf.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    f = nf;
  }
  return { v, f };
}

/* ── Generation ─────────────────────────────────────────────────────────── */

export function generateScaffold(o: GenerateOptions): ScaffoldData {
  const t0 = performance.now();
  const rand = mulberry32(CONFIG.seed);
  const range = (a: number, b: number) => a + (b - a) * rand();
  const countScale = o.lowPower ? CONFIG.mobile.countScale : 1;
  const densityMul = 1 / Math.cbrt(countScale); // spacing × this ⇒ node count × countScale

  const tanY = TAN_HALF_FOV;
  const tanXa = tanY * o.aspect;
  const tanXc = tanY * o.coverageAspect;
  const V = CONFIG.volume;
  const M = CONFIG.motion;

  /* 1. The swept volume ---------------------------------------------------- */
  // Poses at the extremes of pointer tilt (+ idle drift), matching the scene's
  // group.rotation (Euler XYZ ⇒ R = Rx(pitch)·Ry(yaw)) and group.position.
  const yawMax = M.tiltYaw + M.driftYaw;
  const pitchMax = M.tiltPitch + M.driftPitch;
  const poses: { r: number[]; tx: number; ty: number }[] = [];
  for (const px of [-1, 0, 1])
    for (const py of [-1, 0, 1]) {
      const a = -py * pitchMax, b = px * yawMax;
      const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      poses.push({
        r: [cb, 0, sb, sa * sb, ca, -sa * cb, -ca * sb, sa, ca * cb], // row-major
        tx: px * M.tiltTranslate,
        ty: py * M.tiltTranslate,
      });
    }

  const visibleInSomePose = (x: number, y: number, z: number) => {
    for (const { r, tx, ty } of poses) {
      const wx = r[0] * x + r[1] * y + r[2] * z + tx;
      const wy = r[3] * x + r[4] * y + r[5] * z + ty;
      const wz = r[6] * x + r[7] * y + r[8] * z;
      const d = CAM - wz;
      if (d < 0.5) continue;
      if (Math.abs(wx) <= d * tanXc + V.margin && Math.abs(wy) <= d * tanY + V.margin) return true;
    }
    return false;
  };

  /** Resting-camera distance and NDC of an object-space point. */
  const baseView = (x: number, y: number, z: number) => {
    const d = CAM - z;
    return { d, nx: x / (d * tanXa), ny: y / (d * tanY) };
  };

  const inVolume = (x: number, y: number, z: number) => {
    const { d, nx, ny } = baseView(x, y, z);
    if (d > V.back) return false;
    const jitter = V.frontJitter * (fbm(x * 0.9 + 3.1, y * 0.9, z * 0.9, 0x51) - 0.5);
    if (d < frontDistance(nx, ny, o.stacked) + jitter) return false;
    return visibleInSomePose(x, y, z);
  };

  // Bounding box: the inverse-posed frustum corners.
  const bmin = [Infinity, Infinity, Infinity], bmax = [-Infinity, -Infinity, -Infinity];
  for (const { r, tx, ty } of poses)
    for (const d of [V.frontNear, V.back])
      for (const sx of [-1, 1])
        for (const sy of [-1, 1]) {
          const wx = sx * (d * tanXc + V.margin) - tx, wy = sy * (d * tanY + V.margin) - ty, wz = CAM - d;
          // p = Rᵀ w
          const p = [
            r[0] * wx + r[3] * wy + r[6] * wz,
            r[1] * wx + r[4] * wy + r[7] * wz,
            r[2] * wx + r[5] * wy + r[8] * wz,
          ];
          for (let k = 0; k < 3; k++) {
            bmin[k] = Math.min(bmin[k], p[k]);
            bmax[k] = Math.max(bmax[k], p[k]);
          }
        }

  /* 2. Nodes: variable-radius Poisson disk (Bridson) ------------------------ */
  const spacingAt = (x: number, y: number, z: number) => {
    const n = smoothstep(0.22, 0.78, fbm(x * 1.15, y * 1.15, z * 1.15, 0x1234));
    const { d, nx, ny } = baseView(x, y, z);
    const side = lerp(S.spacingFocusSide, S.spacingCopySide, copyWeight(nx, ny, o.stacked));
    const far = 1 + S.spacingFarBoost * smoothstep(S.farBoostStart, V.back, d);
    return lerp(S.spacingMin, S.spacingMax, n) * side * far * densityMul;
  };
  const sMaxEff = S.spacingMax * S.spacingCopySide * (1 + S.spacingFarBoost) * densityMul;
  const NX: number[] = [], NY: number[] = [], NZ: number[] = [], NS: number[] = [];
  const nodeGrid = new Grid(bmin, bmax, S.spacingMin * S.spacingFocusSide * densityMul);

  const fits = (x: number, y: number, z: number, s: number) => {
    let ok = true;
    const q = 0.5 * (s + sMaxEff);
    nodeGrid.query(x, y, z, q, (i) => {
      if (!ok) return;
      const dx = NX[i] - x, dy = NY[i] - y, dz = NZ[i] - z;
      const m = 0.5 * (s + NS[i]);
      if (dx * dx + dy * dy + dz * dz < m * m) ok = false;
    });
    return ok;
  };
  const addNode = (x: number, y: number, z: number, s: number) => {
    const i = NX.length;
    NX.push(x);
    NY.push(y);
    NZ.push(z);
    NS.push(s);
    nodeGrid.insert(i, x, y, z);
    return i;
  };

  const active: number[] = [];
  {
    // Seed at the focus, then a few random seeds in case the volume has disconnected corners.
    const fo = focusNdc(o.stacked);
    const d = V.frontNear + 0.9;
    const fx = fo.x * d * tanXa, fy = fo.y * d * tanY, fz = CAM - d;
    active.push(addNode(fx, fy, fz, spacingAt(fx, fy, fz)));
    for (let k = 0, seeds = 0; k < 4000 && seeds < 24; k++) {
      const x = range(bmin[0], bmax[0]), y = range(bmin[1], bmax[1]), z = range(bmin[2], bmax[2]);
      if (!inVolume(x, y, z)) continue;
      const s = spacingAt(x, y, z);
      if (!fits(x, y, z, s)) continue;
      active.push(addNode(x, y, z, s));
      seeds++;
    }
  }
  while (active.length) {
    const ai = Math.floor(rand() * active.length);
    const p = active[ai];
    let placed = false;
    for (let k = 0; k < 22; k++) {
      // Uniform direction, distance in [s, 2s].
      const u = rand() * 2 - 1, phi = rand() * Math.PI * 2, rr = Math.sqrt(1 - u * u);
      const dist = NS[p] * (1 + rand());
      const x = NX[p] + rr * Math.cos(phi) * dist, y = NY[p] + rr * Math.sin(phi) * dist, z = NZ[p] + u * dist;
      if (!inVolume(x, y, z)) continue;
      const s = spacingAt(x, y, z);
      if (!fits(x, y, z, s)) continue;
      active.push(addNode(x, y, z, s));
      placed = true;
      break;
    }
    if (!placed) {
      active[ai] = active[active.length - 1];
      active.pop();
    }
  }
  const nodeCount = NX.length;

  /* 3. Struts: k-nearest graph ---------------------------------------------- */
  const edgeKeys = new Set<number>();
  const EA: number[] = [], EB: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const maxLen = Math.min(S.maxLength * densityMul * (1 + S.spacingFarBoost), 1.75 * NS[i]);
    const best: { j: number; d: number }[] = [];
    nodeGrid.query(NX[i], NY[i], NZ[i], maxLen, (j) => {
      if (j === i) return;
      const d = Math.hypot(NX[j] - NX[i], NY[j] - NY[i], NZ[j] - NZ[i]);
      if (d > maxLen) return;
      best.push({ j, d });
    });
    best.sort((a, b) => a.d - b.d);
    for (let k = 0; k < Math.min(S.neighbours, best.length); k++) {
      const j = best[k].j;
      const key = i < j ? i * nodeCount + j : j * nodeCount + i;
      if (edgeKeys.has(key)) continue;
      edgeKeys.add(key);
      EA.push(Math.min(i, j));
      EB.push(Math.max(i, j));
    }
  }
  // Drop ~8 % so the network reads as trabecular rather than a mesh.
  const keep: number[] = [];
  for (let e = 0; e < EA.length; e++) if (rand() >= S.dropFraction) keep.push(e);

  const strutCount = keep.length;
  const SA = new Int32Array(strutCount), SB = new Int32Array(strutCount);
  const SR = new Float32Array(strutCount); // base radius
  const SU = new Float32Array(strutCount * 3); // unit bow direction (⊥ strut)
  const SW = new Float32Array(strutCount); // bow amplitude
  const SDist = new Float32Array(strutCount); // resting distance of the midpoint
  const nodeR = new Float32Array(nodeCount);
  const incident: number[][] = Array.from({ length: nodeCount }, () => []);
  for (let s = 0; s < strutCount; s++) {
    const e = keep[s];
    const a = EA[e], b = EB[e];
    SA[s] = a;
    SB[s] = b;
    const mx = (NX[a] + NX[b]) / 2, my = (NY[a] + NY[b]) / 2, mz = (NZ[a] + NZ[b]) / 2;
    const thick = smoothstep(0.25, 0.75, 0.75 * fbm(mx * 1.7, my * 1.7, mz * 1.7, 0x77) + 0.25 * rand());
    SR[s] = lerp(S.radiusMin, S.radiusMax, thick);
    const dx = NX[b] - NX[a], dy = NY[b] - NY[a], dz = NZ[b] - NZ[a];
    const len = Math.hypot(dx, dy, dz);
    // Random unit vector perpendicular to the strut.
    let ux = rand() - 0.5, uy = rand() - 0.5, uz = rand() - 0.5;
    const dot = (ux * dx + uy * dy + uz * dz) / (len * len);
    ux -= dx * dot;
    uy -= dy * dot;
    uz -= dz * dot;
    const ul = Math.hypot(ux, uy, uz) || 1;
    SU[s * 3] = ux / ul;
    SU[s * 3 + 1] = uy / ul;
    SU[s * 3 + 2] = uz / ul;
    SW[s] = S.bow * len * range(0.25, 1);
    SDist[s] = CAM - mz;
    incident[a].push(s);
    incident[b].push(s);
  }
  for (let n = 0; n < nodeCount; n++) {
    let r = 0;
    for (const s of incident[n]) r = Math.max(r, SR[s]);
    nodeR[n] = r * S.nodeScale;
  }

  // Centre-line, tangent and radius profile of a strut at parameter t (0 = node A, 1 = node B).
  const P = new Float64Array(3), T = new Float64Array(3);
  const centre = (s: number, t: number) => {
    const a = SA[s], b = SB[s];
    const bow = SW[s] * Math.sin(Math.PI * t), dbow = SW[s] * Math.PI * Math.cos(Math.PI * t);
    const dx = NX[b] - NX[a], dy = NY[b] - NY[a], dz = NZ[b] - NZ[a];
    P[0] = NX[a] + dx * t + SU[s * 3] * bow;
    P[1] = NY[a] + dy * t + SU[s * 3 + 1] * bow;
    P[2] = NZ[a] + dz * t + SU[s * 3 + 2] * bow;
    T[0] = dx + SU[s * 3] * dbow;
    T[1] = dy + SU[s * 3 + 1] * dbow;
    T[2] = dz + SU[s * 3 + 2] * dbow;
    const tl = Math.hypot(T[0], T[1], T[2]);
    T[0] /= tl;
    T[1] /= tl;
    T[2] /= tl;
  };
  const strutLen = (s: number) => Math.hypot(NX[SB[s]] - NX[SA[s]], NY[SB[s]] - NY[SA[s]], NZ[SB[s]] - NZ[SA[s]]);
  const radiusAt = (s: number, t: number, len: number) => {
    const ra = nodeR[SA[s]] * 0.97, rb = nodeR[SB[s]] * 0.97;
    const tc = Math.min(1, Math.max(0, t));
    const taper = SR[s] * (1 - (1 - S.midTaper) * Math.sin(Math.PI * tc));
    // Fillet: the tube flares into the junction sphere, so junctions blend instead of reading as ball-and-stick.
    const fa = Math.exp(-(((tc * len) / (2.2 * ra)) ** 2));
    const fb = Math.exp(-((((1 - tc) * len) / (2.2 * rb)) ** 2));
    let r = taper + Math.max(0, ra - taper) * fa + Math.max(0, rb - taper) * fb;
    // Overshoot past the node: shrink along the sphere so the open end stays inside it.
    if (t < 0) r *= Math.sqrt(Math.max(0.05, 1 - ((-t * len) / (ra / 0.97)) ** 2));
    if (t > 1) r *= Math.sqrt(Math.max(0.05, 1 - (((t - 1) * len) / (rb / 0.97)) ** 2));
    return r;
  };

  /* 4. AO occluders: centre-line samples (id ≥ 0 = strut, −1 = loose fibre) -- */
  const OX = new F32(), OY = new F32(), OZ = new F32(), OR = new F32();
  const OID: number[] = [];
  const occGrid = new Grid(bmin, bmax, AO.radius / 2);
  const addOcc = (x: number, y: number, z: number, r: number, id: number) => {
    const i = OID.length;
    OX.push(x);
    OY.push(y);
    OZ.push(z);
    OR.push(r);
    OID.push(id);
    occGrid.insert(i, x, y, z);
  };
  for (let s = 0; s < strutCount; s++) {
    const len = strutLen(s);
    const n = Math.max(3, Math.ceil(len / OCC_STEP));
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      centre(s, t);
      addOcc(P[0], P[1], P[2], radiusAt(s, t, len), s);
    }
  }

  let excludeA = -1;
  let excludeList: number[] | null = null;
  const R2 = AO.radius * AO.radius;
  const invR = 1 / AO.radius;
  const sampleWeight = OCC_STEP / 0.035 / 0.025;
  /** Occlusion at a surface point: other struts' centre-line samples near a point pushed off the surface. */
  const aoAt = (x: number, y: number, z: number, nx: number, ny: number, nz: number) => {
    const depth = 1 - AO.depthDarkening * smoothstep(4.2, V.back, CAM - z);
    // Mostly fogged out: the occlusion term would not be visible.
    if (CAM - z > AO_FOG_CUTOFF) return 0.82 * depth;
    const sx = x + nx * AO.sampleOffset, sy = y + ny * AO.sampleOffset, sz = z + nz * AO.sampleOffset;
    // Hot loop: walk the grid inline (no per-item callback).
    const g = occGrid, head = g.head, next = g.next, ox = OX.a, oy = OY.a, oz = OZ.a, orr = OR.a;
    const x0 = g.cellIndex(sx - AO.radius, 0), x1 = g.cellIndex(sx + AO.radius, 0);
    const y0 = g.cellIndex(sy - AO.radius, 1), y1 = g.cellIndex(sy + AO.radius, 1);
    const z0 = g.cellIndex(sz - AO.radius, 2), z1 = g.cellIndex(sz + AO.radius, 2);
    let acc = 0;
    for (let cz = z0; cz <= z1; cz++)
      for (let cy = y0; cy <= y1; cy++) {
        const row = g.nx * (cy + g.ny * cz);
        for (let cx = x0; cx <= x1; cx++)
          for (let i = head[cx + row]; i !== -1; i = next[i]) {
            const dx = ox[i] - sx, dy = oy[i] - sy, dz = oz[i] - sz;
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 >= R2) continue;
            const id = OID[i];
            if (id < 0 || id === excludeA) continue;
            if (excludeList !== null && excludeList.indexOf(id) !== -1) continue;
            const w = 1 - Math.sqrt(d2) * invR;
            acc += w * w * orr[i];
          }
      }
    const occ = AO.max * (1 - Math.exp(-acc * sampleWeight * AO.strength * 0.12));
    return (1 - occ) * depth;
  };

  /* 3b. Strut + junction geometry, sorted front-to-back for early depth rejection */
  const struts = new MeshBuilder();
  const order = Array.from({ length: strutCount }, (_, i) => i).sort((a, b) => SDist[a] - SDist[b]);
  const radial = o.lowPower ? CONFIG.mobile.radialSegments : S.radialSegments;
  const sphereNear = icosphere(1), sphereFar = icosphere(1);
  const nodeDone = new Uint8Array(nodeCount);
  const emitNode = (n: number) => {
    if (nodeDone[n]) return;
    nodeDone[n] = 1;
    const sph = CAM - NZ[n] < S.farLodDistance ? sphereNear : sphereFar;
    const base = struts.vertices;
    const r = nodeR[n];
    excludeList = incident[n];
    for (const [ux, uy, uz] of sph.v) {
      const x = NX[n] + ux * r, y = NY[n] + uy * r, z = NZ[n] + uz * r;
      struts.vertex(x, y, z, ux, uy, uz, aoAt(x, y, z, ux, uy, uz), NX[n], NY[n], NZ[n]);
    }
    excludeList = null;
    for (const [a, b, c] of sph.f) struts.idx.push3(base + a, base + b, base + c);
  };
  const ring = new Float64Array(3);
  for (const s of order) {
    emitNode(SA[s]);
    emitNode(SB[s]);
    const len = strutLen(s);
    const rs = SDist[s] < S.farLodDistance ? radial.near : radial.far;
    const ea = (S.overshoot * nodeR[SA[s]]) / len, eb = (S.overshoot * nodeR[SB[s]]) / len;
    const rings = S.lengthSegments + 1;
    const base = struts.vertices;
    const u = [SU[s * 3], SU[s * 3 + 1], SU[s * 3 + 2]];
    excludeA = s;
    for (let i = 0; i < rings; i++) {
      // Cosine spacing: more rings near the ends, where the fillets curve.
      const q = 0.5 - 0.5 * Math.cos((Math.PI * i) / (rings - 1));
      const t = -ea + (1 + ea + eb) * q;
      centre(s, t);
      const r = radiusAt(s, t, len);
      const dt = 0.01;
      const drds = (radiusAt(s, t + dt, len) - radiusAt(s, t - dt, len)) / (2 * dt * len);
      // Frame: n = bow direction made ⊥ to the tangent, b = T × n.
      const ud = u[0] * T[0] + u[1] * T[1] + u[2] * T[2];
      let nx = u[0] - T[0] * ud, ny = u[1] - T[1] * ud, nz = u[2] - T[2] * ud;
      const nl = Math.hypot(nx, ny, nz);
      nx /= nl;
      ny /= nl;
      nz /= nl;
      const bx = T[1] * nz - T[2] * ny, by = T[2] * nx - T[0] * nz, bz = T[0] * ny - T[1] * nx;
      for (let j = 0; j < rs; j++) {
        const th = (j / rs) * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th);
        ring[0] = nx * c + bx * sn;
        ring[1] = ny * c + by * sn;
        ring[2] = nz * c + bz * sn;
        const x = P[0] + ring[0] * r, y = P[1] + ring[1] * r, z = P[2] + ring[2] * r;
        // Tapered tube: the normal tilts against the radius gradient.
        let mx = ring[0] - T[0] * drds, my = ring[1] - T[1] * drds, mz = ring[2] - T[2] * drds;
        const ml = Math.hypot(mx, my, mz);
        mx /= ml;
        my /= ml;
        mz /= ml;
        struts.vertex(x, y, z, mx, my, mz, aoAt(x, y, z, mx, my, mz), P[0], P[1], P[2]);
      }
    }
    excludeA = -1;
    struts.rings(base, rings, rs);
  }

  /* 5. Collagen fibres ------------------------------------------------------- */
  const fibres = new MeshBuilder();
  const fibreRadial = o.lowPower ? CONFIG.mobile.fibreRadialSegments : F.radialSegments;
  /** Tube along an arbitrary path (parallel-transport frames), AO per ring. */
  const tubeAlong = (pts: number[], radius: number, aoRing: number[], anchors: number[] = pts) => {
    const n = pts.length / 3;
    if (n < 2) return;
    const base = fibres.vertices;
    let px = 0, py = 0, pz = 0; // previous normal
    for (let i = 0; i < n; i++) {
      const i0 = Math.max(0, i - 1), i1 = Math.min(n - 1, i + 1);
      let tx = pts[i1 * 3] - pts[i0 * 3], ty = pts[i1 * 3 + 1] - pts[i0 * 3 + 1], tz = pts[i1 * 3 + 2] - pts[i0 * 3 + 2];
      const tl = Math.hypot(tx, ty, tz) || 1;
      tx /= tl;
      ty /= tl;
      tz /= tl;
      if (i === 0) {
        // Any perpendicular to start.
        const ax = Math.abs(tx) < 0.9 ? 1 : 0, ay = ax ? 0 : 1;
        px = ay * tz - 0 * ty;
        py = 0 * tx - ax * tz;
        pz = ax * ty - ay * tx;
      }
      const d = px * tx + py * ty + pz * tz;
      px -= tx * d;
      py -= ty * d;
      pz -= tz * d;
      const pl = Math.hypot(px, py, pz) || 1;
      px /= pl;
      py /= pl;
      pz /= pl;
      const bx = ty * pz - tz * py, by = tz * px - tx * pz, bz = tx * py - ty * px;
      for (let j = 0; j < fibreRadial; j++) {
        const th = (j / fibreRadial) * Math.PI * 2, c = Math.cos(th), s = Math.sin(th);
        const nx = px * c + bx * s, ny = py * c + by * s, nz = pz * c + bz * s;
        fibres.vertex(
          pts[i * 3] + nx * radius, pts[i * 3 + 1] + ny * radius, pts[i * 3 + 2] + nz * radius,
          nx, ny, nz, aoRing[i],
          anchors[i * 3], anchors[i * 3 + 1], anchors[i * 3 + 2],
        );
      }
    }
    fibres.rings(base, n, fibreRadial);
  };

  let helixCount = 0;
  for (const s of order) {
    if (SDist[s] > F.maxDistance || rand() > F.strutChance * countScale) continue;
    const len = strutLen(s);
    const u = [SU[s * 3], SU[s * 3 + 1], SU[s * 3 + 2]];
    for (const dir of [1, -1]) {
      const turns = range(F.turnsMin, F.turnsMax);
      const phi0 = rand() * Math.PI * 2;
      const ta = 0.06 + rand() * 0.05, tb = 0.94 - rand() * 0.05;
      const n = Math.ceil(turns * F.segmentsPerTurn) + 1;
      const pts: number[] = [], ao: number[] = [], anchors: number[] = [];
      excludeA = s;
      for (let i = 0; i < n; i++) {
        const q = i / (n - 1);
        const t = lerp(ta, tb, q);
        centre(s, t);
        const ud = u[0] * T[0] + u[1] * T[1] + u[2] * T[2];
        let nx = u[0] - T[0] * ud, ny = u[1] - T[1] * ud, nz = u[2] - T[2] * ud;
        const nl = Math.hypot(nx, ny, nz);
        nx /= nl;
        ny /= nl;
        nz /= nl;
        const bx = T[1] * nz - T[2] * ny, by = T[2] * nx - T[0] * nz, bz = T[0] * ny - T[1] * nx;
        const ph = phi0 + dir * turns * Math.PI * 2 * q;
        const c = Math.cos(ph), sn = Math.sin(ph);
        const rx = nx * c + bx * sn, ry = ny * c + by * sn, rz = nz * c + bz * sn;
        const r = radiusAt(s, t, len) + F.offset;
        const x = P[0] + rx * r, y = P[1] + ry * r, z = P[2] + rz * r;
        pts.push(x, y, z);
        anchors.push(P[0], P[1], P[2]); // helices move with their strut
        // AO on every other point (filled in below): fibres are thin, the term varies slowly.
        ao.push(i % 2 === 0 || i === n - 1 ? aoAt(x, y, z, rx, ry, rz) : -1);
      }
      excludeA = -1;
      for (let i = 1; i < n - 1; i++) if (ao[i] < 0) ao[i] = 0.5 * (ao[i - 1] + ao[i + 1]);
      tubeAlong(pts, F.radius, ao, anchors);
      helixCount++;
    }
  }

  // Loose fibres: momentum random walks across the pores, deflected off struts.
  const looseTarget = Math.round(F.loose.count * countScale);
  let looseCount = 0;
  const L = F.loose;
  for (let attempt = 0; attempt < looseTarget * 40 && looseCount < looseTarget; attempt++) {
    let x = range(bmin[0], bmax[0]), y = range(bmin[1], bmax[1]), z = range(bmin[2], bmax[2]);
    const bv = baseView(x, y, z);
    if (bv.d > F.maxDistance || Math.abs(bv.nx) > 1.1 || Math.abs(bv.ny) > 1.1 || !inVolume(x, y, z)) continue;
    let clear = true;
    occGrid.query(x, y, z, 0.1, (i) => {
      if (Math.hypot(OX.a[i] - x, OY.a[i] - y, OZ.a[i] - z) < OR.a[i] + 0.03) clear = false;
    });
    if (!clear) continue;
    let dx = rand() - 0.5, dy = rand() - 0.5, dz = rand() - 0.5;
    let dl = Math.hypot(dx, dy, dz);
    dx /= dl;
    dy /= dl;
    dz /= dl;
    const steps = Math.round(range(L.stepsMin, L.stepsMax));
    const pts: number[] = [x, y, z];
    for (let k = 0; k < steps; k++) {
      dx = dx * L.momentum + (rand() - 0.5) * (1 - L.momentum) * 2;
      dy = dy * L.momentum + (rand() - 0.5) * (1 - L.momentum) * 2;
      dz = dz * L.momentum + (rand() - 0.5) * (1 - L.momentum) * 2;
      // Deflect off nearby struts so the fibre drapes around them instead of piercing.
      occGrid.query(x, y, z, 0.08, (i) => {
        if (OID[i] < 0) return;
        const ox = x - OX.a[i], oy = y - OY.a[i], oz = z - OZ.a[i];
        const d = Math.hypot(ox, oy, oz), lim = OR.a[i] + 0.014;
        if (d < lim + 0.02 && d > 1e-6) {
          dx += (ox / d) * 0.5;
          dy += (oy / d) * 0.5;
          dz += (oz / d) * 0.5;
        }
      });
      dl = Math.hypot(dx, dy, dz) || 1;
      dx /= dl;
      dy /= dl;
      dz /= dl;
      x += dx * L.step;
      y += dy * L.step;
      z += dz * L.step;
      if (!inVolume(x, y, z)) break;
      pts.push(x, y, z);
    }
    if (pts.length < 12 * 3) continue;
    const ao: number[] = [];
    for (let i = 0; i < pts.length; i += 3) {
      ao.push(aoAt(pts[i], pts[i + 1], pts[i + 2], 0, 0, 1));
      addOcc(pts[i], pts[i + 1], pts[i + 2], 0.004, -1);
    }
    tubeAlong(pts, range(L.radiusMin, L.radiusMax), ao);
    looseCount++;
  }

  /* 6. Cells ----------------------------------------------------------------- */
  const cellTarget = Math.round(CE.count * countScale);
  const roundedTarget = Math.round(cellTarget * CE.roundedFraction);
  const spindleTarget = cellTarget - roundedTarget;
  const membrane = new F32(), nucleus = new F32();
  const palette: number[] = [], phase: number[] = [];
  const cellGrid = new Grid(bmin, bmax, CE.minSpacing);
  const CX: number[] = [], CY: number[] = [], CZ: number[] = [];
  const cellFits = (x: number, y: number, z: number) => {
    let ok = true;
    cellGrid.query(x, y, z, CE.minSpacing, (i) => {
      if (ok && Math.hypot(CX[i] - x, CY[i] - y, CZ[i] - z) < CE.minSpacing) ok = false;
    });
    return ok;
  };
  const visibleNow = (x: number, y: number, z: number) => {
    const bv = baseView(x, y, z);
    return bv.d < CE.maxDistance && Math.abs(bv.nx) < 1.12 && Math.abs(bv.ny) < 1.12;
  };
  /** Column-major TRS with orthonormal axes X, Y, Z and semi-axes (sx, sy, sz). */
  const pushMatrix = (out: F32, X: number[], Y: number[], Z: number[], s: number[], p: number[]) => {
    out.push3(X[0] * s[0], X[1] * s[0], X[2] * s[0]);
    out.push(0);
    out.push3(Y[0] * s[1], Y[1] * s[1], Y[2] * s[1]);
    out.push(0);
    out.push3(Z[0] * s[2], Z[1] * s[2], Z[2] * s[2]);
    out.push(0);
    out.push3(p[0], p[1], p[2]);
    out.push(1);
  };
  const addCell = (X: number[], Y: number[], Z: number[], s: number[], p: number[]) => {
    const i = CX.length;
    CX.push(p[0]);
    CY.push(p[1]);
    CZ.push(p[2]);
    cellGrid.insert(i, p[0], p[1], p[2]);
    pushMatrix(membrane, X, Y, Z, s, p);
    const k = range(CE.nucleusScale[0], CE.nucleusScale[1]);
    pushMatrix(nucleus, X, Y, Z, [s[0] * k, s[1] * Math.min(0.85, k * 1.2), s[2] * Math.min(0.85, k * 1.25)], p);
    palette.push(Math.floor(rand() * CE.membraneColors.length));
    phase.push(rand() * Math.PI * 2);
  };

  // Spindle cells, flattened onto strut surfaces and aligned with the strut.
  let spindles = 0;
  for (let attempt = 0; attempt < spindleTarget * 30 && spindles < spindleTarget && strutCount; attempt++) {
    const s = Math.floor(rand() * strutCount);
    if (SDist[s] > CE.maxDistance) continue;
    const len = strutLen(s);
    const t = range(0.2, 0.8);
    centre(s, t);
    const th = rand() * Math.PI * 2;
    const u = [SU[s * 3], SU[s * 3 + 1], SU[s * 3 + 2]];
    const ud = u[0] * T[0] + u[1] * T[1] + u[2] * T[2];
    const n0 = [u[0] - T[0] * ud, u[1] - T[1] * ud, u[2] - T[2] * ud];
    const nl = Math.hypot(n0[0], n0[1], n0[2]);
    const nn = [n0[0] / nl, n0[1] / nl, n0[2] / nl];
    const bb = [T[1] * nn[2] - T[2] * nn[1], T[2] * nn[0] - T[0] * nn[2], T[0] * nn[1] - T[1] * nn[0]];
    const Z = [0, 1, 2].map((k) => nn[k] * Math.cos(th) + bb[k] * Math.sin(th));
    const X = [T[0], T[1], T[2]];
    const Y = [Z[1] * X[2] - Z[2] * X[1], Z[2] * X[0] - Z[0] * X[2], Z[0] * X[1] - Z[1] * X[0]];
    const sc = [range(CE.spindle.x[0], CE.spindle.x[1]), range(CE.spindle.y[0], CE.spindle.y[1]), range(CE.spindle.z[0], CE.spindle.z[1])];
    const r = radiusAt(s, t, len);
    const p = [0, 1, 2].map((k) => P[k] + Z[k] * (r + sc[2] * 0.45));
    if (!visibleNow(p[0], p[1], p[2]) || !cellFits(p[0], p[1], p[2])) continue;
    addCell(X, Y, Z, sc, p);
    spindles++;
  }

  // Rounded cells resting in open pores.
  let rounded = 0;
  for (let attempt = 0; attempt < roundedTarget * 300 && rounded < roundedTarget; attempt++) {
    const x = range(bmin[0], bmax[0]), y = range(bmin[1], bmax[1]), z = range(bmin[2], bmax[2]);
    if (!visibleNow(x, y, z) || !inVolume(x, y, z)) continue;
    const r = range(CE.roundedDiameter[0], CE.roundedDiameter[1]) / 2;
    let clear = true;
    occGrid.query(x, y, z, 0.1 + CE.poreClearance, (i) => {
      if (clear && Math.hypot(OX.a[i] - x, OY.a[i] - y, OZ.a[i] - z) - OR.a[i] < CE.poreClearance + r * 0.5) clear = false;
    });
    if (!clear || !cellFits(x, y, z)) continue;
    // Random orthonormal frame.
    let ax = rand() - 0.5, ay = rand() - 0.5, az = rand() - 0.5;
    let al = Math.hypot(ax, ay, az);
    const X = [ax / al, ay / al, az / al];
    ax = rand() - 0.5;
    ay = rand() - 0.5;
    az = rand() - 0.5;
    const d = ax * X[0] + ay * X[1] + az * X[2];
    ax -= X[0] * d;
    ay -= X[1] * d;
    az -= X[2] * d;
    al = Math.hypot(ax, ay, az);
    const Y = [ax / al, ay / al, az / al];
    const Z = [X[1] * Y[2] - X[2] * Y[1], X[2] * Y[0] - X[0] * Y[2], X[0] * Y[1] - X[1] * Y[0]];
    addCell(X, Y, Z, [r * range(1.02, 1.14), r * range(0.9, 1), r * range(0.86, 0.96)], [x, y, z]);
    rounded++;
  }

  /* Reveal origin ------------------------------------------------------------ */
  const fo = focusNdc(o.stacked);
  const fd = V.frontNear + 1.1;
  const focus: [number, number, number] = [fo.x * fd * tanXa, fo.y * fd * tanY, CAM - fd];
  let revealRadius = 0;
  for (let n = 0; n < nodeCount; n++)
    revealRadius = Math.max(revealRadius, Math.hypot(NX[n] - focus[0], NY[n] - focus[1], NZ[n] - focus[2]));

  const strutData = struts.done();
  const fibreData = fibres.done();
  return {
    struts: strutData,
    fibres: fibreData,
    cells: {
      count: CX.length,
      membrane: membrane.done(),
      nucleus: nucleus.done(),
      palette: Uint8Array.from(palette),
      phase: Float32Array.from(phase),
    },
    focus,
    revealRadius: revealRadius + 0.5,
    stats: {
      nodes: nodeCount,
      nodesInView: NX.filter((x, i) => { const b = baseView(x, NY[i], NZ[i]); return Math.abs(b.nx) <= 1 && Math.abs(b.ny) <= 1; }).length,
      struts: strutCount,
      helices: helixCount,
      looseFibres: looseCount,
      spindleCells: spindles,
      roundedCells: rounded,
      strutVertices: strutData.position.length / 3,
      strutTriangles: strutData.index.length / 3,
      fibreVertices: fibreData.position.length / 3,
      fibreTriangles: fibreData.index.length / 3,
      ms: Math.round(performance.now() - t0),
    },
  };
}

/** Every buffer in the result, for a zero-copy postMessage. */
export function transferables(d: ScaffoldData): ArrayBuffer[] {
  const m = (x: MeshData) => [x.position.buffer, x.anchor.buffer, x.normal.buffer, x.color.buffer, x.index.buffer];
  return [...m(d.struts), ...m(d.fibres), d.cells.membrane.buffer, d.cells.nucleus.buffer, d.cells.palette.buffer, d.cells.phase.buffer] as ArrayBuffer[];
}
