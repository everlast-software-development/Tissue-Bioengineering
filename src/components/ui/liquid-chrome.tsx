import * as React from 'react';

export interface LiquidChromeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ground colour behind the liquid. Any CSS colour; `"transparent"` lets the page show through. */
  background?: string;
  /** Blob scale. 1 = the gathered blob spans about 42% of the box's shorter side. */
  size?: number;
  /** How easily the pointer tears the liquid and how far the droplets fly. 0 never splashes. */
  intensity?: number;
  /** Number of loose droplets hidden in the blob, shed on splashes. Capped by the GPU, at most 56. */
  droplets?: number;
  /** Follow the pointer, tear on fast swipes and splash on click or tap. */
  interactive?: boolean;
  /** Wander and splash on its own while nobody is pointing at it (touch devices, card loops). */
  autoplay?: boolean;
  /** Accessible label. The canvas is exposed as one image. */
  label?: string;
}

// Everything is measured in scene units: 1 = the shorter side of the box.
// Sizes below are read off the reference at 720 px: blob 300–400 px across,
// 50-odd loose droplets of 15–35 px after a tear, regathered in about 1.5 s.
const TAU = Math.PI * 2;
const CORE = 11; // big balls that pack into the main blob
const MID = 8; // chunks that tear off as a group
const MAX_DROPLETS = 56;
const STEP = 1 / 120; // physics substep, s
// All idle motion uses whole multiples of 0.1 Hz, so recordings loop every 10 s.
const LOOP = 10;

// Rest spacing between two balls as a share of their summed radii: small
// droplets sink inside the big ones, big ones overlap into one lumpy body.
const PACK = 0.62;
// The core packs tighter, so its summed field stays one smooth dome.
const CORE_PACK = 0.42;
// Metaball kernel: a ball of radius r reaches out to r / sqrt(1 - ISO^(1/3)),
// so neighbours grow a neck before they touch, like mercury.
const ISO = 0.4;
const KERNEL = 1 / Math.sqrt(1 - Math.cbrt(ISO));
// Height squash: 1 = spherical droplets, lower = a flatter, heavier puddle.
const FLAT = 0.6;
// Pointer core radius: liquid parts around it when it moves.
const POKE = 0.035;

// The wander path used when nobody is pointing. t (s), x, y (scene units, y up),
// and an optional tap. One lap is LOOP seconds: drift, stretch, a fast swipe
// that shatters the blob, regather, a drag, a tap, settle.
// prettier-ignore
const WANDER: [number, number, number, number?][] = [
  [0.0, -0.04, 0.0],
  [1.3, -0.01, 0.03],
  [1.9, 0.12, 0.08],
  [2.6, 0.14, 0.02],
  [2.75, -0.16, -0.08],
  [4.2, -0.1, -0.05],
  [5.3, -0.03, -0.08],
  [5.9, 0.15, -0.1],
  [6.5, 0.1, 0.04],
  [6.9, 0.06, 0.05, 1],
  [8.2, 0.0, 0.04],
  [9.2, -0.04, 0.01],
];

/** Pointer position on the wander path at time t (s). Cyclic cubic Hermite. */
function wanderAt(t: number): [number, number] {
  const n = WANDER.length;
  const tt = ((t % LOOP) + LOOP) % LOOP;
  let i = 0;
  while (i < n - 1 && WANDER[i + 1][0] <= tt) i++;
  const key = (j: number) => {
    const w = WANDER[((j % n) + n) % n];
    return { t: w[0] + Math.floor(j / n) * LOOP, x: w[1], y: w[2] };
  };
  const [a, b, c, d] = [key(i - 1), key(i), key(i + 1), key(i + 2)];
  const u = (tt - b.t) / (c.t - b.t);
  // Harmonic-mean tangents (monotone): a fast swipe stops dead on its key
  // instead of overshooting into the slow stretch after it.
  const tan = (p: typeof a, q: typeof a, r: typeof a, k: 'x' | 'y') => {
    const s0 = (q[k] - p[k]) / (q.t - p.t);
    const s1 = (r[k] - q[k]) / (r.t - q.t);
    return s0 * s1 <= 0 ? 0 : ((2 * s0 * s1) / (s0 + s1)) * (c.t - b.t);
  };
  const h = (k: 'x' | 'y') => {
    const m0 = tan(a, b, c, k);
    const m1 = tan(b, c, d, k);
    const u2 = u * u;
    const u3 = u2 * u;
    return (
      (2 * u3 - 3 * u2 + 1) * b[k] +
      (u3 - 2 * u2 + u) * m0 +
      (-2 * u3 + 3 * u2) * c[k] +
      (u3 - u2) * m1
    );
  };
  return [h('x'), h('y')];
}

// Deterministic pseudo-random numbers so every mount moves the same way.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const hash = (n: number) => rng(n * 7919 + 13)();

type Sim = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  r: Float32Array;
  m: Float32Array;
  k: Float32Array;
  free: Float32Array;
  life: Float32Array;
  wob: Float32Array;
  ox: Float32Array;
  oy: Float32Array;
  torn: Float32Array;
  lag: Float32Array;
  hx: number;
  hy: number;
  hvx: number;
  hvy: number;
  t: number;
  cut: number;
  rmax: number;
};

/** Builds the balls, biggest first (the shader blends them in this order). */
function createSim(droplets: number, size: number): Sim {
  const r = rng(11);
  const n = CORE + MID + droplets;
  const s: Sim = {
    n,
    x: new Float32Array(n),
    y: new Float32Array(n),
    vx: new Float32Array(n),
    vy: new Float32Array(n),
    r: new Float32Array(n),
    m: new Float32Array(n),
    k: new Float32Array(n),
    free: new Float32Array(n),
    life: new Float32Array(n),
    wob: new Float32Array(n * 6),
    ox: new Float32Array(n),
    oy: new Float32Array(n),
    torn: new Float32Array(n),
    lag: new Float32Array(n),
    hx: 0,
    hy: 0,
    hvx: 0,
    hvy: 0,
    t: 0,
    cut: -1,
    rmax: 0,
  };
  for (let i = 0; i < n; i++) {
    let rad: number;
    if (i < CORE) rad = 0.11 - (i / CORE) * 0.022;
    else if (i < CORE + MID) rad = 0.056 - ((i - CORE) / MID) * 0.024;
    else rad = 0.0105 + Math.pow(r(), 1.5) * 0.0125;
    rad *= size;
    s.r[i] = rad;
    s.m[i] = rad * rad;
    // Stiffness spread: the soft ones trail behind, which is what stretches the blob.
    s.k[i] = (i < CORE ? 26 : 32) * (0.75 + 0.5 * r());
    // How far behind a moving blob this ball aims (s): the spread is the drag-behind stretch.
    s.lag[i] = 0.03 + 0.2 * r();
    // Resting place inside the blob: a filled sunflower pack for the core,
    // a looser ring for the chunks, the centre for droplets (buried, unseen).
    const a = i * 2.39996 + 0.6;
    // Every sixth droplet keeps a little distance, like the beads that hang
    // around a resting puddle of mercury.
    const sat = i >= CORE + MID && (i - CORE - MID) % 6 === 5;
    if (sat) {
      s.r[i] = rad * 1.35;
      s.m[i] = s.r[i] * s.r[i];
    }
    const d =
      i < CORE
        ? Math.sqrt(i / CORE) * 0.158
        : i < CORE + MID
          ? 0.085 + 0.03 * r()
          : sat
            ? 0.27 + 0.1 * r()
            : 0.04 * r();
    s.ox[i] = Math.cos(a) * d * size;
    s.oy[i] = Math.sin(a) * d * size;
    s.x[i] = s.ox[i];
    s.y[i] = s.oy[i];
    // Idle wobble: amplitude, frequency (multiple of 1/LOOP), phase, for x and y.
    const amp = (i < CORE ? 0.042 : 0.02) * size;
    for (let c = 0; c < 2; c++) {
      s.wob[i * 6 + c * 3] = amp * (0.5 + 0.5 * r());
      s.wob[i * 6 + c * 3 + 1] = (1 + Math.floor(r() * 3)) / LOOP;
      s.wob[i * 6 + c * 3 + 2] = r() * TAU;
    }
  }
  s.rmax = s.r[0];
  return s;
}

/**
 * Throws liquid away from (cx, cy): radial burst plus the pointer's own direction.
 * Light droplets fly much further than the heavy core, which only breaks into chunks.
 */
function splash(
  s: Sim,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
  radius: number,
  power: number
) {
  // Seed the jitter from the throw direction, not a counter, so a looping path splashes identically.
  const sector = Math.round(((Math.atan2(dy, dx) + Math.PI) / TAU) * 8);
  for (let i = 0; i < s.n; i++) {
    let ox = s.x[i] - cx;
    let oy = s.y[i] - cy;
    const d = Math.hypot(ox, oy);
    const reach = radius + s.r[i];
    if (d > reach) continue;
    const h1 = hash(i * 9 + sector);
    const h2 = hash(i * 9 + sector + 101);
    if (d > 1e-4) {
      ox /= d;
      oy /= d;
    }
    if (i >= CORE + MID || d <= 1e-4) {
      // Droplets hide near the centre, so their own direction matters more
      // than where the burst came from: spray them all round.
      const a = (i * 2.39996 + sector) % TAU;
      const w = d > 1e-4 ? 0.5 : 0;
      ox = Math.cos(a) + ox * w;
      oy = Math.sin(a) + oy * w;
      const l = Math.hypot(ox, oy) || 1;
      ox /= l;
      oy /= l;
    }
    const f = Math.sqrt(1 - d / reach);
    const light = Math.min(3.2, Math.pow(s.rmax / s.r[i], 0.45));
    // Heavy pieces get a coherent push so they tear into stretched strands;
    // only the light droplets scatter with real jitter.
    const spread = i < CORE + MID ? 0.25 : 0.8;
    const out = power * f * light * (1 - spread / 2 + spread * h1) * (i < CORE + MID ? 1 : 0.85);
    const side = (h2 - 0.5) * 1.6 * spread * out;
    s.vx[i] += ox * out - oy * side + dx * f * Math.sqrt(light) * 0.45;
    s.vy[i] += oy * out + ox * side + dy * f * Math.sqrt(light) * 0.45;
    s.free[i] = Math.max(s.free[i], 0.35 + 0.65 * f);
    s.life[i] = (i < CORE ? 0.6 : 0.9) + 1.1 * h2;
  }
}

type Pointer = { x0: number; y0: number; x1: number; y1: number; active: boolean };

/** Advances the liquid by dt seconds while the pointer travels from (x0, y0) to (x1, y1). */
function stepSim(
  s: Sim,
  dt: number,
  p: Pointer,
  opts: { intensity: number; size: number; calm: boolean; hw: number; hh: number }
) {
  const steps = Math.max(1, Math.ceil(dt / STEP - 1e-6));
  const h = dt / steps;
  const n = s.n;
  const calm = opts.calm;
  const poke = POKE * opts.size;
  const cutSpeed = 0.9 / Math.max(opts.intensity, 1e-3);
  for (let st = 0; st < steps; st++) {
    const a0 = st / steps;
    const a1 = (st + 1) / steps;
    const px0 = p.x0 + (p.x1 - p.x0) * a0;
    const py0 = p.y0 + (p.y1 - p.y0) * a0;
    const px1 = p.x0 + (p.x1 - p.x0) * a1;
    const py1 = p.y0 + (p.y1 - p.y0) * a1;
    const pvx = (px1 - px0) / h;
    const pvy = (py1 - py0) / h;
    const speed = Math.hypot(pvx, pvy);
    s.t += h;

    // Home chases the pointer on a soft spring: the springy lag.
    const w = calm ? 4 : 8.5;
    s.hvx += (w * w * (px1 - s.hx) - 2 * 0.8 * w * s.hvx) * h;
    s.hvy += (w * w * (py1 - s.hy) - 2 * 0.8 * w * s.hvy) * h;
    s.hx += s.hvx * h;
    s.hy += s.hvy * h;

    const wt = s.t * (calm ? 0.5 : 1);
    for (let i = 0; i < n; i++) {
      const o = i * 6;
      const tx =
        s.hx -
        s.hvx * s.lag[i] +
        s.ox[i] +
        s.wob[o] * Math.sin(TAU * s.wob[o + 1] * wt + s.wob[o + 2]);
      const ty =
        s.hy -
        s.hvy * s.lag[i] +
        s.oy[i] +
        s.wob[o + 3] * Math.sin(TAU * s.wob[o + 4] * wt + s.wob[o + 5]);
      let dx = tx - s.x[i];
      let dy = ty - s.y[i];
      const d = Math.hypot(dx, dy);
      // Far droplets come home at a steady pace instead of snapping back.
      const sat = 0.22 * opts.size;
      if (d > sat) {
        dx *= sat / d;
        dy *= sat / d;
      }
      const fr = s.free[i];
      const k = s.k[i] * (1 - 0.93 * fr) * (calm ? 0.5 : 1);
      s.vx[i] += k * dx * h;
      s.vy[i] += k * dy * h;
      // Soft walls a little past the edges keep the spray in the picture.
      const wx = Math.abs(s.x[i]) - opts.hw + s.r[i] * 0.5;
      const wy = Math.abs(s.y[i]) - opts.hh + s.r[i] * 0.5;
      if (wx > 0) s.vx[i] -= Math.sign(s.x[i]) * wx * 160 * h;
      if (wy > 0) s.vy[i] -= Math.sign(s.y[i]) * wy * 160 * h;
      // Torn chunks coast; droplets burst out fast, then hang in the air.
      const drag = Math.exp(-(4.6 - (i < CORE + MID ? 3.0 : 1.2) * fr) * h);
      s.vx[i] *= drag;
      s.vy[i] *= drag;
      if (fr > 0) s.free[i] = Math.max(0, fr - h / s.life[i]);
      // Eased copy of `free` that drives the visible break-up, so shapes never pop.
      s.torn[i] += (s.free[i] - s.torn[i]) * Math.min(1, h * 9);
    }

    // Pairs: keep volume, and let loose droplets cling to each other like mercury.
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        // Droplets slip straight through the core to their hiding place: no
        // pile-ups that would leave each regather looking a little different.
        if (i < CORE && j >= CORE + MID) continue;
        const dx = s.x[j] - s.x[i];
        const dy = s.y[j] - s.y[i];
        const sum = s.r[i] + s.r[j];
        const d2 = dx * dx + dy * dy;
        const reach = sum * 1.3;
        if (d2 > reach * reach) continue;
        const d = Math.sqrt(d2) + 1e-6;
        const nx = dx / d;
        const ny = dy / d;
        // Unequal pairs nest: a droplet can sink deep inside a big ball.
        const rest =
          sum *
          (i < CORE && j < CORE ? CORE_PACK : PACK) *
          Math.sqrt(Math.min(s.r[i], s.r[j]) / Math.max(s.r[i], s.r[j]));
        const wi = s.m[j] / (s.m[i] + s.m[j]);
        const wj = 1 - wi;
        const loose = Math.max(s.free[i], s.free[j]);
        // Pieces only shove each other while the blob is torn, and fast flyers
        // pass through. A gathered blob rests exactly on its layout, so every
        // regather lands the same way and a recording loops cleanly.
        const shove =
          Math.min(1, Math.max(s.torn[i], s.torn[j]) * 6) *
          Math.min(1, Math.max(0, (0.6 - loose) / 0.25));
        if (d < rest) {
          if (shove <= 0) continue;
          const c = (rest - d) * 0.45 * shove;
          s.x[i] -= nx * c * wi;
          s.y[i] -= ny * c * wi;
          s.x[j] += nx * c * wj;
          s.y[j] += ny * c * wj;
          const vn = (s.vx[j] - s.vx[i]) * nx + (s.vy[j] - s.vy[i]) * ny;
          if (vn < 0) {
            s.vx[i] += nx * vn * 0.35 * shove * wi;
            s.vy[i] += ny * vn * 0.35 * shove * wi;
            s.vx[j] -= nx * vn * 0.35 * shove * wj;
            s.vy[j] -= ny * vn * 0.35 * shove * wj;
          }
        } else if (loose > 0) {
          // Torn pieces cling to each other harder than droplets do.
          const pull = (i < CORE + MID && j < CORE + MID ? 7 : 2.5) * (d - rest) * h;
          s.vx[i] += nx * pull * wi;
          s.vy[i] += ny * pull * wi;
          s.vx[j] -= nx * pull * wj;
          s.vy[j] -= ny * pull * wj;
        }
      }
    }

    // The pointer parts the liquid as it moves, and a fast pass tears it apart.
    if (p.active) {
      const part = Math.min(1, Math.max(0, (speed - 0.12) / 0.7)) * (calm ? 0.3 : 1);
      const sx = px1 - px0;
      const sy = py1 - py0;
      const sl = sx * sx + sy * sy;
      let hit = -1;
      let hx = 0;
      let hy = 0;
      for (let i = 0; i < n; i++) {
        const u =
          sl > 0 ? Math.min(1, Math.max(0, ((s.x[i] - px0) * sx + (s.y[i] - py0) * sy) / sl)) : 1;
        const cx = px0 + sx * u;
        const cy = py0 + sy * u;
        const ox = s.x[i] - cx;
        const oy = s.y[i] - cy;
        const d = Math.hypot(ox, oy) + 1e-6;
        const reach = s.r[i] * 0.9 + poke;
        if (d >= reach) continue;
        if (part > 0) {
          const c = (reach - d) * 0.3 * part;
          s.x[i] += (ox / d) * c;
          s.y[i] += (oy / d) * c;
          // Drag the touched liquid along, never faster than the pointer itself.
          const pull = Math.min(1, 5 * h) * part * 0.5;
          s.vx[i] += (pvx - s.vx[i]) * pull;
          s.vy[i] += (pvy - s.vy[i]) * pull;
        }
        if (hit < 0 && s.free[i] < 0.3 && i < CORE + MID) {
          hit = i;
          hx = cx;
          hy = cy;
        }
      }
      if (!calm && opts.intensity > 0 && hit >= 0 && speed > cutSpeed && s.t - s.cut > 0.35) {
        s.cut = s.t;
        const over = Math.min(2.2, speed / cutSpeed);
        // Burst from between the cut and the blob's heart, so the spray fans out all round.
        splash(
          s,
          (hx + s.hx) / 2,
          (hy + s.hy) / 2,
          pvx / speed,
          pvy / speed,
          0.36 * opts.size,
          0.85 * over * opts.intensity
        );
      }
    }

    for (let i = 0; i < n; i++) {
      s.x[i] += s.vx[i] * h;
      s.y[i] += s.vy[i] * h;
    }
  }
}

/**
 * Writes x, y, kernel reach and weight per ball. Droplets resting deep inside
 * the big ones fade out of the field, so the gathered blob reads as one smooth
 * body instead of a bag of marbles, and they reappear as they fly free.
 */
function packBalls(s: Sim, out: Float32Array) {
  for (let i = 0; i < s.n; i++) {
    let buried = 0;
    if (i >= CORE) {
      for (let j = 0; j < s.n; j++) {
        if (s.r[j] < s.r[i] * 1.6) continue;
        const R = s.r[j] * KERNEL;
        const t = ((s.x[i] - s.x[j]) ** 2 + (s.y[i] - s.y[j]) ** 2) / (R * R);
        if (t < 1) buried += (1 - t) ** 3;
      }
    }
    const x = Math.min(1, Math.max(0, (buried / ISO - 1.4) / 1.4));
    out[i * 4] = s.x[i];
    out[i * 4 + 1] = s.y[i];
    // Torn core pieces thin out while droplets swell, so a splash reads as the
    // blob breaking up rather than a few marbles leaving it.
    const tn = s.torn[i];
    const swell = i < CORE ? 1 - 0.28 * tn : i < CORE + MID ? 1 - 0.12 * tn : 1 + 0.35 * tn;
    out[i * 4 + 2] = s.r[i] * KERNEL * swell;
    out[i * 4 + 3] = 1 - x * x * (3 - 2 * x);
  }
}

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const frag = (derivatives: boolean, n: number) => `
${derivatives ? '#extension GL_OES_standard_derivatives : enable' : ''}
precision highp float;
uniform vec2 uRes;
uniform float uUnit;      // device px per scene unit
uniform vec4 uBall[${n}]; // x, y, kernel reach, weight

const float PI = 3.14159265;
const float ISO = ${ISO.toFixed(3)};
const float FLAT = ${FLAT.toFixed(3)};

float band(float x, float a, float b, float w) {
  return smoothstep(a - w, a + w, x) * (1.0 - smoothstep(b - w, b + w, x));
}
float arc(float az, float c, float hw, float w) {
  float d = abs(mod(az - c + PI, 2.0 * PI) - PI);
  return 1.0 - smoothstep(hw - w, hw + w, d);
}

// A rounded-rectangle light panel seen from the mirror. R: reflected direction,
// e0 / a0: panel centre (elevation, azimuth), w / h: half sizes (radians),
// soft: edge softness, aa: extra blur for anti-aliasing.
float panel(vec3 R, float e0, float a0, float w, float h, float soft, float aa) {
  vec3 C = vec3(cos(e0) * cos(a0), cos(e0) * sin(a0), sin(e0));
  vec3 U = vec3(-sin(a0), cos(a0), 0.0);
  vec3 V = vec3(-sin(e0) * cos(a0), -sin(e0) * sin(a0), cos(e0));
  float f = dot(R, C);
  vec2 q = vec2(dot(R, U), dot(R, V)) / max(f, 1e-3) / vec2(w, h);
  float r = pow(pow(abs(q.x), 4.0) + pow(abs(q.y), 4.0), 0.25);
  return (1.0 - smoothstep(1.0 - soft - aa, 1.0 + soft + aa, r)) * step(0.0, f);
}

// The studio seen in the mirror, by reflected direction R (z up, y up the screen).
float studio(vec3 R, float aa) {
  float e = degrees(asin(clamp(R.z, -1.0, 1.0)));
  float az = atan(R.y, R.x);
  // Black ceiling, easing into dark walls near the horizon.
  float c = mix(0.5, 0.0, smoothstep(-18.0, 40.0, e));
  // A big softbox upper left, a tall strip on the right, a dim card low.
  c = mix(c, 1.0, panel(R, 0.86, 2.25, 0.82, 0.74, 0.34, aa));
  c = mix(c, 1.0, panel(R, 0.6, -0.15, 0.22, 0.8, 0.24, aa));
  c = mix(c, 0.45, panel(R, 0.3, -1.8, 0.7, 0.3, 0.3, aa));
  // Below the walls: the ground, lit far up the screen, dark at the contact.
  float ground = mix(0.32, 0.95, arc(az, 2.1, 1.5, 0.8));
  ground = mix(ground, 0.36, smoothstep(-74.0, -88.0, e));
  float ea = aa * 40.0;
  c = mix(c, ground, 1.0 - smoothstep(-60.0 - ea, -56.0 + ea, e));
  // The bright line that rims every edge.
  c = mix(c, 0.97, band(e, -56.0, -18.0, 6.0 + ea));
  return c;
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uUnit;

  // Summed metaball field with its gradient and a field-weighted kernel reach.
  float F = 0.0;
  vec2 dF = vec2(0.0);
  float reach = 0.0;
  for (int i = 0; i < ${n}; i++) {
    vec4 b = uBall[i];
    vec2 q = p - b.xy;
    float inv = 1.0 / (b.z * b.z);
    float k = max(1.0 - dot(q, q) * inv, 0.0);
    float f = k * k * k * b.w;
    F += f;
    dF -= 6.0 * k * k * b.w * inv * q;
    reach += f * b.z;
  }

  // Analytic anti-aliasing from the distance estimate (ISO - F) / |grad F|.
  float px = 1.0 / uUnit;
  float gl = max(length(dF), 1e-6);
  float alpha = clamp(0.5 + (F - ISO) / (gl * px), 0.0, 1.0);
  if (alpha <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Height from the field: a lone ball is an exact sphere of its iso radius,
  // a crowd sums into one smooth puddle. FLAT squashes it like a heavy liquid.
  reach /= max(F, 1e-6);
  float G = pow(F, 1.0 / 3.0);
  float lift = sqrt(max(G - pow(ISO, 1.0 / 3.0), 1e-5));
  vec2 dz = FLAT * reach * dF / (6.0 * G * G * lift);
  vec3 n = normalize(vec3(-dz, 1.0));

  // Orthographic camera looking straight down: reflect (0, 0, -1).
  vec3 R = vec3(2.0 * n.z * n.xy, 2.0 * n.z * n.z - 1.0);
  ${derivatives ? 'float aa = min(length(fwidth(R)) * 0.6, 0.6);' : 'float aa = 0.02;'}
  float c = studio(R, aa);

  // Chrome picks up a faint cool cast in its mid-tones.
  vec3 col = vec3(c) + vec3(-0.03, -0.008, 0.045) * c * (1.0 - c) * 4.0;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
  }
  return s;
}

/** Polished liquid chrome that follows the pointer, tears into droplets on fast swipes and flows back together. */
export function LiquidChrome({
  background = '#c2c2c2',
  size = 1,
  intensity = 1,
  droplets = 44,
  interactive = true,
  autoplay = true,
  label = 'Liquid chrome',
  className,
  style,
  ...props
}: LiquidChromeProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = React.useState(false);
  // Live props read by the running loop without restarting it.
  const live = React.useRef({ intensity, interactive, autoplay });
  live.current = { intensity, interactive, autoplay };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) return;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
    });
    if (!gl) {
      setFallback(true);
      return;
    }

    // Each ball costs one uniform vector; small GPUs only have 64 or so.
    const budget = (gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) as number) - 8;
    const drops = Math.max(0, Math.min(Math.round(droplets), MAX_DROPLETS, budget - CORE - MID));
    const sim = createSim(drops, Math.max(size, 0.05));
    const N = sim.n;

    const derivatives = !!gl.getExtension('OES_standard_derivatives');
    const prog = gl.createProgram()!;
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, frag(derivatives, N));
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uUnit = gl.getUniformLocation(prog, 'uUnit');
    const uBall = gl.getUniformLocation(prog, 'uBall');
    gl.clearColor(0, 0, 0, 0);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cssW = 1;
    let cssH = 1;
    let unit = 1; // css px per scene unit
    const resize = () => {
      const r = root.getBoundingClientRect();
      cssW = Math.max(1, r.width);
      cssH = Math.max(1, r.height);
      unit = Math.min(cssW, cssH);
      // DPR-aware, but keep the pixel count sane on huge screens.
      const dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(4.2e6 / (cssW * cssH)));
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    // Resizing clears the drawing buffer, so repaint at once rather than on the next frame.
    const ro = new ResizeObserver(() => {
      resize();
      if (!disposed) paint();
    });
    ro.observe(root);

    // Pointer state in scene units (y up). `src` says who drives the liquid.
    const ptr = { x: 0, y: 0, inside: false, touchAt: -1e9, leftAt: -1e9, tap: false };
    const toScene = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      ptr.x = (e.clientX - r.left - r.width / 2) / unit;
      ptr.y = -(e.clientY - r.top - r.height / 2) / unit;
    };
    const onMove = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      toScene(e);
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') ptr.inside = true;
      else ptr.touchAt = clock;
    };
    const onDown = (e: PointerEvent) => {
      if (!live.current.interactive) return;
      toScene(e);
      if (e.pointerType !== 'mouse') ptr.touchAt = clock;
      ptr.tap = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        ptr.inside = false;
        ptr.leftAt = clock;
      }
    };
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointerleave', onLeave);

    const balls = new Float32Array(N * 4);
    const bound = (x: number, lim: number) => Math.max(-lim, Math.min(lim, x));
    let src = '';
    let wanderT = 0;
    let lastTap = -1;
    let clock = 0;
    const pointer: Pointer = { x0: 0, y0: 0, x1: 0, y1: 0, active: false };

    // Settle the pile before the first frame.
    for (let i = 0; i < 90; i++)
      stepSim(sim, 1 / 60, pointer, { intensity: 0, size, calm: false, hw: 9, hh: 9 });

    let raf = 0;
    let visible = true;
    let disposed = false;
    let last = -1;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf && !disposed) {
        last = -1;
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(canvas);
    // GPU reset or too many contexts on the page: stop and show the static blob.
    const onLost = () => {
      disposed = true;
      cancelAnimationFrame(raf);
      setFallback(true);
    };
    canvas.addEventListener('webglcontextlost', onLost);

    function frame(now: number) {
      raf = 0;
      if (disposed) return;
      const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 15);
      last = now;
      if (dt > 0) {
        clock += dt;
        const { interactive: on, autoplay: wander, intensity: power } = live.current;
        // Who drives: the pointer, the spot it just left (a short hold, so the
        // blob doesn't bolt the moment the mouse leaves), the wander path, or rest.
        const user = on && (ptr.inside || clock - ptr.touchAt < 2.5);
        const hold = on && clock - ptr.leftAt < 1.5;
        const next = user ? 'user' : hold ? 'hold' : wander && !reduce ? 'wander' : 'rest';
        let tx = 0;
        let ty = 0;
        let tap = false;
        if (next === 'wander') {
          if (src !== 'wander') wanderT = 0;
          const prev = wanderT;
          wanderT += dt;
          [tx, ty] = wanderAt(wanderT);
          // Scripted taps fire as the path crosses them.
          for (const w of WANDER) {
            if (!w[3]) continue;
            const at = w[0];
            const a = ((prev % LOOP) + LOOP) % LOOP;
            const b = ((wanderT % LOOP) + LOOP) % LOOP;
            if ((a < at && b >= at) || (b < a && (at > a || at <= b))) tap = true;
          }
        } else if (next === 'user' || next === 'hold') {
          tx = ptr.x;
          ty = ptr.y;
        }
        const hw = cssW / unit / 2;
        const hh = cssH / unit / 2;
        tx = bound(tx, hw);
        ty = bound(ty, hh);
        // Switching drivers teleports the pointer; never read that jump as a swipe.
        pointer.x0 = src === next ? pointer.x1 : tx;
        pointer.y0 = src === next ? pointer.y1 : ty;
        pointer.x1 = tx;
        pointer.y1 = ty;
        pointer.active = next === 'user' || next === 'wander';
        src = next;
        if (ptr.tap && next === 'user') tap = true;
        ptr.tap = false;
        stepSim(sim, dt, pointer, { intensity: power, size, calm: reduce, hw, hh });
        if (tap && !reduce && power > 0 && clock - lastTap > 0.3) {
          lastTap = clock;
          splash(sim, tx, ty, 0, 0, 0.36 * size, 1.2 * power);
        }
      }

      paint();
      if (visible) raf = requestAnimationFrame(frame);
    }
    function paint() {
      packBalls(sim, balls);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform2f(uRes, canvas!.width, canvas!.height);
      gl!.uniform1f(uUnit, unit * (canvas!.width / cssW));
      gl!.uniform4fv(uBall, balls);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    // Paint the settled pile right away, so a still capture or a throttled tab never sees an empty canvas.
    paint();
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [size, droplets]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label}
      className={className ? `liquid-chrome-root ${className}` : 'liquid-chrome-root'}
      style={{ position: 'relative', overflow: 'hidden', background, ...style }}
      {...props}
    >
      {/* Fills its parent by default; zero specificity, so any sizing class (h-screen, h-[600px]) wins. */}
      <style>{`:where(.liquid-chrome-root){width:100%;height:100%}`}</style>
      {fallback ? (
        <StaticBlob />
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}

// No WebGL: one chrome blob drawn with gradients, breathing slowly.
function StaticBlob() {
  return (
    <div
      aria-hidden="true"
      className="liquid-chrome-fallback"
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: '40%',
        aspectRatio: '1',
        transform: 'translate(-50%, -50%)',
        borderRadius: '46% 54% 50% 50% / 52% 46% 54% 48%',
        background:
          'radial-gradient(60% 50% at 32% 30%, #fff 0 38%, transparent 62%), radial-gradient(30% 45% at 86% 52%, #fff 0 30%, transparent 70%), radial-gradient(closest-side, #000 0 72%, #3a3a3a 86%, #f2f2f2 93%, #4a4a4a 100%)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
        animation: 'liquid-chrome-breathe 6s ease-in-out infinite alternate',
      }}
    >
      <style>{`@keyframes liquid-chrome-breathe{to{border-radius:54% 46% 47% 53% / 46% 55% 45% 54%;transform:translate(-50%,-50%) rotate(8deg)}}@media (prefers-reduced-motion:reduce){.liquid-chrome-fallback{animation:none!important}}`}</style>
    </div>
  );
}

export default LiquidChrome;
