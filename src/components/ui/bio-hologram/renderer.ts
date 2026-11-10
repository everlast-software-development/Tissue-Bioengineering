/**
 * Bio hologram renderer (WebGL2, no library). Loaded lazily.
 *
 *   createBioHologram()  — context, programs, buffers; returns a handle (or null without WebGL 2)
 *   ├─ fit()             — camera distance + composition offset for the current layout
 *   ├─ interaction       — pointer tilt + hover glow (mouse), tap glow (touch)
 *   └─ frame()           — entrance, idle motion, helix rebuild, draw; pauses off-screen / hidden
 */
import { CONFIG } from './config';
import { CELL_FS, CELL_VS, POINT_FS, POINT_VS, SEG_FS, SEG_VS } from './shaders';
import { SEG_STRIDE, Segments, buildStatic, helixSegmentCount, hex, writeHelix } from './scene-data';

export interface BioHologramOptions {
  container: HTMLElement;
  host: HTMLElement;
}
export interface BioHologramHandle {
  dispose(): void;
}

const MOT = CONFIG.motion, PERF = CONFIG.perf;
const damp = (k: number, dt: number) => 1 - Math.exp(-k * dt);
const ease = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;

/* ── Minimal column-major mat4 helpers ─────────────────────────────────── */
type M4 = Float32Array;
const mul = (a: M4, b: M4): M4 => {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  return o;
};
const perspective = (fovY: number, aspect: number, near: number, far: number): M4 => {
  const f = 1 / Math.tan(fovY / 2), nf = 1 / (near - far);
  return new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0]);
};
const lookAt = (e: number[], t: number[]): M4 => {
  let z = [e[0] - t[0], e[1] - t[1], e[2] - t[2]];
  const zl = Math.hypot(z[0], z[1], z[2]);
  z = z.map((v) => v / zl);
  let x = [z[2], 0, -z[0]]; // up × z with up = +y
  const xl = Math.hypot(x[0], x[1], x[2]);
  x = x.map((v) => v / xl);
  const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
  return new Float32Array([
    x[0], y[0], z[0], 0, x[1], y[1], z[1], 0, x[2], y[2], z[2], 0,
    -(x[0] * e[0] + x[1] * e[1] + x[2] * e[2]), -(y[0] * e[0] + y[1] * e[1] + y[2] * e[2]), -(z[0] * e[0] + z[1] * e[1] + z[2] * e[2]), 1,
  ]);
};
const rotY = (a: number): M4 => new Float32Array([Math.cos(a), 0, -Math.sin(a), 0, 0, 1, 0, 0, Math.sin(a), 0, Math.cos(a), 0, 0, 0, 0, 1]);
const rotX = (a: number): M4 => new Float32Array([1, 0, 0, 0, 0, Math.cos(a), Math.sin(a), 0, 0, -Math.sin(a), Math.cos(a), 0, 0, 0, 0, 1]);
/** Rotation about the vertical axis through point c. */
const rotYAbout = (a: number, c: readonly number[]): M4 => {
  const m = rotY(a);
  m[12] = c[0] - (m[0] * c[0] + m[8] * c[2]);
  m[14] = c[2] - (m[2] * c[0] + m[10] * c[2]);
  return m;
};
const apply = (m: M4, p: readonly number[]) => [
  m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
  m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
  m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
  m[3] * p[0] + m[7] * p[1] + m[11] * p[2] + m[15],
];

export function createBioHologram({ container, host }: BioHologramOptions): BioHologramHandle | null {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity .6s ease';
  const ctx = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'high-performance' });
  if (!ctx) return null; // No WebGL 2: the section's plain background stays.
  const gl: WebGL2RenderingContext = ctx;

  const reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarseMq = window.matchMedia('(pointer: coarse)');
  const viewport = () => {
    const r = container.getBoundingClientRect();
    return { w: Math.max(1, Math.round(r.width)), h: Math.max(1, Math.round(r.height)) };
  };
  let { w, h } = viewport();
  const lowPower = coarseMq.matches || w < 768;
  let stacked = w < 1024;

  /* ── Data ──────────────────────────────────────────────────────────── */
  const { segments: staticSegs, cells, particles } = buildStatic(lowPower);
  const helixCap = CONFIG.helices.list.reduce((n, hd) => n + helixSegmentCount(hd), 0) + 16;
  const helixSegs = new Segments(helixCap);

  /* ── GL resources ──────────────────────────────────────────────────── */
  type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
  let segProg: Prog | null = null, cellProg: Prog | null = null, pointProg: Prog | null = null;
  let vaoStatic: WebGLVertexArrayObject | null = null, vaoHelix: WebGLVertexArrayObject | null = null;
  let vaoCells: WebGLVertexArrayObject | null = null, vaoPoints: WebGLVertexArrayObject | null = null, vaoBokeh: WebGLVertexArrayObject | null = null;
  let helixBuf: WebGLBuffer | null = null, cellBuf: WebGLBuffer | null = null, pointBuf: WebGLBuffer | null = null;
  const buffers: WebGLBuffer[] = [];
  const UNI = ['uMVP', 'uRes', 'uShift', 'uFocalPx', 'uPx', 'uReveal', 'uPointer', 'uFade', 'uTime', 'uScreen'];

  const program = (vs: string, fs: string): Prog | null => {
    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
        if (import.meta.env.DEV) console.warn('[bio-hologram]', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    const p = gl.createProgram()!;
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    gl.deleteShader(v);
    gl.deleteShader(f);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS) && !gl.isContextLost()) return null;
    const u: Prog['u'] = {};
    for (const n of UNI) u[n] = gl.getUniformLocation(p, n);
    return { p, u };
  };
  const buffer = (data: ArrayBufferView | number, usage: number = gl.STATIC_DRAW) => {
    const b = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    if (typeof data === 'number') gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    else gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    buffers.push(b);
    return b;
  };
  /** Instanced attribute: location, size, stride/offset in floats. */
  const inst = (loc: number, size: number, stride: number, offset: number) => {
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride * 4, offset * 4);
    gl.vertexAttribDivisor(loc, 1);
  };

  const CELL_STRIDE = 10, POINT_STRIDE = 8;
  const cellData = new Float32Array(cells.length * CELL_STRIDE);
  const pointData = new Float32Array(particles.length * POINT_STRIDE);
  const bokehData = new Float32Array(
    CONFIG.bokeh.flatMap((b) => {
      const c = hex(b.colour);
      return [b.ndc[0], b.ndc[1], 0, c[0], c[1], c[2], b.alpha, b.size];
    }),
  );

  const init = () => {
    segProg = program(SEG_VS, SEG_FS);
    cellProg = program(CELL_VS, CELL_FS);
    pointProg = program(POINT_VS, POINT_FS);
    if (!segProg || !cellProg || !pointProg) return false;
    buffers.length = 0;
    const quadSeg = buffer(new Float32Array([0, -1, 1, -1, 0, 1, 1, 1]));
    const quadCell = buffer(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]));
    const segVao = (data: Float32Array | number, usage: number) => {
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadSeg);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const b = buffer(data, usage);
      inst(1, 3, SEG_STRIDE, 0);
      inst(2, 3, SEG_STRIDE, 3);
      inst(3, 3, SEG_STRIDE, 6);
      inst(4, 3, SEG_STRIDE, 9);
      return { vao, b };
    };
    vaoStatic = segVao(staticSegs.data.subarray(0, staticSegs.count * SEG_STRIDE), gl.STATIC_DRAW).vao;
    const hv = segVao(helixCap * SEG_STRIDE * 4, gl.DYNAMIC_DRAW);
    vaoHelix = hv.vao;
    helixBuf = hv.b;

    vaoCells = gl.createVertexArray()!;
    gl.bindVertexArray(vaoCells);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadCell);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    cellBuf = buffer(cellData.byteLength, gl.DYNAMIC_DRAW);
    inst(1, 4, CELL_STRIDE, 0);
    inst(2, 4, CELL_STRIDE, 4);
    inst(3, 2, CELL_STRIDE, 8);

    const pointVao = (data: Float32Array, usage: number) => {
      const vao = gl.createVertexArray()!;
      gl.bindVertexArray(vao);
      const b = buffer(data, usage);
      for (const [loc, size, off] of [[0, 3, 0], [1, 4, 3], [2, 1, 7]] as const) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, POINT_STRIDE * 4, off * 4);
      }
      return { vao, b };
    };
    const pv = pointVao(pointData, gl.DYNAMIC_DRAW);
    vaoPoints = pv.vao;
    pointBuf = pv.b;
    vaoBokeh = pointVao(bokehData, gl.STATIC_DRAW).vao;
    gl.bindVertexArray(null);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    const bg = hex(CONFIG.background);
    gl.clearColor(bg[0], bg[1], bg[2], 1);
    return true;
  };
  if (!init()) return null;
  container.appendChild(canvas);

  /* ── Resolution + camera fit ───────────────────────────────────────── */
  const dprCap = Math.min(window.devicePixelRatio || 1, lowPower ? CONFIG.mobile.dprCap : PERF.dprCap);
  let dpr = dprCap;
  const applySize = () => {
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
  };
  applySize();

  const fovY = (CONFIG.camera.fov * Math.PI) / 180, tanY = Math.tan(fovY / 2);
  let proj: M4 = new Float32Array(16), view: M4 = new Float32Array(16), dist = 6, shift = [0, 0], fadeRange = [6, 9];
  const fit = () => {
    const aspect = w / h, tanX = tanY * aspect;
    const F = stacked ? CONFIG.camera.fit.mobile : CONFIG.camera.fit.desktop;
    const [ex, ey] = CONFIG.camera.extent;
    dist = Math.max(ex / (F.halfWidth * tanX), ey / (F.halfHeight * tanY));
    shift = [...F.shift];
    const L = CONFIG.camera.lookAt;
    proj = perspective(fovY, aspect, 0.1, dist * 4);
    view = lookAt([L[0], L[1] + dist * CONFIG.camera.elevation, L[2] + dist], L as unknown as number[]);
    fadeRange = [dist - 0.6, dist + 2.2];
  };
  fit();

  /* ── Interaction ───────────────────────────────────────────────────── */
  const pointer = { x: 0, y: 0, inside: false, isMouse: false };
  const tilt = { x: 0, y: 0 };
  let hover = 0, tapUntil = -1, idle = 0;
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
      tapUntil = performance.now() + MOT.tapDuration * 1000;
      kick();
    }
    down = null;
  };
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave, { passive: true });
  host.addEventListener('pointerdown', onDown, { passive: true });
  host.addEventListener('pointerup', onUp, { passive: true });

  /* ── Loop ──────────────────────────────────────────────────────────── */
  let raf = 0, last = -1, onScreen = true, lost = false, disposed = false, shown = false;
  let start = -1, frames = 0, warmup: number = PERF.warmupFrames;
  const times: number[] = [];
  let good = 0, lastChange = 0, failed = Infinity;
  const canRun = () => onScreen && !document.hidden && !lost && !disposed;
  function kick() {
    if (!raf && canRun()) {
      last = -1;
      warmup = Math.max(warmup, 10);
      raf = requestAnimationFrame(frame);
    }
  }
  const adapt = (now: number, dt: number) => {
    if (warmup > 0) {
      warmup--;
      return;
    }
    times.push(dt * 1000);
    if (times.length < PERF.sampleFrames) return;
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    times.length = 0;
    if (avg > PERF.slowFrameMs && dpr > PERF.dprMin + 1e-3) {
      failed = dpr;
      dpr = Math.max(PERF.dprMin, dpr - PERF.dprStep);
      applySize();
      lastChange = now;
      good = 0;
      warmup = 5;
    } else if (avg < PERF.fastFrameMs + 2.5) {
      const next = Math.min(dprCap, dpr + PERF.dprStep);
      const cooled = now - lastChange > 8000;
      if (++good >= 3 && next > dpr + 1e-3 && (next < failed - 1e-3 || cooled)) {
        dpr = next;
        applySize();
        lastChange = now;
        good = 0;
        warmup = 5;
        if (cooled) failed = Infinity;
      }
    }
  };

  const S = CONFIG.scaffold;
  function frame(now: number) {
    raf = 0;
    if (!canRun()) return;
    const dt = last < 0 ? 1 / 60 : Math.min(0.1, (now - last) / 1000);
    last = now;
    frames++;
    const reduced = reduceMq.matches;
    if (start < 0) start = now;
    const reveal = reduced ? 2 : ease((now - start) / (MOT.revealDuration * 1000)) * 1.05;

    const tapping = now < tapUntil;
    const probing = (pointer.inside && pointer.isMouse) || tapping;
    const prevHover = hover;
    hover += ((probing ? 1 : 0) - hover) * damp(MOT.hoverFade, dt);
    const tx = pointer.isMouse && pointer.inside ? pointer.x : 0, ty = pointer.isMouse && pointer.inside ? pointer.y : 0;
    const prevTilt = tilt.x + tilt.y;
    tilt.x += (tx - tilt.x) * damp(MOT.tiltDamping, dt);
    tilt.y += (ty - tilt.y) * damp(MOT.tiltDamping, dt);
    if (!reduced) idle += dt * (1 - MOT.idleSlowdown * hover);

    // Scene: drift + parallax tilt. The basket also turns slowly about its own axis.
    const sceneM = mul(rotX(-tilt.y * MOT.tiltPitch), rotY(tilt.x * MOT.tiltYaw + (reduced ? 0 : MOT.driftYaw * Math.sin(idle * 0.07))));
    const vp = mul(proj, view);
    const mvpScene = mul(vp, sceneM);
    const spinM = rotYAbout(reduced ? 0 : idle * S.spin, S.centre);
    const mvpScaffold = mul(mvpScene, spinM);

    // Helices: twist about their axes, bob, and the main one carries a light pulse upwards.
    helixSegs.reset();
    const pulsePeriod = CONFIG.helices.pulse.period;
    const pulse = reduced ? -1 : ((idle % pulsePeriod) / pulsePeriod) * 1.4 - 0.2;
    CONFIG.helices.list.forEach((hd, i) => {
      const phase = reduced ? i : idle * hd.spin + i * 1.7;
      const bob = reduced ? 0 : hd.bob * Math.sin(idle * 0.45 + i * 1.3);
      writeHelix(helixSegs, hd, phase, bob, hd.main ? pulse : -1, 0.36 + (hd.main ? 0 : 0.08 + 0.05 * i));
    });

    // Cells: follow the basket's spin; sorted back to front for alpha blending.
    const order = cells.map((c, i) => {
      const p = apply(spinM, c.c);
      return { i, p, d: apply(mvpScene, p)[3] };
    });
    order.sort((a, b) => b.d - a.d);
    order.forEach(({ i, p }, k) => {
      const c = cells[i];
      const pulseR = reduced ? 1 : 1 + 0.025 * Math.sin(idle * 1.1 + c.seed);
      cellData.set([p[0], p[1], p[2], c.r * pulseR, c.membrane[0], c.membrane[1], c.membrane[2], c.tint, c.seed, c.reveal], k * CELL_STRIDE);
    });
    // Particles rise slowly and twinkle.
    const P = CONFIG.particles, lo = P.box[0], hi = P.box[1], span = hi[1] - lo[1];
    particles.forEach((q, k) => {
      const y = reduced ? q.p[1] : lo[1] + ((((q.p[1] - lo[1] + idle * P.rise * q.speed) % span) + span) % span);
      const tw = reduced ? 0.7 : 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(idle * 1.7 * q.speed + q.phase));
      pointData.set([q.p[0], y, q.p[2], q.colour[0], q.colour[1], q.colour[2], tw * 0.9, q.size], k * POINT_STRIDE);
    });

    draw(mvpScene, mvpScaffold, reveal, probing ? hover : hover);
    if (!shown) {
      shown = true;
      canvas.style.opacity = '1';
    }
    if (!reduced) adapt(now, dt);
    const settling = Math.abs(hover - prevHover) > 1e-4 || Math.abs(tilt.x + tilt.y - prevTilt) > 1e-5 || tapping;
    if (!reduced || settling) raf = requestAnimationFrame(frame);
  }

  function uniforms(pr: Prog, mvp: M4, reveal: number, hv: number) {
    gl.useProgram(pr.p);
    gl.uniformMatrix4fv(pr.u.uMVP, false, mvp);
    gl.uniform2f(pr.u.uRes, canvas.width, canvas.height);
    gl.uniform2f(pr.u.uShift, shift[0], shift[1]);
    gl.uniform1f(pr.u.uFocalPx, proj[5] * canvas.height * 0.5);
    gl.uniform1f(pr.u.uPx, dpr);
    gl.uniform1f(pr.u.uReveal, reveal);
    gl.uniform3f(pr.u.uPointer, pointer.x, pointer.y, hv);
    gl.uniform2f(pr.u.uFade, fadeRange[0], fadeRange[1]);
    gl.uniform1f(pr.u.uTime, idle);
    gl.uniform1f(pr.u.uScreen, 0);
  }

  function draw(mvpScene: M4, mvpScaffold: M4, reveal: number, hv: number) {
    if (!segProg || !cellProg || !pointProg) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // 1. Background bokeh (screen space), added softly.
    gl.blendFunc(gl.ONE, gl.ONE);
    uniforms(pointProg, mvpScene, Math.max(reveal, 0.6), 0);
    gl.uniform1f(pointProg.u.uScreen, 1);
    gl.bindVertexArray(vaoBokeh);
    gl.drawArrays(gl.POINTS, 0, CONFIG.bokeh.length);
    // 2. Cells (alpha, back to front).
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    uniforms(cellProg, mvpScene, reveal, hv);
    gl.bindBuffer(gl.ARRAY_BUFFER, cellBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, cellData);
    gl.bindVertexArray(vaoCells);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, cells.length);
    // 3. Light: scaffold + web, then helices, then particles.
    gl.blendFunc(gl.ONE, gl.ONE);
    uniforms(segProg, mvpScaffold, reveal, hv);
    gl.bindVertexArray(vaoStatic);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, staticSegs.count);
    uniforms(segProg, mvpScene, reveal, hv);
    gl.bindBuffer(gl.ARRAY_BUFFER, helixBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, helixSegs.data, 0, helixSegs.count * SEG_STRIDE);
    gl.bindVertexArray(vaoHelix);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, helixSegs.count);
    uniforms(pointProg, mvpScene, reveal, hv);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, pointData);
    gl.bindVertexArray(vaoPoints);
    gl.drawArrays(gl.POINTS, 0, particles.length);
    gl.bindVertexArray(null);
  }

  /* ── Visibility, resize, context loss ──────────────────────────────── */
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
    applySize();
    fit();
    kick();
  });
  ro.observe(container);
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onRestored = () => {
    lost = false;
    if (init()) kick();
  };
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  kick();

  if (import.meta.env.DEV)
    (window as unknown as Record<string, unknown>).__bioHologram = {
      gl,
      get frames() {
        return frames;
      },
      get dpr() {
        return dpr;
      },
      get hover() {
        return hover;
      },
      get idle() {
        return idle;
      },
      segments: () => staticSegs.count + helixSegs.count,
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
      for (const b of buffers) gl.deleteBuffer(b);
      for (const v of [vaoStatic, vaoHelix, vaoCells, vaoPoints, vaoBokeh]) if (v) gl.deleteVertexArray(v);
      for (const pr of [segProg, cellProg, pointProg]) if (pr) gl.deleteProgram(pr.p);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      canvas.remove();
    },
  };
}
