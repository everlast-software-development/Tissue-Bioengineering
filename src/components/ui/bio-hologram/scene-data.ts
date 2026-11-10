/**
 * Geometry for the bio hologram, as instanced "glow segments" (A, B, radius, intensity, colour,
 * reveal start), cells and particles. Everything is seeded, so the composition is identical on
 * every load. Helices are rebuilt every frame (they twist and bob); the rest is static.
 *
 * Segment layout (SEG_STRIDE floats): ax ay az  bx by bz  radius intensity reveal  r g b
 */
import { CONFIG } from './config';

export const SEG_STRIDE = 12;

export const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type V3 = [number, number, number];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a: V3) => Math.hypot(a[0], a[1], a[2]);
const norm = (a: V3): V3 => scale(a, 1 / (len(a) || 1));
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** Growable segment writer. */
export class Segments {
  data: Float32Array;
  count = 0;
  constructor(capacity: number) {
    this.data = new Float32Array(capacity * SEG_STRIDE);
  }
  reset() {
    this.count = 0;
  }
  push(a: V3, b: V3, radius: number, intensity: number, reveal: number, colour: V3) {
    if ((this.count + 1) * SEG_STRIDE > this.data.length) {
      const d = new Float32Array(this.data.length * 2);
      d.set(this.data);
      this.data = d;
    }
    this.data.set([a[0], a[1], a[2], b[0], b[1], b[2], radius, intensity, reveal, colour[0], colour[1], colour[2]], this.count * SEG_STRIDE);
    this.count++;
  }
}

export interface Cell {
  c: V3;
  r: number;
  membrane: V3;
  tint: number;
  seed: number;
  reveal: number;
}

export interface Particle {
  p: V3;
  size: number;
  colour: V3;
  phase: number;
  speed: number;
}

/* ── Scaffold basket + neuron-like web (static, in scaffold space) ─────── */

export function buildStatic(lowPower: boolean) {
  const S = CONFIG.scaffold, Wb = CONFIG.web;
  const rand = mulberry32(CONFIG.seed);
  const seg = new Segments(4096);
  const col = hex(S.colour), rim = hex(S.rimColour), web = hex(Wb.colour);
  const C = S.centre as unknown as V3;
  const nSeg = lowPower ? CONFIG.mobile.ringSegments : S.ringSegments;
  const nVert = lowPower ? CONFIG.mobile.verticals : S.verticals;
  const yMin = C[1] - S.ringDrop * (S.rings - 1) - S.stemLength, yMax = C[1] + S.postHeight;
  // Entrance: the basket builds from the stem upwards, sweeping around.
  const revealAt = (p: V3, theta: number) => 0.02 + 0.32 * ((p[1] - yMin) / (yMax - yMin)) + 0.06 * (theta / (Math.PI * 2)) + 0.03 * rand();

  const ringPoint = (k: number, theta: number): V3 => {
    const r = S.topRadius * (1 - S.ringShrink * k ** 1.15) * (1 + 0.025 * Math.sin(3 * theta + k * 1.7));
    const y = C[1] - S.ringDrop * k ** 1.08 + 0.02 * Math.sin(5 * theta + k);
    return [C[0] + r * Math.cos(theta), y, C[2] + r * Math.sin(theta)];
  };

  // Rings.
  for (let k = 0; k < S.rings; k++) {
    for (let i = 0; i < nSeg; i++) {
      const t0 = (i / nSeg) * Math.PI * 2, t1 = ((i + 1) / nSeg) * Math.PI * 2;
      const a = ringPoint(k, t0), b = ringPoint(k, t1);
      seg.push(a, b, S.strutRadius * (k === 0 ? 1.15 : 1 - k * 0.12), S.intensity * (k === 0 ? 1.1 : 1), revealAt(a, t0), k === 0 ? rim : col);
    }
  }
  // Verticals, braces, posts and a top rail above the rim.
  const posts: V3[] = [];
  for (let j = 0; j < nVert; j++) {
    const th = (j / nVert) * Math.PI * 2 + 0.07;
    for (let k = 0; k < S.rings - 1; k++) {
      const a = ringPoint(k, th + k * 0.04), b = ringPoint(k + 1, th + (k + 1) * 0.04);
      seg.push(a, b, S.strutRadius * 0.85, S.intensity, revealAt(b, th), col);
      if (rand() < S.braceChance) {
        const th2 = th + (Math.PI * 2) / nVert;
        const c2 = ringPoint(k + 1, th2 + (k + 1) * 0.04);
        seg.push(a, c2, S.braceRadius, S.intensity * 0.7, revealAt(c2, th), col);
      }
    }
    // Inward spokes from the lowest ring towards the stem.
    const low = ringPoint(S.rings - 1, th + (S.rings - 1) * 0.04);
    const hub: V3 = [C[0], C[1] - S.ringDrop * (S.rings - 1) - 0.12, C[2]];
    if (j % 2 === 0) seg.push(low, lerp3(low, hub, 0.85), S.braceRadius, S.intensity * 0.7, revealAt(low, th), col);
    if (j % 2 === 0) {
      const top = ringPoint(0, th);
      const p: V3 = [top[0], top[1] + S.postHeight * (0.7 + 0.5 * rand()), top[2]];
      seg.push(top, p, S.strutRadius * 0.8, S.intensity * 1.1, revealAt(p, th), rim);
      posts.push(p);
    }
  }
  for (let i = 0; i < posts.length; i++) {
    const a = posts[i], b = posts[(i + 1) % posts.length];
    const mid: V3 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 0.05, (a[2] + b[2]) / 2];
    seg.push(a, mid, S.braceRadius * 1.2, S.intensity, revealAt(a, i), rim);
    seg.push(mid, b, S.braceRadius * 1.2, S.intensity, revealAt(b, i), rim);
  }
  // Stem: two twisted strands down out of the view.
  const stemTop: V3 = [C[0], C[1] - S.ringDrop * (S.rings - 1) - 0.12, C[2]];
  for (let s = 0; s < 2; s++)
    for (let i = 0; i < 10; i++) {
      const f0 = i / 10, f1 = (i + 1) / 10;
      const p0: V3 = [stemTop[0] + 0.05 * Math.cos(f0 * 6 + s * Math.PI), stemTop[1] - f0 * S.stemLength, stemTop[2] + 0.05 * Math.sin(f0 * 6 + s * Math.PI)];
      const p1: V3 = [stemTop[0] + 0.05 * Math.cos(f1 * 6 + s * Math.PI), stemTop[1] - f1 * S.stemLength, stemTop[2] + 0.05 * Math.sin(f1 * 6 + s * Math.PI)];
      seg.push(p0, p1, S.strutRadius * 0.9, S.intensity * (1 - f0 * 0.7), 0.02 + 0.04 * (1 - f0), col);
    }

  // Neuron-like web inside the basket: somas joined by thin curved fibres.
  const nSoma = lowPower ? CONFIG.mobile.somas : Wb.somas;
  const somas: V3[] = [];
  for (let i = 0; i < nSoma; i++) {
    const a = rand() * Math.PI * 2, r = Math.sqrt(rand()) * S.topRadius * 0.78;
    somas.push([C[0] + r * Math.cos(a), C[1] - 0.05 - rand() * S.ringDrop * (S.rings - 1.2), C[2] + r * Math.sin(a)]);
  }
  for (let i = 0; i < somas.length; i++) {
    const near = somas
      .map((p, j) => ({ j, d: len(sub(p, somas[i])) }))
      .filter((e) => e.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2 + Math.floor(rand() * 2));
    for (const { j } of near) {
      if (j < i && rand() < 0.5) continue;
      const a = somas[i], b = somas[j];
      const bow: V3 = [(rand() - 0.5) * 0.3, (rand() - 0.2) * 0.25, (rand() - 0.5) * 0.3];
      let prev = a;
      for (let k = 1; k <= 8; k++) {
        const f = k / 8;
        const p = add(lerp3(a, b, f), scale(bow, Math.sin(Math.PI * f)));
        seg.push(prev, p, Wb.fibreRadius, Wb.intensity, 0.3 + 0.12 * f + 0.05 * rand(), web);
        prev = p;
      }
    }
    // A few short dendrites.
    for (let k = 0; k < 3; k++) {
      const d: V3 = norm([rand() - 0.5, rand() - 0.3, rand() - 0.5]);
      let prev = somas[i];
      for (let q = 1; q <= 4; q++) {
        const p = add(somas[i], add(scale(d, q * 0.06), [0, Math.sin(q) * 0.015, 0]));
        seg.push(prev, p, Wb.fibreRadius * 0.8, Wb.intensity * (1 - q * 0.18), 0.34 + 0.04 * q, web);
        prev = p;
      }
    }
  }

  const cells: Cell[] = CONFIG.cells.large.map((e, i) => ({
    c: e.c as unknown as V3,
    r: e.r,
    membrane: hex(e.membrane),
    tint: e.tint,
    seed: rand() * 10 + i,
    reveal: 0.42 + 0.06 * i,
  }));
  for (const s of somas) cells.push({ c: s, r: 0.045 + rand() * 0.02, membrane: hex('#b48cff'), tint: 3, seed: rand() * 10, reveal: 0.36 + 0.1 * rand() });

  const P = CONFIG.particles;
  const nPart = lowPower ? CONFIG.mobile.particles : P.count;
  const particles: Particle[] = [];
  for (let i = 0; i < nPart; i++) {
    const lo = P.box[0], hi = P.box[1];
    particles.push({
      p: [lo[0] + (hi[0] - lo[0]) * rand(), lo[1] + (hi[1] - lo[1]) * rand(), lo[2] + (hi[2] - lo[2]) * rand()],
      size: 1 + rand() * rand() * 3,
      colour: hex(P.colours[Math.floor(rand() * P.colours.length)]),
      phase: rand() * Math.PI * 2,
      speed: 0.6 + rand() * 0.8,
    });
  }
  return { segments: seg, cells, particles };
}

/* ── DNA double helices (rebuilt every frame) ──────────────────────────── */

export type HelixDef = (typeof CONFIG.helices.list)[number];

/**
 * Writes one helix: two backbones (offset by ~0.7π, so major and minor grooves read) and base-pair
 * rungs split in two colours. `phase` spins it about its own axis; `pulse` (0…1 along, or <0) adds
 * a bright band travelling up it. Reveal starts run from base to tip, so the entrance "zips" it up.
 */
export function writeHelix(seg: Segments, h: HelixDef, phase: number, bobY: number, pulse: number, revealFrom: number) {
  const H = CONFIG.helices;
  const strandC = hex(H.strandColour), glowC = hex(H.strandGlow);
  const rungCs = H.rungColours.map(hex);
  const base = add(h.base as unknown as V3, [0, bobY, 0]);
  const dir = norm(h.dir as unknown as V3), bend = h.bend as unknown as V3;
  const axis = (s: number): V3 => add(add(base, scale(dir, s * h.length)), scale(bend, s * s));
  const tangent = (s: number) => norm(add(scale(dir, h.length), scale(bend, 2 * s)));
  const up: V3 = Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
  const frame = (s: number) => {
    const T = tangent(s);
    const N = norm(cross(up, T));
    return { N, B: cross(T, N) };
  };
  const strandPoint = (s: number, k: number): V3 => {
    const { N, B } = frame(s);
    const a = h.turns * Math.PI * 2 * s + phase + k * Math.PI * 0.72;
    return add(axis(s), add(scale(N, Math.cos(a) * h.radius), scale(B, Math.sin(a) * h.radius)));
  };
  const fade = (s: number) => (h.main ? Math.min(1, s * 8, (1 - s) * 5) : Math.min(1, s * 5, (1 - s) * 5));
  const pulseGain = (s: number) => (pulse < 0 ? 1 : 1 + H.pulse.gain * Math.exp(-(((s - pulse) / H.pulse.width) ** 2)));
  const reveal = (s: number) => revealFrom + 0.42 * s;

  const n = Math.ceil(h.turns * H.samplesPerTurn);
  for (let k = 0; k < 2; k++) {
    let prev = strandPoint(0, k);
    for (let i = 1; i <= n; i++) {
      const s = i / n;
      const p = strandPoint(s, k);
      // Strands facing the camera read brighter (a cheap sense of the twist).
      const facing = 0.75 + 0.25 * Math.cos(h.turns * Math.PI * 2 * s + phase + k * Math.PI * 0.72);
      seg.push(prev, p, h.strand, h.intensity * fade(s) * facing * pulseGain(s), reveal(s), k === 0 ? strandC : glowC);
      prev = p;
    }
  }
  const nr = Math.ceil(h.turns * H.rungsPerTurn);
  for (let i = 1; i < nr; i++) {
    const s = i / nr;
    const a = strandPoint(s, 0), b = strandPoint(s, 1);
    const m = lerp3(a, b, 0.5);
    const c0 = rungCs[i % rungCs.length], c1 = rungCs[(i * 7 + 1) % rungCs.length];
    const g = h.intensity * 0.8 * fade(s) * pulseGain(s);
    seg.push(a, m, h.rung, g, reveal(s) + 0.04, c0);
    seg.push(m, b, h.rung, g, reveal(s) + 0.04, c1);
  }
}

export const helixSegmentCount = (h: HelixDef) =>
  2 * Math.ceil(h.turns * CONFIG.helices.samplesPerTurn) + 2 * Math.ceil(h.turns * CONFIG.helices.rungsPerTurn);
