import * as React from 'react';

/**
 * A porous biomaterial scaffold sphere with cells seeded in its pores, raymarched in a
 * single WebGL1 fragment shader (no dependencies).
 *
 * Geometry: a domain-warped gyroid (the triply periodic minimal surface used for real
 * tissue-engineering scaffolds) clipped to a sphere with rounded cut edges. Cells sit at the
 * gyroid's void centres in the same warped space, so they stay inside the pores while the
 * matrix breathes.
 *
 * Interaction: the sphere tilts toward the pointer on a spring, the pores near the pointer
 * open up and the surface swells toward it, a fast swipe across it spins it with inertia, and a
 * click or tap sends a wave through the matrix that lights the cells. When nobody is pointing,
 * an autonomous probe wanders over it instead.
 */
export interface BioScaffoldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Element whose pointer movement drives the sphere (defaults to the component's own box). */
  trackRef?: React.RefObject<HTMLElement | null>;
  /** Content to keep clear of. The sphere goes in the larger free region: right of it, or above it. */
  avoidRef?: React.RefObject<HTMLElement | null>;
  /** Space kept clear at the top and bottom of the box (fixed header, bottom band), CSS px. */
  insetTop?: number;
  insetBottom?: number;
  /** Largest sphere radius, CSS px. */
  maxRadius?: number;
  /** Static image shown when WebGL is unavailable or the context is lost. */
  fallbackSrc?: string;
  /** Accessible label. The canvas is exposed as one image. */
  label?: string;
}

const CAM = 4; // camera distance, in sphere radii
const HALO = 1.5; // canvas half-size, in sphere radii (room for the halo and the swell)
const LOOP_PULSE = 8; // s between autonomous pulses

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec3 uView;   // sphere centre x, y and radius, drawing-buffer px
uniform float uTime;  // s, drives the breathing
uniform mat3 uRot;    // world -> object
uniform vec4 uProbe;  // object-space point the pointer presses, strength
uniform vec4 uPulse;  // object-space wave origin, age (s; < 0 = none)
uniform float uDetail; // 1 = full shading, 0 = cheaper (no soft shadow)
uniform float uPx;    // hit tolerance: about one drawing-buffer pixel, per unit of ray length

const float PI = 3.14159265;
const float TAU = 6.2831853;
const float FREQ = 13.0;   // pores across the sphere
const float CAM = ${CAM.toFixed(1)};
const float BOUND = 1.16; // bounding sphere for the march (swell included)

float hash3(vec3 p) {
  p = fract(p * vec3(0.1031, 0.1030, 0.0973));
  p += dot(p, p.yxz + 33.33);
  return fract((p.x + p.y) * p.z);
}
float smax(float a, float b, float k) {
  float h = clamp(0.5 - 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) + k * h * (1.0 - h);
}

// Slow organic warp: the lattice never reads as a perfect mathematical surface.
vec3 warp(vec3 q) {
  float t = uTime;
  q += 0.62 * sin(q.zxy * 0.39 + vec3(1.3, 2.1, 0.7) + t * vec3(0.13, 0.11, 0.09));
  q += 0.3 * sin(q.yzx * 0.83 + vec3(4.0, 0.5, 2.2) - t * vec3(0.07, 0.12, 0.1));
  return q;
}

// Cells sit where the gyroid peaks (g = 1.5): 8 points per 2π cell, the centres of one of its
// two labyrinths, i.e. the pores. Positions in units of π.
float gCell; // hash of the cell hit (0 = scaffold)
float gProbe;
float gPulse;

#define SITE(m, k) { \\
  vec3 l = q - (m) * PI; \\
  vec3 id = floor(l / TAU + 0.5); \\
  l -= id * TAU; \\
  float h = hash3(id * 8.0 + float(k)); \\
  if (h < 0.3) { \\
    float cr = mix(0.5, 0.82, fract(h * 17.0)) * (1.0 + 0.22 * probe + 0.25 * pulse) \\
      + 0.05 * sin(uTime * 0.9 + h * 40.0); \\
    /* Fade cells out toward the shell. Under the warp the centre estimate drifts a little \\
       across one cell, so a hard cut would shred it. */ \\
    cr *= smoothstep(R - 0.02, R - 0.16, length(po - l / FREQ)); \\
    float dk = cr > 0.12 ? (length(l) - cr) / (FREQ * 1.7) : 1e3; \\
    if (dk < dc) { dc = dk; ch = h + 0.001; } \\
  } \\
}

float scene(vec3 po) {
  vec3 q = warp(po * FREQ);
  float g = dot(sin(q), cos(q.yzx));

  float pd = length(po - uProbe.xyz);
  float probe = uProbe.w * exp(-pd * pd * 4.5);
  float pulse = 0.0;
  if (uPulse.w >= 0.0) {
    float pr = length(po - uPulse.xyz);
    pulse = exp(-pow((pr - uPulse.w * 1.15) * 5.5, 2.0)) * exp(-uPulse.w * 1.3);
  }
  gProbe = probe;
  gPulse = pulse;

  // Strut thickness varies through the volume; the pointer opens the pores, the wave swells them shut.
  // Struts also thin out toward the shell, so the outside reads as open lattice, not a holed skin.
  float r = length(po);
  float th = 0.02 + 0.3 * sin(dot(q, vec3(0.21, 0.17, 0.25)) + uTime * 0.12)
    - 0.42 * smoothstep(0.72, 1.0, r) - 0.85 * probe + 0.55 * pulse;
  float dLat = (g - th) / (FREQ * 2.1);

  float R = 1.0 + 0.022 * sin(q.x * 0.31 + q.y * 0.23 + uTime * 0.2) + 0.075 * probe + 0.03 * pulse;
  float d = smax(dLat, r - R, 0.04);

  float dc = 1e3;
  float ch = 0.0;
  SITE(vec3(0.25, 0.25, 0.25), 0)
  SITE(vec3(0.25, 1.75, 0.75), 1)
  SITE(vec3(0.75, 1.75, 1.25), 2)
  SITE(vec3(0.75, 0.25, 1.75), 3)
  SITE(vec3(1.75, 0.75, 0.25), 4)
  SITE(vec3(1.75, 1.25, 0.75), 5)
  SITE(vec3(1.25, 1.25, 1.25), 6)
  SITE(vec3(1.25, 0.75, 1.75), 7)
  gCell = dc < d ? ch : 0.0;
  return min(d, dc);
}

// Fine fibres, used for shading only (never for marching). Unwarped: cheap enough for every normal tap.
float fibres(vec3 po) {
  vec3 q = po * 18.7;
  float a = sin(q.x * 3.1 + 1.7 * sin(q.y * 1.3 + q.z * 0.9));
  float b = sin(q.y * 3.5 + 1.5 * sin(q.z * 1.4 + q.x * 0.8));
  float c = sin(q.z * 3.9 + 1.9 * sin(q.x * 1.2 + q.y * 1.5));
  return (a * a * a + b * b * b + c * c * c) / 3.0;
}

vec3 normalAt(vec3 po, float fib) {
  const vec2 e = vec2(1.0, -1.0) * 0.0018;
  return normalize(
    e.xyy * (scene(po + e.xyy) + fib * fibres(po + e.xyy)) +
    e.yyx * (scene(po + e.yyx) + fib * fibres(po + e.yyx)) +
    e.yxy * (scene(po + e.yxy) + fib * fibres(po + e.yxy)) +
    e.xxx * (scene(po + e.xxx) + fib * fibres(po + e.xxx)));
}

float occlusion(vec3 po, vec3 n) {
  float o = 0.0;
  float w = 1.0;
  for (int i = 1; i <= 3; i++) {
    float h = 0.03 * float(i);
    o += (h - scene(po + n * h)) * w;
    w *= 0.6;
  }
  return clamp(1.0 - o * 11.0, 0.0, 1.0);
}

float softShadow(vec3 po, vec3 l) {
  float s = 1.0;
  float t = 0.02;
  for (int i = 0; i < 6; i++) {
    float h = scene(po + l * t);
    s = min(s, 10.0 * h / t);
    t += clamp(h, 0.025, 0.12);
    if (s < 0.02 || t > 0.6) break;
  }
  return clamp(s, 0.0, 1.0);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - uView.xy) / uView.z;
  float rr = length(uv);
  vec3 ro = vec3(0.0, 0.0, CAM);
  vec3 rd = normalize(vec3(uv, -CAM));

  // Soft teal halo: the culture medium glowing round the scaffold. Zero at the canvas edge.
  float halo = exp(-max(rr - 0.8, 0.0) * 3.2) * (1.0 - smoothstep(1.05, ${HALO.toFixed(2)}, rr));
  vec3 haloCol = vec3(0.02, 0.16, 0.2) * halo * 0.42;

  float b = dot(ro, rd);
  float disc = b * b - dot(ro, ro) + BOUND * BOUND;
  if (disc < 0.0) {
    gl_FragColor = vec4(haloCol, max(haloCol.g, haloCol.b) * 1.2);
    return;
  }
  float sq = sqrt(disc);
  float t0 = -b - sq;
  float t1 = -b + sq;
  float t = t0;
  bool hit = false;
  float near = 1e3; // closest approach, in pixels: anti-aliases the silhouette of rays that miss
  for (int i = 0; i < 128; i++) {
    float d = scene(uRot * (ro + rd * t));
    if (d < uPx * t) { hit = true; break; }
    near = min(near, d / (uPx * t));
    t += d * 0.85;
    if (t > t1) break;
  }

  // Path length through the medium inside the sphere: in-scattered haze gives depth.
  float chord = (hit ? t : t1) - t0;
  vec3 haze = vec3(0.03, 0.22, 0.26) * (1.0 - exp(-chord * 0.55));

  if (!hit) {
    vec3 c = haloCol + haze * 0.7;
    float a = clamp(max(c.g, c.b) * 1.4, 0.0, 1.0);
    float cover = (1.0 - smoothstep(1.0, 2.6, near)) * 0.65;
    c = mix(c, vec3(0.04, 0.2, 0.23), cover);
    gl_FragColor = vec4(c, max(a, cover));
    return;
  }

  vec3 pw = ro + rd * t;
  vec3 po = uRot * pw;
  scene(po);
  float cell = gCell;
  float probe = gProbe;
  float pulse = gPulse;
  vec3 no = normalAt(po, cell > 0.0 ? 0.0008 : 0.0026);
  vec3 n = no * uRot; // object -> world (transpose)
  vec3 v = -rd;
  float r = length(po);
  float depthIn = smoothstep(0.08, 0.7, 1.0 - r); // 0 on the shell, 1 deep inside

  vec3 kL = normalize(vec3(-0.55, 0.7, 0.55));
  vec3 fL = normalize(vec3(0.85, -0.25, 0.35));
  vec3 bL = normalize(vec3(0.35, 0.45, -0.8));
  float ao = occlusion(po, no);
  float sh = uDetail > 0.5 ? softShadow(po + no * 0.004, uRot * kL) : 1.0;

  float kd = max(dot(n, kL) * 0.6 + 0.4, 0.0); // wrapped: soft, tissue-like
  float fd = max(dot(n, fL) * 0.5 + 0.5, 0.0);
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 hv = normalize(kL + v);
  float spec = pow(max(dot(n, hv), 0.0), 28.0);
  // Thin walls let the light through.
  float thin = 1.0 - clamp(-scene(po - no * 0.05) / 0.05, 0.0, 1.0);
  float back = max(dot(-n, bL) * 0.5 + 0.5, 0.0);

  vec3 col;
  if (cell > 0.0) {
    bool amber = fract(cell * 7.13) < 0.28;
    vec3 base = amber ? vec3(1.0, 0.5, 0.13) : vec3(0.42, 0.9, 0.74);
    vec3 glow = amber ? vec3(1.0, 0.6, 0.24) : vec3(0.5, 1.0, 0.85);
    // Looking through the membrane to a darker nucleus.
    float facing = max(dot(n, v), 0.0);
    float nucleus = smoothstep(0.6, 0.97, facing);
    vec3 alb = base * mix(1.0, 0.62, nucleus);
    col = alb * (kd * sh * 1.35 + 0.3) * ao;
    col += glow * fres * 0.9;
    col += glow * (0.3 + 0.5 * thin) * back * ao;
    col += vec3(1.0, 0.95, 0.85) * spec * 0.35 * sh;
    // A faint fluorescence, like labelled cells under the microscope.
    col += glow * (amber ? 0.16 : 0.07);
    col += glow * (0.35 * probe + 0.9 * pulse);
  } else {
    float vary = 0.5 + 0.5 * sin(dot(po, vec3(2.3, 1.7, 2.9)) + 1.2);
    vec3 alb = mix(vec3(0.07, 0.56, 0.62), vec3(0.14, 0.6, 0.46), vary * 0.65);
    float fib = fibres(po);
    alb *= 0.85 + 0.25 * fib;
    col = alb * (kd * sh * 1.35 + 0.1) * ao;
    col += vec3(0.04, 0.34, 0.42) * fd * 0.4 * ao;
    col += vec3(0.3, 0.9, 0.92) * (0.1 + thin) * back * 0.5 * ao;
    col += vec3(0.4, 0.92, 1.0) * fres * 0.6 * (1.0 - depthIn);
    col += vec3(0.85, 0.98, 1.0) * spec * 0.22 * sh * (1.0 - depthIn);
    col += vec3(0.2, 0.8, 0.85) * (0.18 * probe + 0.45 * pulse);
  }
  // Object-scale light: the whole sphere is lit from the upper left like one body, with a cool
  // rim where its outline turns away from the camera.
  vec3 sp = normalize(pw);
  float body = smoothstep(-0.7, 0.85, dot(sp, kL));
  col *= mix(0.5, 1.3, body);
  float edge = smoothstep(0.55, 1.0, length(pw.xy)) * (1.0 - depthIn);
  col += vec3(0.25, 0.75, 0.85) * edge * edge * 0.35 * (0.4 + 0.6 * max(dot(sp, bL) + 0.6, 0.0));
  // Deep inside the sphere, light dies away into the medium.
  col *= mix(1.0, 0.18, depthIn);
  col = mix(col, haze * 1.6, clamp(depthIn * 0.6, 0.0, 1.0));
  col += haze * 0.35;

  col = col / (1.0 + col * 0.55); // soft shoulder
  col = pow(col, vec3(0.92));
  gl_FragColor = vec4(col, 1.0);
}
`;

type GLState = {
  gl: WebGLRenderingContext;
  prog: WebGLProgram;
  vs: WebGLShader;
  fs: WebGLShader;
  buf: WebGLBuffer | null;
  ext: { COMPLETION_STATUS_KHR: number } | null;
  ready: boolean;
  u: Record<
    'view' | 'time' | 'rot' | 'probe' | 'pulse' | 'detail' | 'px',
    WebGLUniformLocation | null
  >;
};

function setupGL(gl: WebGLRenderingContext): GLState | null {
  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram();
  if (!prog) return null;
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  // Compile in the background where the driver allows it, so mounting never stalls the page.
  const ext = gl.getExtension('KHR_parallel_shader_compile') as {
    COMPLETION_STATUS_KHR: number;
  } | null;
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.clearColor(0, 0, 0, 0);
  return {
    gl,
    prog,
    vs,
    fs,
    buf,
    ext,
    ready: false,
    u: { view: null, time: null, rot: null, probe: null, pulse: null, detail: null, px: null },
  };
}

/** True once linked and wired; false while still compiling; null if it failed. */
function finishGL(s: GLState): boolean | null {
  const { gl, prog } = s;
  if (s.ready) return true;
  if (s.ext && !gl.getProgramParameter(prog, s.ext.COMPLETION_STATUS_KHR)) return false;
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getShaderInfoLog(s.fs) || gl.getProgramInfoLog(prog));
    return null;
  }
  gl.useProgram(prog);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  s.u = {
    view: gl.getUniformLocation(prog, 'uView'),
    time: gl.getUniformLocation(prog, 'uTime'),
    rot: gl.getUniformLocation(prog, 'uRot'),
    probe: gl.getUniformLocation(prog, 'uProbe'),
    pulse: gl.getUniformLocation(prog, 'uPulse'),
    detail: gl.getUniformLocation(prog, 'uDetail'),
    px: gl.getUniformLocation(prog, 'uPx'),
  };
  s.ready = true;
  return true;
}

function disposeGL(s: GLState) {
  const { gl } = s;
  if (gl.isContextLost()) return;
  gl.deleteProgram(s.prog);
  gl.deleteShader(s.vs);
  gl.deleteShader(s.fs);
  gl.deleteBuffer(s.buf);
}

/** Visual extent of an element's content: its text line boxes and links/buttons, not the full block width. */
function contentRect(el: HTMLElement) {
  const rects: DOMRect[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    range.selectNodeContents(n);
    rects.push(...Array.from(range.getClientRects()));
  }
  range.detach();
  el.querySelectorAll('a, button, img, svg').forEach((c) => rects.push(c.getBoundingClientRect()));
  let l = Infinity;
  let t = Infinity;
  let r = -Infinity;
  let b = -Infinity;
  for (const rc of rects) {
    if (rc.width < 1 || rc.height < 1) continue;
    l = Math.min(l, rc.left);
    t = Math.min(t, rc.top);
    r = Math.max(r, rc.right);
    b = Math.max(b, rc.bottom);
  }
  return r > l ? { left: l, top: t, right: r, bottom: b } : el.getBoundingClientRect();
}

const BOX_PROPS = ['left', 'top', 'width', 'height'] as const;

/** Sizes an element to the sphere's halo box (CSS px, relative to the component's root). */
function fitBox(el: HTMLElement, b: { cx: number; cy: number; r: number }) {
  const half = b.r * HALO;
  el.style.left = `${b.cx - half}px`;
  el.style.top = `${b.cy - half}px`;
  el.style.width = el.style.height = `${half * 2}px`;
}

/** Spring toward a target. Mutates and returns [value, velocity]. */
function spring(x: number, v: number, target: number, w: number, zeta: number, dt: number) {
  v += (w * w * (target - x) - 2 * zeta * w * v) * dt;
  return [x + v * dt, v] as const;
}

export function BioScaffold({
  trackRef,
  avoidRef,
  insetTop = 0,
  insetBottom = 0,
  maxRadius = 340,
  fallbackSrc,
  label = 'Porous biomaterial scaffold seeded with cells',
  className,
  style,
  ...props
}: BioScaffoldProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fallbackRef = React.useRef<HTMLImageElement>(null);
  const [fallback, setFallback] = React.useState(false);
  const opts = React.useRef({ insetTop, insetBottom, maxRadius });
  opts.current = { insetTop, insetBottom, maxRadius };

  React.useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    const track = trackRef?.current ?? root;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ── Layout: where the sphere sits inside the box (CSS px) ───────────────────────────────
    const box = { w: 1, h: 1, cx: 0, cy: 0, r: 1 };
    // Raymarching cost grows with the drawing-buffer pixel count, so the buffer gets a fixed
    // budget (about a 870 px square) rather than following devicePixelRatio: a big desktop sphere
    // renders at 1× (the soft subject holds up), a small phone one at up to 2×. A slow GPU
    // lowers `quality` further.
    const BUDGET = 760_000;
    let quality = 1;
    const place = () => {
      const rb = root.getBoundingClientRect();
      box.w = Math.max(1, rb.width);
      box.h = Math.max(1, rb.height);
      const { insetTop: top, insetBottom: bottom, maxRadius: maxR } = opts.current;
      const avoid = avoidRef?.current;
      let cx = box.w / 2;
      let cy = (top + box.h - bottom) / 2;
      let r = Math.min(box.w, box.h - top - bottom) * 0.42;
      if (avoid) {
        const c = contentRect(avoid);
        const left = c.left - rb.left;
        const right = c.right - rb.left;
        const ctop = c.top - rb.top;
        const gap = Math.max(24, box.w * 0.025);
        const side = Math.max(16, left); // mirror the copy's own gutter on the far side
        // Region to the right of the copy, and region above it.
        const rw = box.w - side - right - gap;
        const rh = box.h - top - bottom;
        const aw = box.w - 2 * side;
        const ah = ctop - gap - top;
        const rightR = Math.min(rw, rh) / 2;
        const aboveR = Math.min(aw, ah) / 2;
        if (rightR >= aboveR) {
          r = rightR * 0.8;
          cx = right + gap + rw / 2;
          cy = top + rh / 2;
        } else {
          r = aboveR * 0.9;
          cx = box.w / 2;
          cy = top + ah / 2;
        }
      }
      box.r = Math.max(40, Math.min(r, maxR));
      box.cx = cx;
      box.cy = cy;
      // The canvas (or the fallback still) covers only the sphere and its halo.
      fitBox(canvas, box);
      if (fallbackRef.current) fitBox(fallbackRef.current, box);
      sizeBuffer();
    };
    const sizeBuffer = () => {
      const css = box.r * HALO * 2;
      const scale = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(BUDGET) / css) * quality;
      const side = Math.max(1, Math.round(css * scale));
      if (canvas.width !== side) canvas.width = canvas.height = side;
    };

    // ── Interaction state ────────────────────────────────────────────────────────────────
    // Pointer in sphere radii from the sphere centre (y up); null when unknown.
    const ptr = { x: 0, y: 0, inside: false, touchAt: -1e9, tap: false, has: false, lx: 0, ly: 0 };
    let clock = 0;
    const toLocal = (e: PointerEvent) => {
      const rb = root.getBoundingClientRect();
      ptr.x = (e.clientX - rb.left - box.cx) / box.r;
      ptr.y = -(e.clientY - rb.top - box.cy) / box.r;
      ptr.has = true;
    };
    const engaged = () => ptr.inside || clock - ptr.touchAt < 2.5;
    // A pointer that just arrived has no motion yet: never read its jump as a swipe.
    const arrive = () => {
      ptr.lx = ptr.x;
      ptr.ly = ptr.y;
    };
    const onMove = (e: PointerEvent) => {
      const fresh = !engaged();
      toLocal(e);
      if (fresh) arrive();
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') ptr.inside = true;
      else ptr.touchAt = clock;
      wake();
    };
    const onDown = (e: PointerEvent) => {
      const fresh = !engaged();
      toLocal(e);
      if (fresh) arrive();
      if (e.pointerType !== 'mouse') ptr.touchAt = clock;
      ptr.tap = true;
      wake();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') ptr.inside = false;
      wake();
    };
    track.addEventListener('pointermove', onMove, { passive: true });
    track.addEventListener('pointerdown', onDown, { passive: true });
    track.addEventListener('pointerleave', onLeave, { passive: true });

    const st = {
      spin: 0.6,
      spinV: 0,
      tiltY: 0,
      tiltYV: 0,
      tiltX: 0,
      tiltXV: 0,
      flipX: 0,
      flipXV: 0,
      // Probe: world point on the sphere the pointer presses, and its strength.
      px: 0.3,
      py: 0.2,
      pvx: 0,
      pvy: 0,
      pw: 0,
      pulseAge: -1,
      pulse: [0, 0, 1] as number[],
      lastAutoPulse: 0,
      time: 0,
    };
    const rot = new Float32Array(9);
    const buildRot = () => {
      // Object orientation R = Rx(pitch) · Ry(yaw); the shader wants world -> object = Rᵀ.
      const yaw = st.spin + st.tiltY;
      const pitch = 0.32 + st.tiltX + st.flipX;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const cx = Math.cos(pitch);
      const sx = Math.sin(pitch);
      // R rows: [cy, 0, sy], [sx*sy, cx, -sx*cy], [-cx*sy, sx, cx*cy]
      // Rᵀ in column-major = R's rows laid out one after another.
      rot.set([cy, 0, sy, sx * sy, cx, -sx * cy, -cx * sy, sx, cx * cy]);
    };
    const toObject = (x: number, y: number, z: number) => [
      rot[0] * x + rot[3] * y + rot[6] * z,
      rot[1] * x + rot[4] * y + rot[7] * z,
      rot[2] * x + rot[5] * y + rot[8] * z,
    ];

    // ── GL ───────────────────────────────────────────────────────────────────────────────
    let gls: GLState | null = null;
    let disposed = false;
    let raf = 0;
    let visible = true;
    let last = -1;
    let shown = false;
    let detail = 1;
    let slow = 0;
    let frames = 0;

    const init = () => {
      const gl = canvas.getContext('webgl', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'default',
      });
      gls = gl ? setupGL(gl) : null;
      if (!gls) setFallback(true);
      return !!gls;
    };

    const settled = () =>
      Math.abs(st.tiltYV) + Math.abs(st.tiltXV) + Math.abs(st.flipXV) + Math.abs(st.spinV) < 1e-3 &&
      Math.abs(st.pvx) + Math.abs(st.pvy) < 1e-3 &&
      st.pulseAge < 0 &&
      (st.pw < 1e-3 || Math.abs(st.pw - pwTarget) < 1e-3);
    let pwTarget = 0;

    const step = (dt: number) => {
      const calm = reduce.matches;
      clock += dt;
      const user = ptr.has && engaged();
      let tx = 0;
      let ty = 0;
      let strength = 0;
      if (user) {
        tx = ptr.x;
        ty = ptr.y;
        const d = Math.hypot(tx, ty);
        strength = 1 - Math.min(1, Math.max(0, (d - 0.95) / 0.75));
      } else if (!calm) {
        // Nobody pointing: a slow autonomous probe wanders over the front of the sphere.
        const t = clock;
        tx = 0.55 * Math.sin(t * 0.31) + 0.2 * Math.sin(t * 0.73 + 1.0);
        ty = 0.42 * Math.sin(t * 0.23 + 2.0) + 0.18 * Math.sin(t * 0.61);
        strength = 0.55;
        if (clock - st.lastAutoPulse > LOOP_PULSE) {
          st.lastAutoPulse = clock;
          ptr.tap = true;
        }
      }
      if (calm) strength *= 0.6;
      pwTarget = strength;

      // Tilt toward the pointer, anywhere over the tracked area, on a soft spring.
      const lim = calm ? 0.5 : 1;
      const yawT = user ? Math.max(-1, Math.min(1, tx * 0.35)) * 0.42 * lim : 0;
      const pitchT = user ? Math.max(-1, Math.min(1, -ty * 0.35)) * 0.3 * lim : 0;
      const w = calm ? 2.2 : 3.4;
      [st.tiltY, st.tiltYV] = spring(st.tiltY, st.tiltYV, yawT, w, 0.8, dt);
      [st.tiltX, st.tiltXV] = spring(st.tiltX, st.tiltXV, pitchT, w, 0.8, dt);

      // The probe point chases the pointer, clamped to the sphere's silhouette.
      let cx = tx;
      let cy = ty;
      const cl = Math.hypot(cx, cy);
      if (cl > 0.97) {
        cx *= 0.97 / cl;
        cy *= 0.97 / cl;
      }
      [st.px, st.pvx] = spring(st.px, st.pvx, cx, calm ? 5 : 9, 0.75, dt);
      [st.py, st.pvy] = spring(st.py, st.pvy, cy, calm ? 5 : 9, 0.75, dt);
      st.pw += (strength - st.pw) * Math.min(1, dt * (strength > st.pw ? 5 : 2.5));

      // A fast swipe across the sphere flicks it round; it coasts and then settles.
      if (user && !calm && strength > 0.3 && dt > 0) {
        const vx = (ptr.x - ptr.lx) / dt;
        const vy = (ptr.y - ptr.ly) / dt;
        const sp = Math.hypot(vx, vy);
        if (sp > 1.2) {
          const k = Math.min(1, (sp - 1.2) / 6) * dt * 9;
          st.spinV = Math.max(-2.6, Math.min(2.6, st.spinV + vx * 0.12 * k));
          st.flipXV = Math.max(-2, Math.min(2, st.flipXV - vy * 0.1 * k));
        }
      }
      ptr.lx = ptr.x;
      ptr.ly = ptr.y;
      st.spinV *= Math.exp(-1.4 * dt);
      [st.flipX, st.flipXV] = spring(st.flipX, st.flipXV, 0, 2.2, 0.35, dt);
      st.spin += ((calm ? 0 : 0.11) + st.spinV) * dt;
      if (!calm) st.time += dt;

      buildRot();

      // Click / tap (or the autonomous beat): a wave through the matrix from where it landed.
      if (ptr.tap) {
        ptr.tap = false;
        if (!calm && strength > 0.2) {
          st.pulse = toObject(cx, cy, Math.sqrt(Math.max(0, 1 - cx * cx - cy * cy)));
          st.pulseAge = 0;
        }
      }
      if (st.pulseAge >= 0) {
        st.pulseAge += dt;
        if (st.pulseAge > 3) st.pulseAge = -1;
      }
    };

    const paint = () => {
      if (!gls || !finishGL(gls)) return false;
      const { gl, u } = gls;
      const z = Math.sqrt(Math.max(0, 1 - st.px * st.px - st.py * st.py));
      const [ox, oy, oz] = toObject(st.px, st.py, z);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const k = canvas.width / (box.r * HALO * 2);
      gl.uniform3f(u.view, canvas.width / 2, canvas.height / 2, box.r * k);
      gl.uniform1f(u.time, st.time);
      gl.uniformMatrix3fv(u.rot, false, rot);
      gl.uniform4f(u.probe, ox, oy, oz, st.pw);
      gl.uniform4f(u.pulse, st.pulse[0], st.pulse[1], st.pulse[2], st.pulseAge);
      gl.uniform1f(u.detail, detail);
      // One buffer pixel spans 1 / (radius px) scene units at the sphere's centre, CAM units away.
      gl.uniform1f(u.px, 1.2 / (box.r * k * CAM));
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!shown) {
        shown = true;
        canvas.style.opacity = '1';
      }
      return true;
    };

    function frame(now: number) {
      raf = 0;
      if (disposed || !gls) return;
      const ok = finishGL(gls);
      if (ok === null) {
        setFallback(true);
        return;
      }
      const dt = last < 0 ? 0 : Math.min((now - last) / 1000, 1 / 20);
      if (last >= 0 && ok) adapt(now - last);
      last = now;
      if (ok) {
        step(dt);
        paint();
      }
      // Under reduced motion, nothing moves on its own: stop once everything has settled.
      const idle = reduce.matches && ok && dt > 0 && settled();
      if (visible && !idle) raf = requestAnimationFrame(frame);
    }
    function wake() {
      if (!raf && visible && !disposed && gls) {
        last = -1;
        raf = requestAnimationFrame(frame);
      }
    }

    // Keep the frame rate: a slow GPU gets fewer pixels, then a cheaper shadow.
    function adapt(ms: number) {
      frames++;
      if (ms > 24 && ms < 250) slow++;
      if (frames < 45) return;
      if (slow > 22) {
        if (quality > 0.55) {
          quality = Math.max(0.55, quality * 0.8);
          sizeBuffer();
        } else detail = 0;
      }
      frames = 0;
      slow = 0;
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    const ro = new ResizeObserver(() => {
      place();
      if (gls && finishGL(gls)) {
        buildRot();
        paint();
      }
    });
    const onMotion = () => wake();
    const onLost = (e: Event) => {
      e.preventDefault(); // allow a restore
      cancelAnimationFrame(raf);
      raf = 0;
      gls = null;
      setFallback(true);
    };
    const onRestored = () => {
      if (disposed) return;
      if (init()) {
        setFallback(false);
        shown = false;
        wake();
      }
    };

    // Layout runs either way: without WebGL it places the fallback image instead.
    const ok = init();
    place();
    buildRot();
    // Warm up the springs so the first frame is already at rest.
    if (ok) for (let i = 0; i < 30; i++) step(1 / 60);
    io.observe(root);
    ro.observe(root);
    const avoid = avoidRef?.current;
    if (avoid) {
      ro.observe(avoid);
      avoid.addEventListener('animationend', place);
    }
    document.fonts?.ready.then(() => !disposed && place());
    reduce.addEventListener('change', onMotion);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);
    if (ok) raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      avoid?.removeEventListener('animationend', place);
      reduce.removeEventListener('change', onMotion);
      track.removeEventListener('pointermove', onMove);
      track.removeEventListener('pointerdown', onDown);
      track.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (gls) disposeGL(gls);
    };
  }, [trackRef, avoidRef]);

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={label}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%', ...style }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          display: 'block',
          opacity: 0,
          transition: 'opacity 0.8s ease-out',
          visibility: fallback ? 'hidden' : 'visible',
        }}
      />
      {fallback && fallbackSrc ? (
        <img
          ref={(el) => {
            fallbackRef.current = el;
            const c = canvasRef.current;
            // Same box as the canvas, which layout keeps up to date.
            if (el && c) for (const k of BOX_PROPS) el.style[k] = c.style[k];
          }}
          src={fallbackSrc}
          alt=""
          decoding="async"
          style={{ position: 'absolute', display: 'block', objectFit: 'contain' }}
        />
      ) : null}
    </div>
  );
}

export default BioScaffold;
