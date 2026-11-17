/**
 * Sculptural double-helix geometry for the Home Hero video (tools/hero-video, see README.md).
 *
 * Two thick tubular strands wind around a shared axis (local Y), joined by rounded rungs. Every
 * part is a ring sweep: a strand is one continuous strip from a hemispherical cap, along the helix,
 * to the other cap; a rung is a surface of revolution whose radius flares at both ends into a
 * fillet and whose tips are buried inside the strands, so the joins read as one smooth sculpted
 * body with no open edges or exposed intersections (the material is opaque; hidden interior faces
 * never show). Normals are analytic, so the surfaces shade smoothly at any resolution.
 *
 * Plain TypeScript on typed arrays: no Three.js, so it can be checked in Node. Units are relative
 * to the helix radius; the scene scales and poses the result.
 */

export interface HelixOptions {
  /** Radius of the strands' centre line around the axis. */
  radius: number;
  /** Cross-section radius of a strand. */
  tubeRadius: number;
  /** Rise along the axis per full turn. */
  pitch: number;
  turns: number;
  rungsPerTurn: number;
  /** Cross-section radius of a rung away from its ends. */
  rungRadius: number;
  /** Rings per turn of a strand. */
  segmentsPerTurn: number;
  /** Vertices around a strand ring. */
  radialSegments: number;
  /** Rings along a rung and vertices around one. */
  rungSegments: number;
  rungRadialSegments: number;
}

export interface HelixMesh {
  /** xyz per vertex. */
  positions: Float32Array;
  /** Unit normals, xyz per vertex. */
  normals: Float32Array;
  /** Triangle indices, outward-facing counter-clockwise. */
  indices: Uint32Array;
  /** Half of the sculpture's extent along its axis (caps included). */
  halfLength: number;
  /** Distance from the axis to the outside of a strand. */
  outerRadius: number;
}

/** Offline render quality: ~75k vertices (the video is rendered once, so cost is irrelevant). */
export const HELIX_VIDEO: HelixOptions = {
  radius: 1,
  tubeRadius: 0.3,
  pitch: 3.3,
  turns: 2.2,
  rungsPerTurn: 10,
  rungRadius: 0.135,
  segmentsPerTurn: 240,
  radialSegments: 40,
  rungSegments: 36,
  rungRadialSegments: 32,
};

const TAU = Math.PI * 2;
/** Rings on each hemispherical strand cap (the last one is the pole). */
const CAP_RINGS = 8;
/** How deep a rung's tip sits inside a strand, as a fraction of the strand radius. */
const RUNG_BURY = 0.4;
/** Length of a rung's fillet flare outside the strand, as a fraction of the strand radius. */
const FILLET_LENGTH = 0.7;
/**
 * Radius of a rung where it meets the strand surface, as a fraction of the strand radius. Kept
 * small enough that neighbouring rungs' flares never touch (rung spacing is pitch / rungsPerTurn).
 */
const FILLET_RADIUS = 0.5;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/* ── Mesh builder ──────────────────────────────────────────────────────── */

/** Writes one ring's vertex `j` of `count` into `pos`/`nor` at offset `o` (3 floats each). */
type RingFn = (ring: number, j: number, count: number, pos: Float32Array, nor: Float32Array, o: number) => void;

class MeshBuilder {
  private pos: Float32Array;
  private nor: Float32Array;
  private idx: Uint32Array;
  private v = 0;
  private i = 0;

  constructor(vertexCapacity: number, indexCapacity: number) {
    this.pos = new Float32Array(vertexCapacity * 3);
    this.nor = new Float32Array(vertexCapacity * 3);
    this.idx = new Uint32Array(indexCapacity);
  }

  /** A closed strip of `rings` rings with `around` vertices each; the strip is not closed end to end. */
  sweep(rings: number, around: number, ring: RingFn): void {
    const base = this.v;
    for (let r = 0; r < rings; r++) {
      for (let j = 0; j < around; j++) {
        ring(r, j, around, this.pos, this.nor, this.v * 3);
        this.v++;
      }
    }
    for (let r = 0; r < rings - 1; r++) {
      const a = base + r * around;
      const b = a + around;
      for (let j = 0; j < around; j++) {
        const jn = (j + 1) % around;
        // Counter-clockwise seen from outside: sweep direction × ring direction points inward.
        this.idx[this.i++] = a + j;
        this.idx[this.i++] = a + jn;
        this.idx[this.i++] = b + j;
        this.idx[this.i++] = a + jn;
        this.idx[this.i++] = b + jn;
        this.idx[this.i++] = b + j;
      }
    }
  }

  finish(): { positions: Float32Array; normals: Float32Array; indices: Uint32Array } {
    return {
      positions: this.pos.subarray(0, this.v * 3),
      normals: this.nor.subarray(0, this.v * 3),
      indices: this.idx.subarray(0, this.i),
    };
  }
}

/* ── Strands ───────────────────────────────────────────────────────────── */

/** A strand's centre, unit tangent and the two unit cross-section axes at angle `theta`. */
function strandFrame(
  o: HelixOptions,
  theta: number,
  out: { c: number[]; t: number[]; n: number[]; b: number[] }
): void {
  const { radius: R, pitch } = o;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  out.c[0] = R * cos;
  out.c[1] = (pitch * theta) / TAU;
  out.c[2] = R * sin;
  // Tangent of (R cos θ, pθ/2π, R sin θ).
  const tx = -R * sin;
  const ty = pitch / TAU;
  const tz = R * cos;
  const tl = Math.hypot(tx, ty, tz);
  out.t[0] = tx / tl;
  out.t[1] = ty / tl;
  out.t[2] = tz / tl;
  // Normal points at the axis; binormal = T × N completes a right-handed frame.
  out.n[0] = -cos;
  out.n[1] = 0;
  out.n[2] = -sin;
  out.b[0] = out.t[1] * out.n[2] - out.t[2] * out.n[1];
  out.b[1] = out.t[2] * out.n[0] - out.t[0] * out.n[2];
  out.b[2] = out.t[0] * out.n[1] - out.t[1] * out.n[0];
}

function addStrand(mb: MeshBuilder, o: HelixOptions, thetaStart: number, thetaEnd: number): void {
  const r = o.tubeRadius;
  const mainRings = Math.max(2, Math.round(o.segmentsPerTurn * o.turns)) + 1;
  const rings = mainRings + 2 * CAP_RINGS;
  const frame = { c: [0, 0, 0], t: [0, 0, 0], n: [0, 0, 0], b: [0, 0, 0] };
  const yOffset = -(o.pitch * (thetaEnd + thetaStart)) / (2 * TAU); // centre the strand on y = 0

  mb.sweep(rings, o.radialSegments, (ring, j, count, pos, nor, k) => {
    const phi = (TAU * j) / count;
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);
    let theta: number;
    let radial = r;
    let along = 0; // offset along the tangent (caps only)
    if (ring < CAP_RINGS) {
      theta = thetaStart;
      const psi = (-Math.PI / 2) * (1 - ring / CAP_RINGS);
      radial = r * Math.cos(psi);
      along = r * Math.sin(psi);
    } else if (ring >= CAP_RINGS + mainRings) {
      theta = thetaEnd;
      const psi = (Math.PI / 2) * ((ring - (CAP_RINGS + mainRings) + 1) / CAP_RINGS);
      radial = r * Math.cos(psi);
      along = r * Math.sin(psi);
    } else {
      theta = thetaStart + ((thetaEnd - thetaStart) * (ring - CAP_RINGS)) / (mainRings - 1);
    }
    strandFrame(o, theta, frame);
    const { c, t, n, b } = frame;
    // Unit offset from the centre in the cross-section, and the cap's unit normal.
    const dx = cp * n[0] + sp * b[0];
    const dy = cp * n[1] + sp * b[1];
    const dz = cp * n[2] + sp * b[2];
    pos[k] = c[0] + radial * dx + along * t[0];
    pos[k + 1] = c[1] + yOffset + radial * dy + along * t[1];
    pos[k + 2] = c[2] + radial * dz + along * t[2];
    const nx = radial * dx + along * t[0];
    const ny = radial * dy + along * t[1];
    const nz = radial * dz + along * t[2];
    const nl = Math.hypot(nx, ny, nz) || 1;
    nor[k] = nx / nl;
    nor[k + 1] = ny / nl;
    nor[k + 2] = nz / nl;
  });
}

/* ── Rungs ─────────────────────────────────────────────────────────────── */

/**
 * Radius of a rung at distance `a` from the centre line of the strand it enters (`a` ≤ tubeRadius
 * is inside the strand): the rung's own radius, flaring into a fillet as it nears the strand and
 * holding that width through the buried part. The buried tip stays inside the strand because
 * FILLET_RADIUS² + RUNG_BURY² < 1 (the strand's cross-section is a unit disc in those terms).
 */
function rungProfile(o: HelixOptions, a: number): number {
  const r = o.tubeRadius;
  const u = clamp01((a - r) / (FILLET_LENGTH * r));
  const flare = (1 - u) * (1 - u) * (1 - u); // steep at the strand, tangent to the shaft
  return o.rungRadius + (FILLET_RADIUS * r - o.rungRadius) * flare;
}

function addRung(mb: MeshBuilder, o: HelixOptions, theta: number, y: number): void {
  const R = o.radius;
  const r = o.tubeRadius;
  // From strand A at θ to strand B at θ + π, through the axis.
  const dx = -Math.cos(theta);
  const dz = -Math.sin(theta);
  // Cross-section axes: world up u = (0, 1, 0) and b = d × u = (−dz, 0, dx).
  const ux = 0, uy = 1, uz = 0;
  const bx = -dz, by = 0, bz = dx;
  const half = R - r * RUNG_BURY;
  const rings = o.rungSegments;
  const ds = 1e-3;
  const radiusAt = (s: number) => rungProfile(o, R - Math.abs(s));

  mb.sweep(rings, o.rungRadialSegments, (ring, j, count, pos, nor, k) => {
    const s = -half + (2 * half * ring) / (rings - 1);
    const rho = radiusAt(s);
    const slope = (radiusAt(s + ds) - radiusAt(s - ds)) / (2 * ds);
    const phi = (TAU * j) / count;
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);
    const rx = cp * ux + sp * bx;
    const ry = cp * uy + sp * by;
    const rz = cp * uz + sp * bz;
    pos[k] = s * dx + rho * rx;
    pos[k + 1] = y + rho * ry;
    pos[k + 2] = s * dz + rho * rz;
    // Surface of revolution: normal = radial − ρ′(s) · axis.
    const nx = rx - slope * dx;
    const ny = ry;
    const nz = rz - slope * dz;
    const nl = Math.hypot(nx, ny, nz) || 1;
    nor[k] = nx / nl;
    nor[k + 1] = ny / nl;
    nor[k + 2] = nz / nl;
  });
}

/* ── Assembly ──────────────────────────────────────────────────────────── */

export function buildHelixMesh(o: HelixOptions = HELIX_VIDEO): HelixMesh {
  const thetaSpan = TAU * o.turns;
  const thetaStart = -thetaSpan / 2;
  const thetaEnd = thetaSpan / 2;
  const rungCount = Math.max(1, Math.round(o.rungsPerTurn * o.turns));

  const strandRings = Math.max(2, Math.round(o.segmentsPerTurn * o.turns)) + 1 + 2 * CAP_RINGS;
  const strandVerts = strandRings * o.radialSegments;
  const strandIdx = (strandRings - 1) * o.radialSegments * 6;
  const rungVerts = o.rungSegments * o.rungRadialSegments;
  const rungIdx = (o.rungSegments - 1) * o.rungRadialSegments * 6;
  const mb = new MeshBuilder(2 * strandVerts + rungCount * rungVerts, 2 * strandIdx + rungCount * rungIdx);

  addStrand(mb, o, thetaStart, thetaEnd);
  addStrand(mb, o, thetaStart + Math.PI, thetaEnd + Math.PI);

  // Rungs sit between the strands' ends, never on a cap.
  for (let n = 0; n < rungCount; n++) {
    const theta = thetaStart + (thetaSpan * (n + 0.5)) / rungCount;
    addRung(mb, o, theta, (o.pitch * theta) / TAU);
  }

  const { positions, normals, indices } = mb.finish();
  return {
    positions,
    normals,
    indices,
    halfLength: (o.pitch * o.turns) / 2 + o.tubeRadius * 1.1,
    outerRadius: o.radius + o.tubeRadius,
  };
}
