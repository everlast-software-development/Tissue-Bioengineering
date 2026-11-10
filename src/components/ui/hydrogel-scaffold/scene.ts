/**
 * The Hero gyroid hydrogel scene: one WebGL2 full-screen ray-march (no 3D library, no geometry).
 * Loaded lazily, so none of it is in the main bundle.
 *
 *   createScaffoldScene()  — context + program, returns a handle (or null without WebGL 2)
 *   ├─ interaction         — pointer parallax + probe (mouse), tap probe (touch)
 *   └─ frame()             — damping, uniforms, adaptive resolution, draw; pauses off-screen / hidden
 */
import { CONFIG } from './config';
import { LATTICE_K, latticeBasis, selectCells } from './gyroid';
import { focusNdc, frontDistance, viewTan } from './layout';
import { VERTEX, buildFragment } from './shader';

export interface ScaffoldSceneOptions {
  /** Element the canvas is appended to (fills it). */
  container: HTMLElement;
  /** Element whose pointer events drive the scene (the Hero section). */
  host: HTMLElement;
  /** Called once the first frame has rendered. */
  onReady?: () => void;
}

export interface ScaffoldSceneHandle {
  dispose(): void;
}

const MOT = CONFIG.motion;
const PERF = CONFIG.perf;
const CAM = CONFIG.camera.distance;

/** Exponential smoothing factor for rate k over dt seconds. */
const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const norm = (v: number[]) => {
  const l = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
};
/** R = Rx(pitch)·Ry(yaw), row-major (the lattice's rotation, object → world). */
const rotation = (pitch: number, yaw: number) => {
  const ca = Math.cos(pitch), sa = Math.sin(pitch), cb = Math.cos(yaw), sb = Math.sin(yaw);
  return [cb, 0, sb, sa * sb, ca, -sa * cb, -ca * sb, sa, ca * cb];
};
/** Rᵀ·v (world → object). */
const mulT = (r: number[], v: number[]) => [
  r[0] * v[0] + r[3] * v[1] + r[6] * v[2],
  r[1] * v[0] + r[4] * v[1] + r[7] * v[2],
  r[2] * v[0] + r[5] * v[1] + r[8] * v[2],
];
const transpose = (r: number[]) => [r[0], r[3], r[6], r[1], r[4], r[7], r[2], r[5], r[8]];

const UNIFORMS = [
  'uRes', 'uTan', 'uInvRot', 'uRot', 'uTrans', 'uTime', 'uMotion', 'uReveal', 'uStacked', 'uProbe',
  'uViewAxis', 'uFocus', 'uKey', 'uRimDir', 'uBounceDir', 'uUp', 'uBasis', 'uBasisT', 'uCellA', 'uCellB', 'uCellC', 'uCellS', 'uCellCount',
] as const;
type UniformName = (typeof UNIFORMS)[number];

export function createScaffoldScene({ container, host, onReady }: ScaffoldSceneOptions): ScaffoldSceneHandle | null {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText =
    'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity .6s ease';
  const context = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });
  if (!context) return null; // No WebGL 2: the section's plain background stays.
  const gl: WebGL2RenderingContext = context;

  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarseMq = window.matchMedia('(pointer: coarse)');
  const viewport = () => {
    const r = container.getBoundingClientRect();
    return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) };
  };
  let { w, h } = viewport();
  const lowPower = coarseMq.matches || w < 768;
  let stacked = w < 1024; // the Hero's lg breakpoint

  /* ── Program ─────────────────────────────────────────────────────────── */
  const maxCells = lowPower ? CONFIG.mobile.cellCount : CONFIG.cells.count;
  const fragment = buildFragment(
    lowPower
      ? { maxSteps: CONFIG.mobile.maxSteps, maxLayers: CONFIG.mobile.maxLayers, maxCells }
      : { maxSteps: CONFIG.march.maxSteps, maxLayers: CONFIG.gel.maxLayers, maxCells },
  );
  let program: WebGLProgram | null = null;
  const loc = {} as Record<UniformName, WebGLUniformLocation | null>;

  // Static uniforms: lattice basis (object → phase, and its transpose) and the pore centres.
  const { X, Y, Z } = latticeBasis();
  const K = LATTICE_K;
  const basis = new Float32Array([...X, ...Y, ...Z].map((v) => v * K)); // column-major: columns K·X, K·Y, K·Z
  const basisT = new Float32Array(transpose(Array.from(basis)));

  const init = () => {
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        if (import.meta.env.DEV) console.warn('[hydrogel] shader', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERTEX), fs = compile(gl.FRAGMENT_SHADER, fragment);
    if (!vs || !fs) return false;
    const p = gl.createProgram()!;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) {
      if (import.meta.env.DEV) console.warn('[hydrogel] link', gl.getProgramInfoLog(p));
      gl.deleteProgram(p);
      return false;
    }
    program = p;
    gl.useProgram(p);
    for (const u of UNIFORMS) loc[u] = gl.getUniformLocation(p, u);
    gl.uniformMatrix3fv(loc.uBasis, false, basis);
    gl.uniformMatrix3fv(loc.uBasisT, false, basisT);
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    return true;
  };
  if (!init()) return null;
  container.appendChild(canvas);

  /* ── Resolution ──────────────────────────────────────────────────────── */
  const budget = lowPower ? CONFIG.mobile.pixelBudget : PERF.pixelBudget;
  const scaleFor = () =>
    Math.max(PERF.scaleMin, Math.min(window.devicePixelRatio || 1, PERF.scaleCap, Math.sqrt(budget / (w * h))));
  let scaleCap = scaleFor();
  let scale = scaleCap;
  const applySize = () => {
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
  };
  applySize();

  /* ── Interaction ─────────────────────────────────────────────────────── */
  const pointer = { x: 0, y: 0, inside: false, isMouse: false };
  const tilt = { x: 0, y: 0 };
  let tapUntil = -1;
  let probeStrength = 0;
  let probeSnap = true;
  const probeObj = [0, 0, 0];
  let idle = 0;

  const toNdc = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
  };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    toNdc(e);
    pointer.inside = true;
    pointer.isMouse = true;
    kick();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    pointer.inside = false;
    kick();
  };
  let down: { x: number; y: number; t: number } | null = null;
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === 'touch') down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onUp = (e: PointerEvent) => {
    if (e.pointerType !== 'touch' || !down) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) < 12 && performance.now() - down.t < 500) {
      toNdc(e);
      pointer.isMouse = false;
      if (probeStrength < 0.05) probeSnap = true;
      tapUntil = performance.now() + MOT.tapDuration * 1000;
      kick();
    }
    down = null;
  };
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave, { passive: true });
  host.addEventListener('pointerdown', onDown, { passive: true });
  host.addEventListener('pointerup', onUp, { passive: true });

  /* ── Render loop ─────────────────────────────────────────────────────── */
  let raf = 0;
  let last = -1;
  let onScreen = true;
  let contextLost = false;
  let disposed = false;
  let shown = false;
  let revealStart = -1;
  let frames = 0;
  let warmup: number = PERF.warmupFrames;
  const frameTimes: number[] = [];
  let goodWindows = 0;
  let lastScaleChange = 0;
  let failedScale = Infinity;
  let forceProbe: number | null = null; // dev harness only

  const canRun = () => onScreen && !document.hidden && !contextLost && !disposed && program !== null;
  function kick() {
    if (!raf && canRun()) {
      last = -1;
      warmup = Math.max(warmup, 10);
      raf = requestAnimationFrame(frame);
    }
  }

  const adaptResolution = (now: number, dt: number) => {
    if (warmup > 0) {
      warmup--;
      return;
    }
    frameTimes.push(dt * 1000);
    if (frameTimes.length < PERF.sampleFrames) return;
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    frameTimes.length = 0;
    if (avg > PERF.slowFrameMs) {
      goodWindows = 0;
      if (scale > PERF.scaleMin + 1e-3) {
        failedScale = scale;
        scale = Math.max(PERF.scaleMin, scale - PERF.scaleStep);
        applySize();
        lastScaleChange = now;
        warmup = 5;
      }
    } else if (avg < PERF.fastFrameMs + 2.5) {
      goodWindows++;
      // Step back up slowly, and not straight back to a level that was too slow.
      const next = Math.min(scaleCap, scale + PERF.scaleStep);
      const cooled = now - lastScaleChange > 8000;
      if (goodWindows >= 3 && next > scale + 1e-3 && (next < failedScale - 1e-3 || cooled)) {
        scale = next;
        applySize();
        lastScaleChange = now;
        goodWindows = 0;
        warmup = 5;
        if (cooled) failedScale = Infinity;
      }
    }
  };

  let tan = viewTan(w / h);
  /** Entrance origin (object space, resting pose) and the radius that covers the whole view from it. */
  const focusFor = () => {
    const fo = focusNdc(stacked);
    const d = (stacked ? CONFIG.volume.mobileFrontNear : CONFIG.volume.frontNear) + 1.1;
    return [fo.x * d * tan[0], fo.y * d * tan[1], CAM - d];
  };
  const revealRadiusFor = (f: number[]) => {
    const B = CONFIG.volume.back, tx = B * tan[0] + 1, ty = B * tan[1] + 1;
    let r = 0;
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) r = Math.max(r, Math.hypot(sx * tx - f[0], sy * ty - f[1], CAM - B - f[2]));
    return r + 0.5;
  };
  let focusObj = focusFor();
  let revealRadius = revealRadiusFor(focusObj);

  /* Cells: chosen once for this layout, animated per frame on the CPU. */
  let cells = selectCells({ aspect: w / h, stacked, count: maxCells });
  const cellA = new Float32Array(maxCells * 4), cellB = new Float32Array(maxCells * 4), cellC = new Float32Array(maxCells * 4);
  const cellS = new Float32Array(maxCells * 4);
  const updateCells = (reduced: boolean, reveal: number, viewAxis: number[], R: number[], trans: number[]) => {
    const pr = MOT.probeRadius;
    for (let i = 0; i < cells.length; i++) {
      const e = cells[i];
      // Probe proximity (same ellipsoidal falloff as the shader).
      const dx = e.c[0] - probeObj[0], dy = e.c[1] - probeObj[1], dz = e.c[2] - probeObj[2];
      const along = dx * viewAxis[0] + dy * viewAxis[1] + dz * viewAxis[2];
      const lat2 = dx * dx + dy * dy + dz * dz - along * along;
      const near = Math.exp((-(lat2 + along * along * 0.3) / (pr * pr)) * 0.8) * probeStrength;
      const dl = Math.hypot(dx, dy, dz) || 1;
      const crawl = reduced ? 0 : MOT.crawl * Math.sin(idle * 0.7 + e.phase);
      const ripple = reduced ? 1 : 1 + MOT.ripple * Math.sin(idle * 1.1 + e.phase * 1.7);
      const fr = Math.hypot(e.c[0] - focusObj[0], e.c[1] - focusObj[1], e.c[2] - focusObj[2]);
      const grow = 1 - Math.min(1, Math.max(0, (fr - (reveal - 0.3)) / 0.3));
      for (let k = 0; k < 3; k++) cellA[i * 4 + k] = e.c[k] + e.axis[k] * crawl - ([dx, dy, dz][k] / dl) * MOT.cellMigration * near;
      cellA[i * 4 + 3] = e.r * ripple * grow * (1 + 0.12 * near); // a little swelling towards the probe
      cellB.set([...e.axis, e.elongation], i * 4);
      // Screen-space bound (ndc, y units): project the centre; radius covers the elongated cell.
      const cx = cellA[i * 4], cy = cellA[i * 4 + 1], cz = cellA[i * 4 + 2];
      const wx = R[0] * cx + R[1] * cy + R[2] * cz + trans[0];
      const wy = R[3] * cx + R[4] * cy + R[5] * cz + trans[1];
      const wd = CAM - (R[6] * cx + R[7] * cy + R[8] * cz + trans[2]);
      cellS.set([wx / (wd * tan[0]), wy / (wd * tan[1]), (cellA[i * 4 + 3] * e.elongation * 1.25) / (wd * tan[1]) + 0.004, 0], i * 4);
      cellC.set([near, e.palette, 0, 0], i * 4);
    }
    gl.uniform4fv(loc.uCellA, cellA);
    gl.uniform4fv(loc.uCellB, cellB);
    gl.uniform4fv(loc.uCellC, cellC);
    gl.uniform4fv(loc.uCellS, cellS);
    gl.uniform1i(loc.uCellCount, cells.length);
  };

  const L = CONFIG.lights;
  const keyW = norm([...L.key.direction]), rimW = norm([...L.rim.direction]), bounceW = norm([...L.bounce.direction]);

  function frame(now: number) {
    raf = 0;
    if (!canRun()) return;
    const dt = last < 0 ? 1 / 60 : Math.min(0.1, (now - last) / 1000);
    last = now;
    frames++;
    const reduced = reduceMq.matches;

    // Probe: mouse hovering the Hero, or a recent tap.
    const tapping = now < tapUntil;
    const probing = (pointer.inside && pointer.isMouse) || tapping;
    const prevStrength = probeStrength;
    probeStrength += ((probing ? 1 : 0) - probeStrength) * damp(MOT.probeFade, dt);

    // Parallax: damped tilt towards the pointer (mouse; a tap leans in gently).
    const tx = pointer.isMouse && pointer.inside ? pointer.x : tapping ? pointer.x * 0.35 : 0;
    const ty = pointer.isMouse && pointer.inside ? pointer.y : tapping ? pointer.y * 0.35 : 0;
    const prevTilt = tilt.x + tilt.y;
    tilt.x += (tx - tilt.x) * damp(MOT.tiltDamping, dt);
    tilt.y += (ty - tilt.y) * damp(MOT.tiltDamping, dt);

    // Idle clock: slows by ~75 % while probing; stopped with reduced motion.
    if (!reduced) idle += dt * (1 - MOT.idleSlowdown * probeStrength);
    const ph = idle * MOT.driftSpeed * 2 * Math.PI;
    const driftYaw = reduced ? 0 : MOT.driftYaw * Math.sin(ph * 0.35);
    const driftPitch = reduced ? 0 : MOT.driftPitch * Math.sin(ph * 0.27 + 1.3);
    const R = rotation(-tilt.y * MOT.tiltPitch + driftPitch, tilt.x * MOT.tiltYaw + driftYaw);
    const sway = reduced ? 0 : MOT.sway;
    const trans = [
      tilt.x * MOT.tiltTranslate + sway * Math.sin(idle * 0.55),
      tilt.y * MOT.tiltTranslate + sway * Math.sin(idle * 0.47 + 1.7),
      sway * Math.sin(idle * 0.51 + 3.1),
    ];

    // Probe point: pointer ray, a little behind the lattice front, in object space; damped.
    if (probing) {
      const d = Math.min(CONFIG.volume.back - 1, frontDistance(pointer.x, pointer.y, stacked) + MOT.probeDepthOffset);
      const pw = [pointer.x * tan[0] * d - trans[0], pointer.y * tan[1] * d - trans[1], CAM - d - trans[2]];
      const target = mulT(R, pw);
      const k = probeSnap ? 1 : damp(MOT.probeDamping, dt);
      for (let i = 0; i < 3; i++) probeObj[i] += (target[i] - probeObj[i]) * k;
      probeSnap = false;
    } else if (probeStrength < 0.01) probeSnap = true;

    // Entrance (once).
    if (revealStart < 0) revealStart = now;
    const rt = reduced ? 1 : Math.min(1, (now - revealStart) / (MOT.revealDuration * 1000));
    const reveal = rt >= 1 ? 1e3 : easeInOutCubic(rt) * revealRadius;

    draw(R, trans, reduced, reveal);
    if (!shown) {
      shown = true;
      canvas.style.opacity = '1';
      onReady?.();
    }
    if (!reduced) adaptResolution(now, dt);

    // Keep animating: always with motion; with reduced motion only until the hover response settles.
    const settling =
      Math.abs(probeStrength - prevStrength) > 1e-4 || Math.abs(tilt.x + tilt.y - prevTilt) > 1e-5 || tapping || rt < 1;
    if (!reduced || settling) raf = requestAnimationFrame(frame);
  }

  function draw(R: number[], trans: number[], reduced: boolean, reveal: number) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(loc.uRes, canvas.width, canvas.height);
    gl.uniform2f(loc.uTan, tan[0], tan[1]);
    gl.uniformMatrix3fv(loc.uInvRot, false, R); // row-major R = column-major Rᵀ
    gl.uniformMatrix3fv(loc.uRot, false, transpose(R));
    gl.uniform3fv(loc.uTrans, trans);
    gl.uniform1f(loc.uTime, idle);
    gl.uniform1f(loc.uMotion, reduced ? 0 : 1);
    gl.uniform1f(loc.uReveal, reveal);
    gl.uniform1f(loc.uStacked, stacked ? 1 : 0);
    gl.uniform4f(loc.uProbe, probeObj[0], probeObj[1], probeObj[2], forceProbe ?? probeStrength);
    const viewAxis = norm(mulT(R, [-trans[0], -trans[1], CAM - trans[2]]));
    gl.uniform3fv(loc.uViewAxis, viewAxis);
    updateCells(reduced, reveal, viewAxis, R, trans);
    gl.uniform3fv(loc.uFocus, focusObj);
    gl.uniform3fv(loc.uKey, mulT(R, keyW));
    gl.uniform3fv(loc.uRimDir, mulT(R, rimW));
    gl.uniform3fv(loc.uBounceDir, mulT(R, bounceW));
    gl.uniform3fv(loc.uUp, mulT(R, [0, 1, 0]));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  /* ── Visibility, resize, context loss ────────────────────────────────── */
  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    if (onScreen) kick();
  });
  io.observe(host);
  const onVis = () => kick();
  document.addEventListener('visibilitychange', onVis);
  const onReduce = () => kick();
  reduceMq.addEventListener('change', onReduce);

  const ro = new ResizeObserver(() => {
    const v = viewport();
    if (v.w === w && v.h === h) return;
    ({ w, h } = v);
    stacked = w < 1024;
    tan = viewTan(w / h);
    focusObj = focusFor();
    revealRadius = revealRadiusFor(focusObj);
    cells = selectCells({ aspect: w / h, stacked, count: maxCells }); // cheap (<2 ms): pore sites are analytic
    const prevCap = scaleCap;
    scaleCap = scaleFor();
    scale = Math.min(scaleCap, scale * (scaleCap / prevCap)); // keep any adaptive reduction, relative to the new cap
    applySize();
    kick();
  });
  ro.observe(container);

  const onLost = (e: Event) => {
    e.preventDefault();
    contextLost = true;
    program = null;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onRestored = () => {
    contextLost = false;
    if (init()) kick();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  kick();

  // Dev-only handle for the verification harness (stripped from production builds).
  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__hydrogel = {
      gl,
      get frames() {
        return frames;
      },
      get scale() {
        return scale;
      },
      get probe() {
        return probeStrength;
      },
      get idle() {
        return idle;
      },
      /** Render once with the probe strength forced (A/B captures), then release. */
      renderWithProbe(v: number) {
        forceProbe = v;
        frame(performance.now());
        forceProbe = null;
      },
    };

  return {
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      reduceMq.removeEventListener('change', onReduce);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      host.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (program) gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
