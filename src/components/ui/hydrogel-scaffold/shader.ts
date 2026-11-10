/**
 * GLSL for the gyroid hydrogel: one full-screen triangle, ray-marched.
 *
 *   gel()     — sheet gyroid distance estimate (|g| − t) / |∇g|, with the controlled warp, thickness
 *               variation and the probe's parting / thinning applied as domain deformations.
 *   hitCells() — a few cells at pore centres (the field's extrema), chosen and animated on the CPU.
 *   main()    — march from the lattice front to the back, compositing up to MAX_LAYERS translucent
 *               walls front-to-back, then a cell if one is reached. Output is premultiplied alpha,
 *               so the page background shows through wherever the gel is thin or fogged out.
 */
import { CONFIG } from './config';
import { LATTICE_K, hexToLinear } from './gyroid';

const C = CONFIG;
const f = (v: number) => (Number.isInteger(v) ? v.toFixed(1) : String(+v.toFixed(6)));
const v3 = (c: readonly number[]) => `vec3(${f(c[0])}, ${f(c[1])}, ${f(c[2])})`;
const lin = (hex: string) => v3(hexToLinear(hex));

export const VERTEX = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

export function buildFragment(o: { maxSteps: number; maxLayers: number; maxCells: number }) {
  const GY = C.gyroid, GEL = C.gel, CE = C.cells, M = C.motion, L = C.lights, V = C.volume;
  return /* glsl */ `#version 300 es
precision highp float;
out vec4 outColor;
#define MAX_STEPS ${o.maxSteps}
#define MAX_LAYERS ${o.maxLayers}
#define MAX_CELLS ${o.maxCells}

uniform vec2 uRes;        // drawing buffer, px
uniform vec2 uTan;        // tan(half fov) · (aspect, 1)
uniform mat3 uInvRot;     // world → object rotation
uniform mat3 uRot;        // object → world rotation
uniform vec3 uTrans;      // lattice translation (world)
uniform float uTime;      // idle clock (s); frozen with reduced motion
uniform float uMotion;    // 0 with reduced motion
uniform float uReveal;    // entrance radius around uFocus (object units)
uniform float uStacked;   // 1 = stacked (mobile) layout
uniform vec4 uProbe;      // object-space probe point, strength
uniform vec3 uViewAxis;   // object-space unit vector towards the camera
uniform vec3 uFocus;
uniform vec3 uKey;        // object-space unit vectors towards the lights
uniform vec3 uRimDir;
uniform vec3 uBounceDir;
uniform vec3 uUp;
uniform mat3 uBasis;      // object → lattice phase
uniform mat3 uBasisT;     // its transpose: phase gradient → object gradient
uniform vec4 uCellA[MAX_CELLS]; // centre (object), radius
uniform vec4 uCellB[MAX_CELLS]; // long axis, elongation
uniform vec4 uCellC[MAX_CELLS]; // fluorescence 0…1, membrane colour index
uniform vec4 uCellS[MAX_CELLS]; // screen-space bound: ndc centre, ndc radius (CPU-projected)
uniform int uCellCount;

const float TAU = 6.2831853;
const float CAM = ${f(C.camera.distance)};
const float K = ${f(LATTICE_K)};
const float THICK = ${f(GY.thickness)};
const float TVAR = ${f(GY.thicknessVariation)};
const float WARP = ${f(GY.warp * GY.period)};
const float FRONT_NEAR = ${f(V.frontNear)};
const float FRONT_FAR = ${f(V.frontFar)};
const float FRONT_FADE = ${f(V.frontFade)};
const float BACK = ${f(V.back)};
const float FOG_NEAR = ${f(C.fog.near)};
const float FOG_FAR = ${f(C.fog.far)};
const float PROBE_R = ${f(M.probeRadius)};
const float PARTING = ${f(M.probeParting)};
const float THINNING = ${f(M.probeThinning)};
const float MIN_STEP = ${f(C.march.minStep)};
const float HIT_EPS = ${f(C.march.hitEpsilon)};
const float MAX_STEP = ${f(GY.period * 0.15)};

const vec3 TINT0 = ${lin(GY.tints[0])};
const vec3 TINT1 = ${lin(GY.tints[1])};
const vec3 TINT2 = ${lin(GY.tints[2])};
const vec3 RIM = ${lin(GEL.rim)};
const vec3 RIM_LIGHT = ${lin(L.rim.color)};
const vec3 SKY = ${lin(L.hemisphere.sky)};
const vec3 GROUND = ${lin(L.hemisphere.ground)};
const vec3 BOUNCE = ${lin(L.bounce.color)};
const vec3 PROBE_TINT = ${lin(C.probeTint)};
const vec3 FLUOR_M = ${lin(C.fluorescence.membrane)};
const vec3 FLUOR_N = ${lin(C.fluorescence.nucleus)};
const vec3 NUCLEUS = ${lin(CE.nucleusColor)};
const vec3 MEMBRANES[6] = vec3[6](${CE.membraneColors.map(lin).join(', ')});

/* ── Layout (mirrors layout.ts) ─────────────────────────────────────── */
float copyWeight(vec2 n) {
  return uStacked > 0.5 ? 1.0 - smoothstep(-0.6, 0.4, n.y) : 1.0 - smoothstep(-0.65, 0.5, n.x);
}
float frontDepth(vec2 n) {
  return uStacked > 0.5 ? mix(${f(V.mobileFrontNear)}, ${f(V.mobileFrontFar)}, copyWeight(n)) : mix(FRONT_NEAR, FRONT_FAR, copyWeight(n));
}

/* ── Probe ──────────────────────────────────────────────────────────── */
float probeQ(vec3 d) {
  float along = dot(d, uViewAxis);
  vec3 lat = d - along * uViewAxis;
  return (dot(lat, lat) + along * along * 0.3) / (PROBE_R * PROBE_R);
}
// Lateral push, zero at the centre and continuous: the pores under the tip open a little.
vec3 partAt(vec3 p) {
  vec3 d = p - uProbe.xyz;
  float along = dot(d, uViewAxis);
  vec3 lat = d - along * uViewAxis;
  float u = length(lat) / PROBE_R;
  float fall = exp(-probeQ(d)) * uProbe.w;
  return lat * (PARTING * fall / ((u + 0.25) * PROBE_R)) - uViewAxis * (0.03 * fall);
}
float probeGlow(vec3 p) { return exp(-probeQ(p - uProbe.xyz) * 1.1) * uProbe.w; }

float revealDist(vec3 p) {
  return length(p - uFocus) + 0.16 * sin(p.x * 5.3 + 1.0) * sin(p.y * 4.7 + 2.0) * sin(p.z * 6.1);
}

/* ── Sheet gyroid ───────────────────────────────────────────────────── */
// Distance estimate to the gel walls (negative inside), outward normal n and the raw field g.
float gel(vec3 p, out vec3 n, out float g) {
  vec3 pp = p;
  float press = 0.0;
  if (uProbe.w > 0.001) { // skipped entirely while nobody is probing
    pp -= partAt(p); // inverse of the parting displacement
    press = exp(-probeQ(p - uProbe.xyz)) * uProbe.w;
  }
  vec3 s1 = sin(pp.yzx * vec3(1.3, 1.1, 1.2) + pp.zxy * vec3(0.7, 0.6, 0.5) + vec3(0.5, 2.1, 4.2));
  pp += WARP * s1; // gentle, low-frequency warp: ordered, not machine-perfect
  vec3 q = uBasis * pp;
  q -= TAU * floor(q * (1.0 / TAU)); // reduce to [0, 2π): large arguments take a slow trig path
  vec3 sq = sin(q), cq = cos(q);
  g = sq.x * cq.y + sq.y * cq.z + sq.z * cq.x;
  vec3 gp = uBasisT * vec3(cq.x * cq.y - sq.z * sq.x, cq.y * cq.z - sq.x * sq.y, cq.z * cq.x - sq.y * sq.z);
  float gl = max(length(gp), 0.3 * K);
  float th = THICK * (1.0 + TVAR * s1.x * s1.y) - THINNING * press; // walls thin under the tip
  n = (g >= 0.0 ? 1.0 : -1.0) * gp / gl;
  return (abs(g) - th) / gl; // first-order distance; steps are capped at MAX_STEP
}

/* ── Cells in selected pores ────────────────────────────────────────── */
// Chosen and animated on the CPU (scene.ts); here one analytic ray–ellipsoid test per cell per pixel.
// Returns the ray distance of the nearest cell hit (1e9 if none) and its index.
float hitCells(vec3 ro, vec3 rd, vec2 ndc, out int idx) {
  float best = 1e9;
  idx = -1;
  for (int i = 0; i < MAX_CELLS; i++) {
    if (i >= uCellCount) break;
    vec4 S = uCellS[i];
    vec2 sd = (ndc - S.xy) * vec2(uTan.x / uTan.y, 1.0);
    if (dot(sd, sd) > S.z * S.z) continue; // cheap screen-space reject: most cells never touch this pixel
    vec4 A = uCellA[i];
    if (A.w < 1e-4) continue;
    vec4 B = uCellB[i];
    // Squash the ray along the cell's long axis so the ellipsoid becomes a sphere of radius A.w.
    vec3 o = ro - A.xyz;
    float k = 1.0 / B.w - 1.0;
    vec3 o2 = o + B.xyz * dot(o, B.xyz) * k;
    vec3 d2 = rd + B.xyz * dot(rd, B.xyz) * k;
    float a = dot(d2, d2), b = dot(o2, d2), c = dot(o2, o2) - A.w * A.w;
    float disc = b * b - a * c;
    if (disc < 0.0) continue;
    float t = (-b - sqrt(disc)) / a;
    if (t > 0.0 && t < best) { best = t; idx = i; }
  }
  return best;
}

vec3 tonemap(vec3 x) {
  x *= ${f(C.exposure)};
  x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); // ACES (Narkowicz)
  return pow(x, vec3(1.0 / 2.2));
}

void main() {
  vec2 ndc = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  vec3 rdW = normalize(vec3(ndc * uTan, -1.0));
  vec3 ro = uInvRot * (vec3(0.0, 0.0, CAM) - uTrans);
  vec3 rd = uInvRot * rdW;
  float axial = -rdW.z; // view-axis depth per unit of ray length
  float front = frontDepth(ndc);
  float t = (front - 0.05) / axial;
  float tEnd = min(BACK, FOG_FAR) / axial; // beyond the fog nothing is visible
  int ci;
  float tCell = hitCells(ro, rd, ndc, ci);

  // ── 1. March: find up to MAX_LAYERS wall hits. Kept cheap and branch-light; shading happens after,
  //       so pixels in a GPU wavefront don't all pay for each other's shading inside the loop. ──
  float hT[MAX_LAYERS];
  vec3 hN[MAX_LAYERS];
  float hA[MAX_LAYERS];
  int nh = 0;
  float T = 1.0;
  bool inWall = true; // the first sample decides: starting inside a wall = cut face, not drawn
  bool first = true;
  float gOut = 1.0;   // field at the last sample outside the walls: the side we approach from
  float tLastHit = -1.0;
  bool reachedCell = false;
  bool startedInside = false;

  for (int i = 0; i < MAX_STEPS; i++) {
    if (t > tEnd || T < 0.03 || nh >= MAX_LAYERS) break;
    if (t >= tCell) { reachedCell = true; break; }
    vec3 p = ro + rd * t;
    vec3 n; float g;
    float d = gel(p, n, g);
    if (first) { inWall = d < 0.0; startedInside = inWall; first = false; }
    if (inWall) {
      if (d > 0.0 && startedInside) {
        // The ray began inside a wall the front cuts through: register that wall where the ray leaves
        // it, with the same front fade as its neighbours that hit its face, so the cut never shows.
        startedInside = false;
        float depth = t * axial;
        float fres = pow(1.0 - abs(dot(n, rd)), ${f(GEL.rimPower)});
        float a = mix(${f(GEL.opacityFacing)}, ${f(GEL.opacityGrazing)}, fres) * smoothstep(front, front + FRONT_FADE, depth);
        a *= 1.0 - smoothstep(FOG_NEAR, FOG_FAR, depth);
        if (uReveal < 100.0) a *= 1.0 - smoothstep(uReveal - 0.25, uReveal, revealDist(ro + rd * t));
        hT[nh] = t; hN[nh] = -n; hA[nh] = clamp(a, 0.0, 0.95); nh++;
        T *= 1.0 - hA[nh - 1];
      }
      if (d > 0.0) {
        // Left the wall: remember the side, and ignore the same sheet's far face right behind us.
        inWall = false;
        gOut = g;
        tLastHit = t;
      } else {
        t += max(-d, MIN_STEP * t) + MIN_STEP * t;
        continue;
      }
    }
    if (d < HIT_EPS * t) {
      // Refine onto the surface; take the normal's side from the approach (an overshoot past the
      // mid-surface would otherwise flip it).
      t += d * 0.9;
      d = gel(ro + rd * t, n, g);
      n *= sign(g) * sign(gOut) == 0.0 ? 1.0 : sign(g) * sign(gOut);
      inWall = true;
      // A grazing ray re-entering the sheet it just left is the same wall, not a new layer.
      if (tLastHit < 0.0 || t - tLastHit > ${f(C.gyroid.period * 0.06)}) {
        tLastHit = t;
        vec3 ph = ro + rd * t;
        float depth = t * axial;
        float fres = pow(1.0 - abs(dot(n, rd)), ${f(GEL.rimPower)});
        float a = mix(${f(GEL.opacityFacing)}, ${f(GEL.opacityGrazing)}, fres) * (1.0 + 0.5 * probeGlow(ph));
        a *= smoothstep(front, front + FRONT_FADE, depth); // fade in: the front never reads as a cut
        a *= 1.0 - smoothstep(FOG_NEAR, FOG_FAR, depth);   // fog: recede into the page background
        if (uReveal < 100.0) a *= 1.0 - smoothstep(uReveal - 0.25, uReveal, revealDist(ph)); // only during the entrance
        a = clamp(a, 0.0, 0.95);
        hT[nh] = t; hN[nh] = n; hA[nh] = a; nh++;
        T *= 1.0 - a;
      }
      // Jump most of the way through the wall (its thickness along the ray), then step out.
      t += clamp(0.8 * (THICK / (K * 1.1)) / max(abs(dot(n, rd)), 0.35), MIN_STEP * t * 2.0, ${f(C.gyroid.period * 0.05)});
      continue;
    }
    gOut = g;
    t += clamp(d * 0.9, MIN_STEP * t, min(MAX_STEP, max(tCell - t, MIN_STEP * t)));
  }
  if (!reachedCell && T > 0.03 && tCell < tEnd && t >= tCell) reachedCell = true;

  // ── 2. Shade the hits front to back: translucent, wet, lit from the upper left, back-lit ──
  vec3 acc = vec3(0.0);
  T = 1.0;
  vec3 lastBase = TINT1;
  // Depth of the first wall that is actually visible (a faded wall at the front doesn't count).
  float firstDepth = nh > 0 ? hT[nh - 1] * axial : 0.0;
  for (int i = MAX_LAYERS - 1; i >= 0; i--) if (i < nh && hA[i] > 0.2) firstDepth = hT[i] * axial;
  for (int i = 0; i < MAX_LAYERS; i++) {
    if (i >= nh) break;
    float th = hT[i];
    vec3 n = hN[i];
    float a = hA[i];
    vec3 p = ro + rd * th;
    float depth = th * axial;
    vec3 Vd = -rd;
    float fres = pow(1.0 - abs(dot(n, Vd)), ${f(GEL.rimPower)});
    float u = 0.5 + 0.5 * sin(p.x * 0.55 + p.y * 0.35 + 0.8);
    float w = 0.6 * (0.5 + 0.5 * sin(p.y * 0.6 - p.z * 0.45 + 2.3));
    vec3 base = mix(mix(TINT0, TINT1, u), TINT2, w);
    lastBase = base;
    float ao = 0.8; // deeper layers are fogged: a constant is indistinguishable there
    if (i == 0) {
      vec3 n2; float g2;
      ao = mix(0.5, 1.0, clamp(gel(p + n * 0.07, n2, g2) / 0.07, 0.0, 1.0));
    }
    vec3 hemi = mix(GROUND, SKY, dot(n, uUp) * 0.5 + 0.5) * ${f(L.hemisphere.intensity)};
    float diff = max(dot(n, uKey), 0.0) * ${f(L.key.intensity)};
    float bounce = max(dot(n, uBounceDir), 0.0) * ${f(L.bounce.intensity)};
    float tr = max(dot(rd, uRimDir), 0.0);
    float trans = tr * tr * ${f(GEL.transmission)} + max(dot(-n, uRimDir), 0.0) * 0.2;
    float spec = pow(max(dot(n, normalize(uKey + Vd)), 0.0), ${f(GEL.shininess)}) * ${f(GEL.specular)};
    float glow = probeGlow(p);
    vec3 col = base * (hemi + diff * ao) * ao + BOUNCE * bounce * base;
    col += RIM_LIGHT * trans * base * 1.2 + vec3(spec) * ao;
    col += mix(RIM, PROBE_TINT, glow) * fres * (${f(GEL.rimStrength)} + 0.9 * glow);
    col += base * ${f(GEL.scatter)} + PROBE_TINT * glow * 0.14;
    col *= 1.0 - 0.6 * smoothstep(FRONT_NEAR + 0.2, FOG_FAR - 0.4, depth); // the lattice recedes with distance
    col *= exp(-max(depth - firstDepth, 0.0) * ${f(GEL.poreDarkening)}); // looking into a pore goes dark: depth reads clearly
    if (uReveal < 100.0) col += RIM * (1.0 - smoothstep(0.0, 0.22, uReveal - revealDist(p))) * 0.3; // faint entrance front
    acc += T * a * col; // linear; tone-mapped once at the end
    T *= 1.0 - a;
  }

  if (reachedCell && T > 0.03) {
    // ── Cell: translucent membrane over a darker nucleus ──
    vec4 A = uCellA[ci], Cc = uCellC[ci];
    vec3 p = ro + rd * tCell;
    float depth = tCell * axial;
    vec3 nrm = normalize(p - A.xyz);
    float fres = pow(1.0 - max(dot(nrm, -rd), 0.0), 2.2);
    float glowC = Cc.x;
    vec3 mem = mix(MEMBRANES[int(Cc.y)], FLUOR_M, glowC * 0.85);
    vec3 nuc = mix(NUCLEUS, FLUOR_N, glowC * 0.85);
    vec3 oc = p - A.xyz;
    float b = dot(oc, rd);
    float disc = b * b - (dot(oc, oc) - pow(A.w * ${f(CE.nucleusScale)}, 2.0));
    float lit = 0.35 + 0.65 * max(dot(nrm, uKey), 0.0);
    vec3 inner = disc > 0.0 ? nuc * (0.6 + 0.4 * lit) : mem * 0.5;
    vec3 col = mix(inner, mem * lit, mix(${f(CE.membraneOpacity)}, 0.92, fres));
    col += mem * (0.2 + fres * 0.3) + (FLUOR_M * 0.5 + nuc * 0.2) * glowC;
    col *= 1.0 - 0.6 * smoothstep(FRONT_NEAR + 0.2, FOG_FAR - 0.4, depth);
    if (nh > 0) col *= exp(-max(depth - firstDepth, 0.0) * ${f(GEL.poreDarkening)});
    float a = 0.95 * (1.0 - smoothstep(FOG_NEAR, FOG_FAR, depth));
    acc += T * a * col;
    T *= 1.0 - a;
  } else if (nh >= MAX_LAYERS && T > 0.03) {
    // Out of layers: what lies further back is a fogged blend of more gel, not empty space.
    float depth = t * axial;
    acc += T * 0.55 * (1.0 - smoothstep(FOG_NEAR, FOG_FAR, depth)) * lastBase * 0.32;
    T *= 0.45;
  }
  // Tone-map the composited (un-premultiplied) colour once, then premultiply again.
  float alpha = 1.0 - T;
  outColor = vec4(alpha > 1e-4 ? tonemap(acc / alpha) * alpha : vec3(0.0), alpha);
}`;
}
