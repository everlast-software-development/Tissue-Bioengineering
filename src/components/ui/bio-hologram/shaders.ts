/**
 * GLSL for the bio hologram (WebGL2). Three programs:
 *   SEG   — instanced glow segments: a camera-facing quad per segment, a glass-tube core with a soft
 *           halo, added as light (struts, fibres, DNA backbones and base pairs).
 *   CELL  — instanced sphere impostors: translucent membrane, swirling organelles, a nucleus.
 *   POINT — soft points: drifting particles and background bokeh.
 */
import { CONFIG } from './config';
import { hex } from './scene-data';

const v3 = (c: readonly number[]) => `vec3(${c.map((x) => x.toFixed(4)).join(', ')})`;

const COMMON_VS = /* glsl */ `
uniform mat4 uMVP;
uniform vec2 uRes;      // drawing buffer, px
uniform vec2 uShift;    // composition offset in NDC
uniform float uFocalPx; // P[1][1] · height / 2: world size → px at depth w
uniform float uPx;      // device pixels per CSS pixel
uniform float uReveal;  // entrance clock, 0 → 1 (≥ 1 = fully shown)
uniform vec3 uPointer;  // NDC x, y, hover strength
uniform vec2 uFade;     // clip-w range over which far geometry dims

float hoverAt(vec2 ndc) {
  vec2 d = (ndc - uPointer.xy) * vec2(uRes.x / uRes.y, 1.0);
  return exp(-dot(d, d) / ${(CONFIG.motion.hoverRadius ** 2).toFixed(5)}) * uPointer.z;
}
`;

export const SEG_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner; // x: 0 → 1 along the segment, y: −1 → 1 across
layout(location = 1) in vec3 aA;
layout(location = 2) in vec3 aB;
layout(location = 3) in vec3 aP;      // world radius, intensity, reveal start
layout(location = 4) in vec3 aCol;
${COMMON_VS}
out vec2 vSA;
out vec2 vSB;
out float vW;
out float vG;
out vec3 vCol;
out float vI;
void main() {
  float grow = clamp((uReveal - aP.z) / 0.12, 0.0, 1.0); // entrance: each segment draws itself A → B
  vec4 ca = uMVP * vec4(aA, 1.0);
  vec4 cb = uMVP * vec4(mix(aA, aB, grow), 1.0);
  ca.xy += uShift * ca.w;
  cb.xy += uShift * cb.w;
  vec2 na = ca.xy / ca.w, nb = cb.xy / cb.w;
  vec2 sa = (na * 0.5 + 0.5) * uRes, sb = (nb * 0.5 + 0.5) * uRes;
  float wc = 0.5 * (ca.w + cb.w);
  float w = max(aP.x * uFocalPx / wc, 0.55 * uPx); // core half-width, px (never thinner than ~1px)
  float g = w * 2.6 + 5.0 * uPx;                    // halo extent, px
  vec2 d = sb - sa;
  float L = length(d);
  vec2 dir = L > 1e-3 ? d / L : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  vec2 p = mix(sa, sb, aCorner.x) + dir * (aCorner.x * 2.0 - 1.0) * g + nrm * aCorner.y * g;
  gl_Position = vec4(p / uRes * 2.0 - 1.0, 0.0, 1.0);
  vSA = sa; vSB = sb; vW = w; vG = g;
  float hover = hoverAt(0.5 * (na + nb));
  float dim = mix(1.0, 0.45, smoothstep(uFade.x, uFade.y, wc)); // depth cue
  vI = aP.y * dim * (1.0 + 1.2 * hover) * step(0.001, grow);
  vCol = mix(aCol, vec3(0.78, 0.98, 1.0), hover * 0.35);
}`;

export const SEG_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vSA;
in vec2 vSB;
in float vW;
in float vG;
in vec3 vCol;
in float vI;
out vec4 o;
void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 ab = vSB - vSA;
  float hr = dot(p - vSA, ab) / max(dot(ab, ab), 1e-4);
  // Each segment owns only its own span: neighbours in a chain don't double up at the joints (no beads).
  if (hr < 0.0 || hr > 1.0) discard;
  float h = hr;
  float d = length(p - vSA - ab * h);
  float core = 1.0 - smoothstep(vW - 0.8, vW + 0.8, d);
  float x = clamp(d / max(vW, 1e-3), 0.0, 1.0);
  float tube = mix(0.5, 1.0, x * x);                 // glass tube: edges brighter than the middle
  float halo = exp(-d * d / (vG * vG * 0.16));
  o = vec4(vCol * vI * (core * tube * 0.95 + halo * 0.34), 0.0);
}`;

export const CELL_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec2 aCorner; // −1 → 1
layout(location = 1) in vec4 aC;      // centre xyz, radius
layout(location = 2) in vec4 aM;      // membrane rgb, tint index
layout(location = 3) in vec2 aS;      // seed, reveal start
${COMMON_VS}
out vec2 vUV;
out vec3 vMem;
out float vTint;
out float vSeed;
out float vI;
out float vHover;
void main() {
  vec4 c = uMVP * vec4(aC.xyz, 1.0);
  c.xy += uShift * c.w;
  float appear = smoothstep(aS.y, aS.y + 0.18, uReveal);
  float rpx = aC.w * uFocalPx / c.w * mix(0.6, 1.0, appear);
  gl_Position = vec4(c.xy / c.w + aCorner * rpx / uRes * 2.0, 0.0, 1.0);
  vUV = aCorner;
  vMem = aM.rgb;
  vTint = aM.a;
  vSeed = aS.x;
  float dim = mix(1.0, 0.5, smoothstep(uFade.x, uFade.y, c.w));
  vI = appear * dim;
  vHover = hoverAt(c.xy / c.w);
}`;

const O = CONFIG.cells.organelles.map(hex);
export const CELL_FS = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUV;
in vec3 vMem;
in float vTint;
in float vSeed;
in float vI;
in float vHover;
uniform float uTime;
out vec4 o;
const vec3 ORG[4] = vec3[4](${O.map(v3).join(', ')});
const vec3 NUC = ${v3(hex(CONFIG.cells.nucleus))};
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.xxy + p.yxx) * p.zyx);
}
void main() {
  float r2 = dot(vUV, vUV);
  if (r2 > 1.0) discard;
  float z = sqrt(1.0 - r2);
  vec3 n = vec3(vUV, z);
  float rim = pow(1.0 - z, 2.0);
  // Organelles: a slowly turning cellular pattern inside the sphere.
  float a = uTime * 0.22 + vSeed * 6.0;
  vec3 q = n * 0.85;
  q.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * q.xz;
  q = q * 3.0 + vSeed * 17.0;
  vec3 iq = floor(q), fq = fract(q);
  float f1 = 9.0;
  vec3 hc = vec3(0.0);
  for (int k = -1; k <= 1; k++)
    for (int j = -1; j <= 1; j++)
      for (int i = -1; i <= 1; i++) {
        vec3 g = vec3(float(i), float(j), float(k));
        vec3 h = hash33(iq + g);
        vec3 r = g + 0.15 + h * 0.7 - fq;
        float d = dot(r, r);
        if (d < f1) { f1 = d; hc = h; }
      }
  float blob = 1.0 - smoothstep(0.1, 0.22, f1);
  int oi = int(mod(vTint + floor(hc.x * 2.99), 4.0));
  vec3 org = ORG[oi];
  float nuc = 1.0 - smoothstep(0.26, 0.32, length(vUV - vec2(0.14, 0.1)));
  vec3 col = vMem * (0.18 + rim * 1.5) + org * blob * (0.55 + 0.75 * z) + NUC * nuc * (0.8 + 0.4 * z);
  col *= 1.0 + 0.9 * vHover;
  float alpha = clamp(0.2 + rim * 0.75 + blob * 0.45 * z + nuc * 0.45, 0.0, 0.95) * vI;
  o = vec4(col * vI, alpha);
}`;

export const POINT_VS = /* glsl */ `#version 300 es
layout(location = 0) in vec3 aPos;   // world (or NDC when uScreen = 1)
layout(location = 1) in vec4 aCol;   // rgb, alpha
layout(location = 2) in float aSize; // CSS px
${COMMON_VS}
uniform float uScreen;
out vec4 vCol;
void main() {
  if (uScreen > 0.5) {
    gl_Position = vec4(aPos.xy, 0.0, 1.0);
    gl_PointSize = aSize * uPx;
    vCol = aCol;
    return;
  }
  vec4 c = uMVP * vec4(aPos, 1.0);
  c.xy += uShift * c.w;
  gl_Position = c;
  gl_PointSize = max(aSize * uPx * (6.0 / c.w), 1.0);
  float dim = mix(1.0, 0.4, smoothstep(uFade.x, uFade.y, c.w));
  vCol = vec4(aCol.rgb * (1.0 + hoverAt(c.xy / c.w)), aCol.a * dim * smoothstep(0.15, 0.6, uReveal));
}`;

export const POINT_FS = /* glsl */ `#version 300 es
precision highp float;
in vec4 vCol;
out vec4 o;
void main() {
  vec2 d = gl_PointCoord * 2.0 - 1.0;
  float r = dot(d, d);
  if (r > 1.0) discard;
  float a = exp(-r * 3.0) * vCol.a;
  o = vec4(vCol.rgb * a, 0.0);
}`;
